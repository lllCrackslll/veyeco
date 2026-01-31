'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SimpleTopbar } from '@/components/SimpleTopbar';
import { Card } from '@/components/Card';
import { PlanBadge } from '@/components/PlanBadge';
import { PricingModal } from '@/components/PricingModal';
import { Crown, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/providers';

export default function SimpleSettingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const currentPlan = profile?.plan === 'pro' ? 'PRO' : 'FREE';

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, router, user]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SimpleTopbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si pas authentifié (en cours de redirection)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleTopbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </Link>

        {/* Header */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <div className="absolute -top-24 right-[-60px] h-[220px] w-[220px] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-24 left-[-60px] h-[220px] w-[220px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Paramètres
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white font-display mt-2">
              Votre abonnement
            </h1>
            <p className="text-gray-400 mt-2">
              Gérez votre plan et vos accès.
            </p>
          </div>
        </div>

        {/* Subscription Section */}
        <Card className="border border-white/10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.06] border border-white/10 rounded-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Abonnement</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">Plan actuel :</span>
                    <PlanBadge plan={currentPlan} />
                  </div>
                </div>
              </div>

              {currentPlan === 'FREE' && (
                <>
                  {/* Free Plan Limits */}
                  <div className="glass-card rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium text-white">Limites du plan gratuit</p>
                        <ul className="space-y-1.5 text-sm text-gray-300">
                          <li className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>1 email par semaine seulement</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Accès dashboard en lecture limitée</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            <span>France uniquement</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade CTA */}
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Passer en Pro — 4,99 €/mois
                  </button>
                  <p className="text-xs text-gray-500">
                    Brief quotidien + Tous pays • Sans engagement
                  </p>
                </>
              )}

              {currentPlan === 'PRO' && (
                <div className="glass-card rounded-lg p-4">
                  <p className="text-sm text-green-400">
                    ✓ Vous profitez de tous les avantages Pro
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Prochain renouvellement : 29 février 2024
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Pro Features */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Avantages du plan Pro
          </h3>
          <ul className="space-y-3">
            {[
              'Brief quotidien par email (7j/7)',
              'Couverture complète : FR, UE, USA',
              'Toutes les thématiques (budget, fiscalité, BCE/Fed, inflation...)',
              'Historique complet des actualités',
              'Sans engagement, annulation à tout moment',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300">
                <span className="text-sky-400 mt-1">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Info */}
        <div className="mt-8 glass-card rounded-lg p-4">
          <p className="text-sm text-gray-400 text-center">
            Besoin d'aide ? Contactez-nous à support@veyeco.com
          </p>
        </div>
      </main>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  );
}
