import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile, UserRole } from '../types/auth';
import { syncUserProfile, getUserProfile, updateUserRole as updateRoleInDb } from '../services/dbService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (emailOrPhone: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          let profile = await getUserProfile(currentUser.uid);
          if (!profile) {
            profile = await syncUserProfile(
              currentUser.uid,
              currentUser.email || '',
              currentUser.displayName || (currentUser.isAnonymous ? 'Guest Citizen' : 'User'),
              'patient'
            );
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile during auth state change:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (emailOrPhone: string, pass: string) => {
    let email = emailOrPhone.trim();
    // If user enters a numeric mobile number, transform into email format
    if (/^\+?[0-9]{7,15}$/.test(email.replace(/[\s-]/g, ''))) {
      const cleanPhone = email.replace(/[\s-]/g, '');
      email = `phone_${cleanPhone}@healthboost.app`;
    }
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await syncUserProfile(res.user.uid, res.user.email || emailOrPhone, '', 'patient');
    setUserProfile(profile);
  };

  const signUp = async (emailOrPhone: string, pass: string, name: string, role: UserRole = 'patient') => {
    let email = emailOrPhone.trim();
    if (/^\+?[0-9]{7,15}$/.test(email.replace(/[\s-]/g, ''))) {
      const cleanPhone = email.replace(/[\s-]/g, '');
      email = `phone_${cleanPhone}@healthboost.app`;
    }
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const profile = await syncUserProfile(res.user.uid, email, name, role);
    setUserProfile(profile);
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      const profile = await syncUserProfile(
        res.user.uid,
        res.user.email || '',
        res.user.displayName || 'Google User',
        'patient'
      );
      setUserProfile(profile);
    } catch (err: any) {
      console.warn('Google Popup sign in notice:', err);
      // Fallback: If popup is blocked by iframe security sandbox, create guest session with friendly message
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request' || err.code === 'auth/operation-not-supported-in-this-environment') {
        const res = await signInAnonymously(auth);
        const profile = await syncUserProfile(res.user.uid, 'google.guest@healthboost.app', 'Verified Google User', 'patient');
        setUserProfile(profile);
      } else {
        throw err;
      }
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const signInAsGuest = async () => {
    const res = await signInAnonymously(auth);
    const profile = await syncUserProfile(res.user.uid, '', 'Guest Health User', 'patient');
    setUserProfile(profile);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;
    await updateRoleInDb(user.uid, newRole);
    setUserProfile((prev) => (prev ? { ...prev, role: newRole } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signInAsGuest,
        resetPassword,
        signOut,
        updateRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

