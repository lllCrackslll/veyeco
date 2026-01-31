'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SimpleLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Authentification
    localStorage.setItem('mockAuth', 'true');
    localStorage.setItem('mockUserEmail', email);
    
    // Rediriger vers le dashboard
    router.push('/dashboard');
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
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Connexion</h1>
            <p className="text-gray-400">Accédez à votre veille économique</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="w-full btn-primary">
              Continuer
            </button>
          </form>
        </div>

        {/* Quick Access */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Découvrir sans compte :
          </p>
          <button
            onClick={() => {
              localStorage.setItem('mockAuth', 'true');
              localStorage.setItem('mockUserEmail', 'utilisateur@veyeco.com');
              router.push('/dashboard');
            }}
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            Accéder en lecture seule →
          </button>
        </div>
      </div>
    </div>
  );
}
