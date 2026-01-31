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

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      router.push('/app');
    } catch (err) {
      const firebaseError = err as FirebaseError;
      if (firebaseError.code === 'auth/user-not-found') {
        try {
          await signUp(email, password);
          router.push('/app');
          return;
        } catch (signupError) {
          setError((signupError as FirebaseError).message);
        }
      } else {
        setError(firebaseError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
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
              {isLoading ? 'Connexion...' : 'Continuer'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full btn-secondary inline-flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <Chrome className="w-4 h-4" />
            Continuer avec Google
          </button>

          {error && (
            <div className="pt-2">
              <p className="text-xs text-red-400 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Demo Link */}
        <div className="text-center">
          <Link
            href="/app"
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            Voir la démo sans connexion →
          </Link>
        </div>
      </div>
    </div>
  );
}
