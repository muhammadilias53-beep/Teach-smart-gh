import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { canonicalizeEmail } from '../lib/emailSecurity';
import { isFirestoreQuotaOrOfflineError } from '../lib/firestore-errors';

export type GenerationBlockReason = 'none' | 'trial_daily_limit' | 'trial_expired' | 'no_credits';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isQuotaExceeded: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  canGenerate: () => boolean;
  consumeCredit: () => Promise<boolean>;
  canBulkExport: () => boolean;
  isTrialActive: () => boolean;
  isSubscriptionActive: () => boolean;
  getTrialDaysLeft: () => number;
  daysLeft: number;
  aiCredits: number;
  trialDailyLimit: number;
  trialGenerationsLeftToday: number;
  getTrialGenerationsUsedToday: () => number;
  getTrialGenerationsLeftToday: () => number;
  getGenerationBlockReason: () => GenerationBlockReason;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboardingTour: (data?: Partial<UserProfile>) => Promise<void>;
  dismissOnboardingTour: () => Promise<void>;
  acceptTermsAndConditions: (termsVersion?: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  updateProfileEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null, authUser: User | null = null) {
  const isQuotaOrOffline = isFirestoreQuotaOrOfflineError(error);
  const currentAuthUser = authUser || auth.currentUser;

  if (isQuotaOrOffline) {
    console.warn(`[AuthContext Resilient Mode] Firestore ${operationType} on ${path || 'unknown'} fell back to local cache:`, error?.message || error);
    return;
  }

  if (error?.code === 'permission-denied') {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: currentAuthUser?.uid,
        email: currentAuthUser?.email,
        emailVerified: currentAuthUser?.emailVerified,
        isAnonymous: currentAuthUser?.isAnonymous,
      },
      operationType,
      path
    };
    console.error('Firestore Permission Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  console.warn(`[AuthContext] Firestore ${operationType} non-fatal issue:`, error?.message || error);
}

