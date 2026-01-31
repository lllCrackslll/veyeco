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
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const ensureUserDoc = async (user: User) => {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return;

  await setDoc(ref, {
    email: user.email || "",
    plan: "free",
    countries: ["FR", "EU"],
    themes: [],
    alertThreshold: 70,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          await ensureUserDoc(nextUser);
        } catch {
          // On garde l'accès même si l'écriture échoue
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(credential.user);
      },
      signUp: async (email, password) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(credential.user);
      },
      signInWithGoogle: async () => {
        const credential = await signInWithPopup(auth, googleProvider);
        await ensureUserDoc(credential.user);
      },
      signOutUser: async () => {
        await signOut(auth);
      },
    }),
    [user, loading]
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
