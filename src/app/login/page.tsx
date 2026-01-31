'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Chrome, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../providers';

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await signUp(email, password, selectedPlan);
      } else {
        await signIn(email, password);
      }
      router.push('/app');
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle(mode === 'signup' ? selectedPlan : 'free');
      router.push('/app');
    } catch (err) {
      setError((err as FirebaseError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-4">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Connexion</h1>
            <p className="text-gray-400">Accédez à votre veille économique</p>
          </div>

          {/* Mode Switch */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Plan */}
          {mode === 'signup' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Choisir un plan</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('free')}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                    selectedPlan === 'free'
                      ? 'border-sky-500 bg-sky-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium">Gratuit</p>
                  <p className="text-xs text-gray-400">0 € / mois</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• 1 email / semaine</li>
                    <li>• Brief du jour</li>
                    <li>• France uniquement</li>
                  </ul>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan('pro')}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                    selectedPlan === 'pro'
                      ? 'border-sky-500 bg-sky-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium">Pro</p>
                  <p className="text-xs text-gray-400">4,99 € / mois</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• Brief quotidien</li>
                    <li>• Breaking alerts</li>
                    <li>• FR / EU / US</li>
                  </ul>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Le plan Pro nécessite un paiement, vous pourrez l'activer ensuite.
              </p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleEmailAuth}>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-3 input-dark rounded-lg"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 input-dark rounded-lg"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading
                ? 'Chargement...'
                : mode === 'signup'
                  ? 'Créer un compte'
                  : 'Continuer'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full btn-secondary inline-flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <Chrome className="w-4 h-4" />
            {mode === 'signup' ? 'Créer avec Google' : 'Continuer avec Google'}
          </button>

          {error && (
            <div className="pt-2">
              <p className="text-xs text-red-400 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            En vous connectant, vous accédez au dashboard complet.
          </p>
        </div>
      </div>
    </div>
  );
}
