import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Initialize new user profile
        const newProfile: any = {
          uid,
          email: auth.currentUser?.email || '',
          displayName: auth.currentUser?.displayName || 'Teacher',
          trialStartDate: serverTimestamp(),
          subscriptionStatus: 'trial',
        };
        await setDoc(docRef, newProfile);
        // Fetch again to get the data (or just set local state)
        const freshSnap = await getDoc(docRef);
        setProfile(freshSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to guest profile on error to allow access
      setProfile({
        uid: 'guest',
        email: auth.currentUser?.email || 'guest@teachsmart.gh',
        displayName: auth.currentUser?.displayName || 'Guest Teacher',
        subscriptionStatus: 'active',
        trialStartDate: new Date()
      } as any);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          await fetchProfile(user.uid);
        } else {
          // Provide a default guest profile for easy access
          setProfile({
            uid: 'guest',
            email: 'guest@teachsmart.gh',
            displayName: 'Guest Teacher',
            subscriptionStatus: 'active',
            trialStartDate: new Date()
          } as any);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
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
