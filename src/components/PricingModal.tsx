'use client';

import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useAuth } from '@/app/providers';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      setError("Connecte-toi d'abord pour continuer.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative glass-card rounded-2xl p-8 max-w-md w-full space-y-6 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-sky-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-white">Passer en Pro</h3>
          <p className="text-gray-300">
            Accès complet au dashboard, breaking alerts et brief quotidien.
          </p>
        </div>

        {/* Features reminder */}
        <div className="glass-card rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-white">Offre Pro — 4,99 €/mois</p>
          <ul className="space-y-1 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">✓</span>
              <span>Brief quotidien par email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">✓</span>
              <span>Breaking alerts en temps réel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">✓</span>
              <span>Tous pays et thématiques</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">✓</span>
              <span>Sans engagement</span>
            </li>
          </ul>
        </div>

        {/* Button */}
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <button
          onClick={handleCheckout}
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Redirection..." : "Payer 4,99 €/mois"}
        </button>
      </div>
    </div>
  );
};
