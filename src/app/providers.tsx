"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

type UserProfile = {
  email: string;
  plan: "free" | "pro";
  countries: string[];
  themes: string[];
  alertThreshold: number;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, plan: "free" | "pro") => Promise<void>;
  signInWithGoogle: (plan?: "free" | "pro") => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const ensureUserDoc = async (user: User, plan: "free" | "pro" = "free") => {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return;

  await setDoc(ref, {
    email: user.email || "",
    plan,
    countries: ["FR", "EU"],
    themes: [],
    alertThreshold: 70,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          await ensureUserDoc(nextUser);
          const ref = doc(db, "users", nextUser.uid);
          unsubscribeProfile = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
              setProfile(snap.data() as UserProfile);
            }
          });
        } catch {
          // On garde l'accès même si l'écriture échoue
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signIn: async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(credential.user);
      },
      signUp: async (email, password, plan) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(credential.user, plan);
      },
      signInWithGoogle: async (plan = "free") => {
        const credential = await signInWithPopup(auth, googleProvider);
        await ensureUserDoc(credential.user, plan);
      },
      signOutUser: async () => {
        await signOut(auth);
      },
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
};
