'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { PlanBadge } from '@/components/PlanBadge';
import { PricingModal } from '@/components/PricingModal';
import { Save, Check, Crown, Mail, AlertCircle } from 'lucide-react';
import { useFilters } from '../filters-context';
import { useAuth } from '@/app/providers';

export default function SettingsPage() {
  const [countries, setCountries] = useState({
    FR: true,
    EU: true,
    US: false,
  });

  const [themes, setThemes] = useState({
    budget: true,
    fiscalite: true,
    banqueCentrale: true,
    inflation: true,
    emploi: false,
    commerce: false,
    dette: true,
  });

  const { alertThreshold, setAlertThreshold } = useFilters();
  const [showToast, setShowToast] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { profile } = useAuth();
  const currentPlan = profile?.plan === 'pro' ? 'PRO' : 'FREE';

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const themeLabels: Record<string, string> = {
    budget: 'Budget',
    fiscalite: 'Fiscalité',
    banqueCentrale: 'Banques Centrales',
    inflation: 'Inflation',
    emploi: 'Emploi',
    commerce: 'Commerce',
    dette: 'Dette Publique',
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
        <p className="text-gray-400">
          Personnalisez votre veille économique selon vos besoins
        </p>
      </div>

      {/* Subscription Section */}
      <Card className="border-2 border-sky-500/30">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg">
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
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
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
                  Brief quotidien + Breaking alerts + Tous pays • Sans engagement
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

      {/* Countries */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">Pays suivis</h2>
        <p className="text-sm text-gray-400 mb-6">
          Sélectionnez les zones géographiques que vous souhaitez surveiller
        </p>

        <div className="space-y-3">
          {Object.entries(countries).map(([code, enabled]) => {
            const labels: Record<string, string> = {
              FR: 'France',
              EU: 'Union Européenne',
              US: 'États-Unis',
            };

            return (
              <label
                key={code}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/[0.07] cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => setCountries({ ...countries, [code]: !enabled })}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
                />
                <span className="text-white font-medium">{labels[code]}</span>
              </label>
            );
          })}
        </div>
      </Card>

      {/* Themes */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">Thématiques suivies</h2>
        <p className="text-sm text-gray-400 mb-6">
          Choisissez les sujets économiques qui vous intéressent
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(themes).map(([key, enabled]) => (
            <label
              key={key}
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/[0.07] cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => setThemes({ ...themes, [key]: !enabled })}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
              />
              <span className="text-white font-medium">{themeLabels[key]}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Alert Threshold */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">Seuil d'alerte</h2>
        <p className="text-sm text-gray-400 mb-6">
          Définissez le score d'importance minimum pour recevoir une notification breaking
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Score minimum</span>
            <span className="text-2xl font-bold text-sky-400">{alertThreshold}</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(14 165 233) ${alertThreshold}%, rgba(255,255,255,0.1) ${alertThreshold}%, rgba(255,255,255,0.1) 100%)`
            }}
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>0 (Tout)</span>
            <span>50 (Important)</span>
            <span>100 (Critique)</span>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save className="w-5 h-5" />
          Enregistrer les paramètres
        </button>

        {showToast && (
          <div className="glass-card px-4 py-2 rounded-lg inline-flex items-center gap-2 text-green-400 animate-fade-in">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Sauvegardé (mock)</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="glass-card rounded-lg p-4">
        <p className="text-sm text-gray-400 text-center">
          ℹ️ Les paramètres sont mockés et ne seront pas persistés (mode démo)
        </p>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  );
}
