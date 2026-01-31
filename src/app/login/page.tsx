'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../providers';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'signup') {
        setMode('signup');
      }
    }
  }, []);

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await signUp(email, password, 'free');
      } else {
        await signIn(email, password);
      }
      router.push('/dashboard/choose-plan');
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
      await signInWithGoogle('free');
      router.push('/dashboard/choose-plan');
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
