import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  canGenerate: () => boolean;
  isTrialActive: () => boolean;
  isSubscriptionActive: () => boolean;
  getTrialDaysLeft: () => number;
  daysLeft: number;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboardingTour: (data?: Partial<UserProfile>) => Promise<void>;
  dismissOnboardingTour: () => Promise<void>;
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
  const isOffline = error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable'));
  
  const currentAuthUser = authUser || auth.currentUser;

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
    }
    console.error('Firestore Permission Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  if (isOffline) {
    console.warn(`Firestore ${operationType} at ${path} failed because the client is offline. Using cache.`);
    // Don't re-throw for GET operations if we want to fallback to whatever we have
    if (operationType === OperationType.GET) return;
  }

  throw error;
}

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

  const TRIAL_RESET_DATE = new Date('2026-05-11T00:00:00Z');
  const TRIAL_DURATION_DAYS = 3;

  const isTrialActive = () => {
    return getTrialDaysLeft() > 0;
  };

  const getTrialDaysLeft = () => {
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
  };

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

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const isSubscriptionActive = () => {
    if (!profile) return false;
    if (profile.subscriptionStatus !== 'active') return false;
    
    const subEndDate: any = profile.subscriptionEndDate;
    if (!subEndDate) return true; // Lifetime/Null end date
    
    const endDate = (typeof subEndDate === 'object' && 'toDate' in subEndDate)
      ? subEndDate.toDate()
      : new Date(subEndDate);
    
    return new Date() < endDate;
  };

  const canGenerate = () => {
    if (isAdmin) return true;
    
    // Full access during the 3-day period regardless of status (Restarted for all)
    // We check if trial is active first
    if (isTrialActive()) return true;
    
    // Otherwise check for subscription
    return isSubscriptionActive();
  };

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
          const docRef = doc(db, 'users', user.uid);
          
          // Use onSnapshot for real-time updates and better offline support
          profileUnsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              // If email is missing in profile but exists in user auth, sync it
              if (!data.email && user.email) {
                await setDoc(docRef, { email: user.email }, { merge: true });
              }
              
              // Auto-fix: If they have school/level but onboardingComplete is missing, sync it
              if (!data.onboardingComplete && data.school && data.level) {
                await setDoc(docRef, { onboardingComplete: true }, { merge: true });
                data.onboardingComplete = true;
              }

              // Reset trial for all existing accounts as requested (one-time reset for May 2026)
              // Only apply this reset if their trialStartDate is actually before or on the reset date, 
              // so we never overwrite a brand-new user's recent sign-up date!
              const actualStartDate = getSafeDate(data.trialStartDate);
              if (!data.trialResetMay2026Applied && actualStartDate <= TRIAL_RESET_DATE) {
                await setDoc(docRef, { 
                  trialStartDate: TRIAL_RESET_DATE.toISOString(),
                  subscriptionStatus: 'trial',
                  trialResetMay2026Applied: true 
                }, { merge: true });
              } else if (!data.trialResetMay2026Applied) {
                // For brand new accounts that somehow missed this flag, just mark it true without modifying their newer start date
                await setDoc(docRef, { 
                  trialResetMay2026Applied: true 
                }, { merge: true });
              }
              
              // Backfill / enforce used_emails for existing users
              const currentEmail = data.email || user.email;
              if (currentEmail) {
                const cleanedEmail = currentEmail.trim().toLowerCase();
                try {
                  // Fetch the existing record to see if they already had a trial started earlier
                  const usedEmailRef = doc(db, 'used_emails', cleanedEmail);
                  const usedEmailSnap = await getDoc(usedEmailRef);
                  let originalTrialStart: Date | null = null;
                  
                  if (usedEmailSnap.exists()) {
                    const usedData = usedEmailSnap.data();
                    if (usedData && usedData.createdAt) {
                      originalTrialStart = getSafeDate(usedData.createdAt);
                    }
                  }
                  
                  const actualTrialStart = getSafeDate(data.trialStartDate);
                  
                  // May 2026 Reset aware effective dates comparison
                  const effectiveOriginalStart = originalTrialStart && originalTrialStart < TRIAL_RESET_DATE
                    ? TRIAL_RESET_DATE
                    : originalTrialStart;
                  const effectiveActualStart = actualTrialStart < TRIAL_RESET_DATE
                    ? TRIAL_RESET_DATE
                    : actualTrialStart;

                  if (effectiveOriginalStart && effectiveOriginalStart < effectiveActualStart) {
                    // There's an older trial start date recorded! Restrict this account's trial to the original date of first preparation.
                    await setDoc(docRef, { 
                      trialStartDate: effectiveOriginalStart.toISOString() 
                    }, { merge: true });
                    data.trialStartDate = effectiveOriginalStart.toISOString();
                  } else {
                    // Otherwise update / secure used_emails record with the earliest known trialStartDate
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
                let originalTrialStart: any = pendingTrialStart || null;
                
                if (targetEmail && !originalTrialStart) {
                  try {
                    const emailDocSnap = await getDoc(doc(db, 'used_emails', targetEmail));
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

                const newProfile: any = {
                  uid: user.uid,
                  email: user.email || pendingEmail || '',
                  displayName: user.displayName || (isAnonymous ? 'Guest Teacher' : 'Teacher'),
                  trialStartDate: finalTrialStart.toISOString(),
                  subscriptionStatus: 'trial',
                  trialResetMay2026Applied: true,
                  onboardingComplete: isAnonymous ? true : false, 
                  isAnonymous: isAnonymous,
                  createdAt: originalTrialStart ? new Date(originalTrialStart).toISOString() : serverTimestamp(),
                  lastLoginAt: serverTimestamp(),
                };
                try {
                  await setDoc(docRef, newProfile);
                  if (newProfile.email) {
                    const cleanedEmail = newProfile.email.trim().toLowerCase();
                    try {
                      await setDoc(doc(db, 'used_emails', cleanedEmail), {
                        uid: user.uid,
                        isAnonymous: isAnonymous,
                        createdAt: originalTrialStart ? new Date(originalTrialStart).toISOString() : serverTimestamp()
                      }, { merge: true });
                    } catch (e) {
                      console.error("Error writing to used_emails:", e);
                    }
                  }
                  setProfile(newProfile); 
                } catch (err) {
                  console.error("Error creating initial profile:", err);
                }
              };

              await checkAndBuildProfile();
            }
            setLoading(false);
          }, (error) => {
            console.error("Profile snapshot error:", error);
            const isOffline = error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable'));
            if (!isOffline) {
              handleFirestoreError(error, OperationType.GET, `users/${user.uid}`, user);
            }
            setLoading(false);
          });
        } else {
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const logout = () => signOut(auth);

  const refreshProfile = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, logout, refreshProfile, 
      canGenerate, isTrialActive, isSubscriptionActive, getTrialDaysLeft, daysLeft,
      completeOnboarding, completeOnboardingTour, dismissOnboardingTour, updateProfileData, updateProfileEmail
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