// Local cache helpers to preserve offline/quota-resilient profile state
const getCachedProfile = (uid: string): UserProfile | null => {
  try {
    const raw = localStorage.getItem(`teachsmart_cached_profile_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
};

const saveCachedProfile = (uid: string, prof: UserProfile) => {
  try {
    localStorage.setItem(`teachsmart_cached_profile_${uid}`, JSON.stringify(prof));
  } catch (_) {}
};

// Helper to get date from various formats (string, timestamp, serial object, or null)
const getSafeDate = (d: any) => {
  if (!d) return new Date();
  if (typeof d?.toDate === 'function') return d.toDate();
  if (d && typeof d === 'object' && typeof d.seconds === 'number') {
    return new Date(d.seconds * 1000);
  }
  const date = new Date(d);
  return isNaN(date.getTime()) ? new Date() : date;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);

  const TRIAL_RESET_DATE = new Date('2026-05-11T00:00:00Z');
  const TRIAL_DURATION_DAYS = 3;
  const TRIAL_DAILY_LIMIT = 2; // Option B: 2 generations per day during 3-day trial (max 6 total)

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';
  const aiCredits = profile?.aiCredits ?? 0;

  function isSubscriptionActive(): boolean {
    if (!profile) return false;
    if (profile.subscriptionStatus !== 'active') return false;
    
    const subEndDate: any = profile.subscriptionEndDate;
    if (!subEndDate) return true; // Lifetime/Null end date
    
    const endDate = (typeof subEndDate === 'object' && 'toDate' in subEndDate)
      ? subEndDate.toDate()
      : new Date(subEndDate);
    
    return new Date() < endDate;
  }

  function getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getTrialDaysLeft(): number {
    if (!profile) return 0;

    let startDate = getSafeDate(profile.trialStartDate);
    
    // For universal reset, we ensure everyone uses the reset date as the start
    // ONLY if their actual start date was on or before the reset and they haven't applied the reset.
    // Brand-new users who register AFTER the reset date (e.g. late May 2026)
    // should always get their full actual trial starting on their signup date.
    if (startDate <= TRIAL_RESET_DATE && !profile.trialResetMay2026Applied) {
      startDate = TRIAL_RESET_DATE;
    }
    
    const now = new Date();
    const elapsedMs = now.getTime() - startDate.getTime();
    const msInDay = 24 * 60 * 60 * 1000;
    
    const totalDurationMs = TRIAL_DURATION_DAYS * msInDay;
    const remainingMs = totalDurationMs - elapsedMs;
    
    // Precision countdown: Math.ceil guarantees that they get exactly 72 hours from registration.
    // E.g., if only 1 minute has passed, Math.ceil(71.98h / 24) is 3, so they still have 3 days left
    // instead of losing a calendar day instantly on midnight rollover.
    const remainingDays = Math.ceil(remainingMs / msInDay);
    
    return isNaN(remainingDays) ? 0 : Math.max(0, Math.min(TRIAL_DURATION_DAYS, remainingDays));
  }

  function isTrialActive(): boolean {
    return getTrialDaysLeft() > 0;
  }

  function getTrialGenerationsUsedToday(): number {
    if (!profile) return 0;
    const today = getTodayDateString();
    if (profile.trialGenerationsDate === today) {
      return profile.trialGenerationsToday || 0;
    }
    return 0;
  }

  function getTrialGenerationsLeftToday(): number {
    if (!isTrialActive()) return 0;
    const used = getTrialGenerationsUsedToday();
    return Math.max(0, TRIAL_DAILY_LIMIT - used);
  }

  const trialDailyLimit = TRIAL_DAILY_LIMIT;
  const trialGenerationsLeftToday = getTrialGenerationsLeftToday();

  function getGenerationBlockReason(): GenerationBlockReason {
    if (isAdmin) return 'none';
    if (isSubscriptionActive()) return 'none';
    if (aiCredits > 0) return 'none';
    if (isTrialActive()) {
      return getTrialGenerationsLeftToday() > 0 ? 'none' : 'trial_daily_limit';
    }
    return 'trial_expired';
  }

  // Auto-update daysLeft every minute to catch day changes reliably
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getTrialDaysLeft();
      setDaysLeft(remaining);
    };

    updateCountdown();
    
    // Use a more frequent check (every minute) to handle day transitions and tab being left open
    const interval = setInterval(updateCountdown, 60000); 

    return () => clearInterval(interval);
  }, [profile]);

  function canGenerate(): boolean {
    if (isAdmin) return true;
    
    // Active subscription grants access (with fair-use cap on 24-hour sprint)
    if (isSubscriptionActive()) {
      if (profile?.plan === 'quick_pass') {
        const quickUsed = profile?.quickPassGenerationsUsed ?? 0;
        return quickUsed < 15;
      }
      return true;
    }

    // Flexible Pay-As-You-Go: check if teacher has purchased AI credits available
    if ((profile?.aiCredits ?? 0) > 0) return true;

    // Option B: 3-day trial with daily limit of 2 generations per day (max 6 total)
    if (isTrialActive()) {
      return getTrialGenerationsLeftToday() > 0;
    }

    return false;
  }

  async function consumeCredit(): Promise<boolean> {
    // Admin access
    if (isAdmin) return true;

    // Active subscription access
    if (isSubscriptionActive()) {
      // For 24-Hour Weekend Sprint, enforce fair-use cap of 15 generations
      if (profile?.plan === 'quick_pass') {
        const quickUsed = profile?.quickPassGenerationsUsed ?? 0;
        if (quickUsed >= 15) return false;
        const newUsed = quickUsed + 1;
        if (profile) {
          setProfile(prev => prev ? { ...prev, quickPassGenerationsUsed: newUsed } : null);
        }
        if (user) {
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              quickPassGenerationsUsed: newUsed,
              lastGenerationAt: serverTimestamp()
            });
          } catch (err) {
            console.error("Failed to update quickPass generation usage in Firestore:", err);
          }
        }
        return true;
      }
      return true;
    }

    const today = getTodayDateString();
    const trialActive = isTrialActive();
    const trialUsedToday = getTrialGenerationsUsedToday();

    // 1. If teacher has free trial generations left today, consume trial quota first
    if (trialActive && trialUsedToday < TRIAL_DAILY_LIMIT) {
      const newTodayCount = trialUsedToday + 1;
      const currentTotal = profile?.trialTotalGenerations || 0;
      const newTotal = currentTotal + 1;

      // Optimistic local state update
      if (profile) {
        setProfile(prev => prev ? {
          ...prev,
          trialGenerationsDate: today,
          trialGenerationsToday: newTodayCount,
          trialTotalGenerations: newTotal
        } : null);
      }

      // Persist to Firestore
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            trialGenerationsDate: today,
            trialGenerationsToday: newTodayCount,
            trialTotalGenerations: newTotal,
            lastGenerationAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to update daily trial generation quota in Firestore:", err);
        }
      }
      return true;
    }

    // 2. Otherwise, check if teacher has purchased AI credits
    const currentCredits = profile?.aiCredits ?? 0;
    if (currentCredits <= 0) {
      return false;
    }

    const newCredits = Math.max(0, currentCredits - 1);

    // Optimistic local state update
    if (profile) {
      setProfile(prev => prev ? { ...prev, aiCredits: newCredits } : null);
    }

    // Persist decrement in Firestore
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          aiCredits: increment(-1),
          lastGenerationAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Failed to decrement AI credit in Firestore:", err);
      }
    }
    return true;
  }

  function canBulkExport(): boolean {
    if (isAdmin) return true;
    if (!isSubscriptionActive()) return false;
    
    // Explicit bulk export flag granted on user profile
    if (profile?.hasBulkExport === true) return true;

    // Special subscription modes that include Bulk Termly Export:
    // 'termly_pro' (Termly Master & Bulk Export), 'yearly' (Professional Yearly), 'lifetime', or 'school_license' / 'school_starter' / 'school_pro'
    const specialBulkPlans = ['termly_pro', 'yearly', 'lifetime', 'school_license', 'school_starter', 'school_pro'];
    const userPlan = profile?.plan || profile?.planType || '';
    return specialBulkPlans.includes(userPlan);
  }

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    try {
      // Optimistic update
      if (profile) {
        setProfile({ ...profile, ...data, onboardingComplete: true, profileCompleted: true });
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        onboardingComplete: true,
        profileCompleted: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  };

  const completeOnboardingTour = async (optionalData?: Partial<UserProfile>) => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    try {
      const updates: any = {
        hasSeenOnboardingTour: true,
        onboardingTourDismissed: true,
        updatedAt: serverTimestamp(),
      };

      if (optionalData && Object.keys(optionalData).length > 0) {
        Object.assign(updates, optionalData);
        if (optionalData.school || optionalData.level || optionalData.subjectsTaught?.length) {
          updates.profileCompleted = true;
          updates.onboardingComplete = true;
        }
      }

      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      try {
        localStorage.setItem(`teachsmart_tour_seen_${user.uid}`, 'true');
      } catch (_) {}

      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  };

  const dismissOnboardingTour = async () => {
    if (!user) return;
    try {
      try {
        localStorage.setItem(`teachsmart_tour_seen_${user.uid}`, 'true');
      } catch (_) {}

      if (profile) {
        setProfile({ ...profile, hasSeenOnboardingTour: true, onboardingTourDismissed: true });
      }

      await setDoc(doc(db, 'users', user.uid), {
        hasSeenOnboardingTour: true,
        onboardingTourDismissed: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Could not save tour dismissal to firestore:", err);
    }
  };

  const acceptTermsAndConditions = async (termsVersion = '2026.1') => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    const now = new Date().toISOString();
    const updates: Partial<UserProfile> & { updatedAt: any } = {
      acceptedTerms: true,
      acceptedTermsAt: now,
      termsVersion,
      acceptedResponsibleAiTerms: true,
      updatedAt: serverTimestamp()
    };

    try {
      try {
        localStorage.setItem(`teachsmart_terms_accepted_${user.uid}`, 'true');
      } catch (_) {}

      if (profile) {
        setProfile({
          ...profile,
          acceptedTerms: true,
          acceptedTermsAt: now,
          termsVersion,
          acceptedResponsibleAiTerms: true
        });
      }

      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    try {
      if (profile) {
        setProfile({ ...profile, ...data });
      }
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  };

  const updateProfileEmail = async (email: string) => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  };

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Clean up previous profile listener if it exists
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      try {
        setUser(user);
        if (user) {
          // Instant cache check so the app loads immediately without waiting or hanging on quota limits
          const initialCached = getCachedProfile(user.uid);
          if (initialCached) {
            setProfile(initialCached);
            setLoading(false);
          }

          const docRef = doc(db, 'users', user.uid);
          
          // Use onSnapshot for real-time updates and better offline support
          profileUnsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              // If email is missing in profile but exists in user auth, sync it
              if (!data.email && user.email) {
                try {
                  await setDoc(docRef, { email: user.email }, { merge: true });
                } catch (_) {}
              }
              
              // Auto-fix: If they have school/level but onboardingComplete is missing, sync it
              if (!data.onboardingComplete && data.school && data.level) {
                try {
                  await setDoc(docRef, { onboardingComplete: true }, { merge: true });
                  data.onboardingComplete = true;
                } catch (_) {}
              }

              // Reset trial for all existing accounts as requested (one-time reset for May 2026)
              const actualStartDate = getSafeDate(data.trialStartDate);
              if (!data.trialResetMay2026Applied && actualStartDate <= TRIAL_RESET_DATE) {
                try {
                  await setDoc(docRef, { 
                    trialStartDate: TRIAL_RESET_DATE.toISOString(),
                    subscriptionStatus: 'trial',
                    trialResetMay2026Applied: true 
                  }, { merge: true });
                } catch (_) {}
              } else if (!data.trialResetMay2026Applied) {
                try {
                  await setDoc(docRef, { 
                    trialResetMay2026Applied: true 
                  }, { merge: true });
                } catch (_) {}
              }
              
              // Backfill / enforce used_emails for existing users (wrapped in try/catch to avoid breaking snapshot)
              const currentEmail = data.email || user.email;
              if (currentEmail) {
                const canonicalKey = canonicalizeEmail(currentEmail);
                try {
                  const usedEmailRef = doc(db, 'used_emails', canonicalKey);
                  const usedEmailSnap = await getDoc(usedEmailRef);
                  let originalTrialStart: Date | null = null;
                  
                  if (usedEmailSnap.exists()) {
                    const usedData = usedEmailSnap.data();
                    if (usedData && usedData.createdAt) {
                      originalTrialStart = getSafeDate(usedData.createdAt);
                    }
                  }
                  
                  const actualTrialStart = getSafeDate(data.trialStartDate);
                  const effectiveOriginalStart = originalTrialStart && originalTrialStart < TRIAL_RESET_DATE
                    ? TRIAL_RESET_DATE
                    : originalTrialStart;
                  const effectiveActualStart = actualTrialStart < TRIAL_RESET_DATE
                    ? TRIAL_RESET_DATE
                    : actualTrialStart;

                  if (effectiveOriginalStart && effectiveOriginalStart < effectiveActualStart) {
                    await setDoc(docRef, { 
                      trialStartDate: effectiveOriginalStart.toISOString() 
                    }, { merge: true });
                    data.trialStartDate = effectiveOriginalStart.toISOString();
                  } else {
                    const finalUsedStartDate = effectiveOriginalStart && effectiveOriginalStart < effectiveActualStart 
                      ? effectiveOriginalStart 
                      : effectiveActualStart;
                      
                    const isNewRecord = !usedEmailSnap.exists();
                    const isOlder = effectiveOriginalStart && effectiveActualStart < effectiveOriginalStart;
                    const isDifferentUid = usedEmailSnap.exists() && usedEmailSnap.data()?.uid !== user.uid;
                    
                    if (isNewRecord || isOlder || isDifferentUid) {
                      await setDoc(usedEmailRef, {
                        uid: user.uid,
                        isAnonymous: data.isAnonymous || false,
                        createdAt: finalUsedStartDate.toISOString()
                      }, { merge: true });
                    }
                  }
                } catch (e) {
                  console.warn("Could not sync email to used_emails:", e);
                }
              }

              setProfile(data);
              saveCachedProfile(user.uid, data);
              setIsQuotaExceeded(false);
            } else {
              // Initialize new user profile if it doesn't exist
              const isAnonymous = user.isAnonymous;
              const pendingEmail = isAnonymous ? localStorage.getItem('pending_guest_email') : null;
              if (pendingEmail) {
                localStorage.removeItem('pending_guest_email');
              }
              const pendingTrialStart = isAnonymous ? localStorage.getItem('pending_guest_trial_start') : null;
              if (pendingTrialStart) {
                localStorage.removeItem('pending_guest_trial_start');
              }

              const checkAndBuildProfile = async () => {
                const targetEmail = (user.email || pendingEmail || '').trim().toLowerCase();
                const canonicalKey = canonicalizeEmail(targetEmail);
                let originalTrialStart: any = pendingTrialStart || null;
                
                if (canonicalKey && !originalTrialStart) {
                  try {
                    const emailDocSnap = await getDoc(doc(db, 'used_emails', canonicalKey));
                    if (emailDocSnap.exists()) {
                      const emailData = emailDocSnap.data();
                      if (emailData && emailData.createdAt) {
                        originalTrialStart = getSafeDate(emailData.createdAt).toISOString();
                      }
                    }
                  } catch (e) {
                    console.warn("Could not check used_emails during onAuthStateChanged flow:", e);
                  }
                }

                // Apply May 2026 Reset-awareness to trialStartDate assignment
                const baseTrialStart = originalTrialStart ? getSafeDate(originalTrialStart) : new Date();
                const finalTrialStart = baseTrialStart < TRIAL_RESET_DATE ? TRIAL_RESET_DATE : baseTrialStart;

                const newProfile: UserProfile = {
                  uid: user.uid,
                  email: user.email || pendingEmail || '',
                  displayName: user.displayName || (isAnonymous ? 'Guest Teacher' : 'Teacher'),
                  trialStartDate: finalTrialStart.toISOString(),
                  subscriptionStatus: 'trial',
                  trialResetMay2026Applied: true,
                  onboardingComplete: isAnonymous ? true : false, 
                  isAnonymous: isAnonymous,
                  createdAt: originalTrialStart ? new Date(originalTrialStart).toISOString() : new Date().toISOString(),
                  lastLoginAt: new Date().toISOString(),
                };
                try {
                  await setDoc(docRef, newProfile);
                  if (newProfile.email) {
                    try {
                      await setDoc(doc(db, 'used_emails', canonicalKey), {
                        uid: user.uid,
                        isAnonymous: isAnonymous,
                        createdAt: originalTrialStart ? new Date(originalTrialStart).toISOString() : new Date().toISOString()
                      }, { merge: true });
                    } catch (e) {
                      console.error("Error writing to used_emails:", e);
                    }
                  }
                } catch (err) {
                  console.warn("Error saving initial profile to firestore (using local cache):", err);
                }
                setProfile(newProfile);
                saveCachedProfile(user.uid, newProfile);
              };

              await checkAndBuildProfile();
            }
            setLoading(false);
          }, (error) => {
            console.warn("Profile snapshot listener fallback (quota or network):", error);
            const isQuotaOrOffline = isFirestoreQuotaOrOfflineError(error);
            if (isQuotaOrOffline) {
              setIsQuotaExceeded(true);
            }
            
            // Check if we have a locally cached profile
            const cached = getCachedProfile(user.uid);
            if (cached) {
              setProfile(cached);
            } else {
              // Construct a safe, operational fallback profile so the user is not locked out
              const fallback: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || (user.isAnonymous ? 'Guest Teacher' : 'Teacher'),
                school: localStorage.getItem('teachsmart_school_name') || 'Ghana Basic School',
                level: 'JHS',
                subscriptionStatus: 'active', // Graceful allowance during quota limits
                trialStartDate: new Date().toISOString(),
                onboardingComplete: true,
                isAnonymous: user.isAnonymous,
                role: user.email === 'muhammadilias53@gmail.com' ? 'admin' : 'teacher',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
              };
              setProfile(fallback);
              saveCachedProfile(user.uid, fallback);
            }
            setLoading(false);
          });
        } else {
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.warn("Auth state change error:", error);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('teachsmart_last_working_route');
      sessionStorage.removeItem('teachsmart_fresh_login');
    } catch (_) {}
    return signOut(auth);
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
          saveCachedProfile(user.uid, data);
        }
      } catch (err) {
        console.warn("refreshProfile fell back to cache:", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, isQuotaExceeded, logout, refreshProfile, 
      canGenerate, consumeCredit, canBulkExport, isTrialActive, isSubscriptionActive, getTrialDaysLeft, daysLeft, aiCredits,
      trialDailyLimit, trialGenerationsLeftToday, getTrialGenerationsUsedToday, getTrialGenerationsLeftToday, getGenerationBlockReason,
      completeOnboarding, completeOnboardingTour, dismissOnboardingTour, acceptTermsAndConditions, updateProfileData, updateProfileEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
