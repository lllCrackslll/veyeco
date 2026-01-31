"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/Card";
import { useAuth } from "@/app/providers";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChoosePlanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFree = async () => {
    if (!user) {
      setError("Connecte-toi pour continuer.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        plan: "free",
        updatedAt: serverTimestamp(),
      });
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePro = async () => {
    if (!user) {
      setError("Connecte-toi pour continuer.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const apiBase = process.env.NEXT_PUBLIC_API_BASE;
      if (!apiBase) {
        throw new Error("API non configurée.");
      }
      const response = await fetch(`${apiBase}/createCheckoutSession`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Impossible de créer la session Stripe.");
      }
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("URL Stripe manquante.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Choix du plan
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white font-display mt-2">
            Choisissez votre plan
          </h1>
          <p className="text-gray-400 mt-2">
            Vous pourrez changer plus tard dans Paramètres.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white font-display">
                Gratuit
              </h2>
              <p className="text-sm text-gray-400">Pour découvrir la veille</p>
            </div>
            <div className="text-center py-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-semibold text-white">0</span>
                <span className="text-lg text-gray-400">€/mois</span>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Brief du jour",
                "1 email par semaine",
                "France uniquement",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-gray-300">
                  <span className="text-sky-400 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleFree}
              className="btn-secondary w-full"
              disabled={isLoading}
            >
              Choisir Gratuit
            </button>
          </Card>

          <Card className="space-y-6 border-2 border-sky-500/40">
            <div className="flex justify-center -mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
                Recommandé
              </span>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white font-display">
                Pro
              </h2>
              <p className="text-sm text-gray-400">Accès complet</p>
            </div>
            <div className="text-center py-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-semibold text-white">4,99</span>
                <span className="text-lg text-gray-400">€/mois</span>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Brief quotidien",
                "Tous pays (FR, UE, USA)",
                "Historique complet",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-sky-400 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handlePro}
              className="btn-primary w-full"
              disabled={isLoading}
            >
              Choisir Pro
            </button>
          </Card>
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center mt-6">{error}</p>
        )}

        <div className="text-center mt-8">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            Décider plus tard
          </Link>
        </div>
      </main>
    </div>
  );
}
