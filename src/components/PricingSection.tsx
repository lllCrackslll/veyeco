'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { PricingModal } from './PricingModal';

export const PricingSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const plans = [
    {
      name: 'Gratuit',
      price: '0',
      period: '/ mois',
      description: 'Pour découvrir la veille économique',
      features: [
        '1 email par semaine',
        'Accès dashboard en lecture limitée',
        'Brief du jour uniquement',
        'France seulement',
      ],
      cta: 'Commencer gratuitement',
      ctaLink: '/login',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '4,99',
      period: '€ / mois',
      description: 'Accès complet à la veille économique',
      badge: 'Recommandé',
      features: [
        'Brief quotidien par email',
        'Breaking alerts en temps réel',
        'Tous pays (FR, EU, US)',
        'Toutes les thématiques',
        'Filtres avancés',
        'Historique complet',
      ],
      cta: 'Passer en Pro',
      ctaAction: () => setShowModal(true),
      highlighted: true,
    },
  ];

  return (
    <>
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Tarifs simples et transparents
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choisissez l'offre qui correspond à vos besoins. 
              Sans engagement, annulation à tout moment.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card rounded-2xl p-8 space-y-6 transition-all duration-300 hover:scale-105 ${
                  plan.highlighted
                    ? 'border-2 border-sky-500/50 shadow-xl shadow-sky-500/10'
                    : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="flex justify-center -mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                      <Sparkles className="w-3.5 h-3.5" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center py-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-lg text-gray-400">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.ctaLink ? (
                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center ${
                      plan.highlighted ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={plan.ctaAction}
                    className={`w-full ${
                      plan.highlighted ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}

                {/* Note */}
                {plan.highlighted && (
                  <p className="text-xs text-center text-gray-500">
                    Sans engagement • Annulation à tout moment
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-400">
              Tous les prix sont HT. TVA applicable selon votre pays de résidence.
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      <PricingModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
