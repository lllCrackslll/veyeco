'use client';

import React from 'react';
import { X, CreditCard } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <h3 className="text-2xl font-bold text-white">Paiement bientôt disponible</h3>
          <p className="text-gray-300">
            L'intégration du système de paiement est en cours de développement. 
            Vous pourrez bientôt souscrire à l'offre Pro directement depuis cette page.
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
        <button
          onClick={onClose}
          className="w-full btn-primary"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};
