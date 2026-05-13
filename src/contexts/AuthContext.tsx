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
  getTrialDaysLeft: () => number;
  daysLeft: number;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  const TRIAL_RESET_DATE = new Date('2026-05-11T00:00:00Z');
  const TRIAL_DURATION_DAYS = 14;

  const isTrialActive = () => {
    return getTrialDaysLeft() > 0;
  };

  const getTrialDaysLeft = () => {
    if (!profile) return 0;
    
    // Helper to get date from various formats (string, timestamp, or null)
    const getSafeDate = (d: any) => {
      if (!d) return new Date();
      if (typeof d?.toDate === 'function') return d.toDate();
      const date = new Date(d);
      return isNaN(date.getTime()) ? new Date() : date;
    };

    let startDate = getSafeDate(profile.trialStartDate);
    
    // For universal reset, we ensure everyone uses the reset date as the start
    // if their actual start date was before or shortly after the reset.
    if (startDate <= TRIAL_RESET_DATE || !profile.trialResetMay2026Applied) {
      startDate = TRIAL_RESET_DATE;
    }
    
    const now = new Date();
    const diffDays = differenceInCalendarDays(now, startDate);
    
    const remaining = TRIAL_DURATION_DAYS - diffDays;
    return isNaN(remaining) ? 0 : Math.max(0, remaining);
  };

  // Auto-update daysLeft every midnight
  useEffect(() => {
    const updateCountdown = () => {
      setDaysLeft(getTrialDaysLeft());
    };

    updateCountdown();

    // Calculate time until next midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msToMidnight = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      updateCountdown();
      // Setup interval for subsequent midnights
      const interval = setInterval(updateCountdown, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msToMidnight);

    return () => clearTimeout(timer);
  }, [profile]);

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const canGenerate = () => {
    if (isAdmin) return true;
    
    // Full access during the 14-day period regardless of status (Restarted for all)
    // We check if trial is active first
    if (isTrialActive()) return true;
    
    if (!profile) return false;
    
    // Check if subscription is active after trial period
    if (profile.subscriptionStatus === 'active') {
      const subEndDate: any = profile.subscriptionEndDate;
      if (!subEndDate) return true; // Lifetime/Null end date
      
      const endDate = (typeof subEndDate === 'object' && 'toDate' in subEndDate)
        ? subEndDate.toDate()
        : new Date(subEndDate);
      
      return new Date() < endDate;
    }
    
    return false;
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    try {
      // Optimistic update
      if (profile) {
        setProfile({ ...profile, ...data, onboardingComplete: true });
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        onboardingComplete: true,
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
      console.log(`[Auth] State changed: ${user ? 'User logged in (' + user.uid + ')' : 'No user session'}`);
      
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
              if (!data.trialResetMay2026Applied) {
                await setDoc(docRef, { 
                  trialStartDate: TRIAL_RESET_DATE.toISOString(),
                  subscriptionStatus: 'trial',
                  trialResetMay2026Applied: true 
                }, { merge: true });
              }
              
              setProfile(data);
            } else {
              // Initialize new user profile if it doesn't exist
              const isAnonymous = user.isAnonymous;
              const newProfile: any = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || (isAnonymous ? 'Guest Teacher' : 'Teacher'),
                trialStartDate: TRIAL_RESET_DATE.toISOString(), // Start from reset date for all
                subscriptionStatus: 'trial',
                trialResetMay2026Applied: true,
                onboardingComplete: isAnonymous ? true : false, 
                isAnonymous: isAnonymous,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
              };
              try {
                await setDoc(docRef, newProfile);
                setProfile(newProfile); 
              } catch (err) {
                console.error("Error creating initial profile:", err);
              }
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
      canGenerate, isTrialActive, getTrialDaysLeft, daysLeft,
      completeOnboarding, updateProfileEmail
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
