import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
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

  const isTrialActive = () => {
    if (!profile || profile.subscriptionStatus !== 'trial') return false;
    const startDate = profile.trialStartDate ? new Date(profile.trialStartDate) : new Date();
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 15; // 15-day trial
  };

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';

  const canGenerate = () => {
    if (isAdmin) return true;
    if (!profile) return false;
    
    // Check if subscription has an end date and if it's expired
    if (profile.subscriptionStatus === 'active') {
      const subEndDate: any = profile.subscriptionEndDate;
      if (!subEndDate) return true; // Lifetime/Null end date
      
      const endDate = (typeof subEndDate === 'object' && 'toDate' in subEndDate)
        ? subEndDate.toDate()
        : new Date(subEndDate);
      
      return new Date() < endDate;
    }
    
    // Free access during trial period
    if (profile.subscriptionStatus === 'trial') {
      return isTrialActive();
    }
    
    return false;
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profilePath = `users/${user.uid}`;
    try {
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
              setProfile(data);
            } else {
              // Initialize new user profile if it doesn't exist
              const newProfile: any = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || 'Teacher',
                trialStartDate: new Date().toISOString(),
                subscriptionStatus: 'trial',
                onboardingComplete: false,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
              };
              try {
                await setDoc(docRef, newProfile);
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
      canGenerate, isTrialActive,
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
