import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
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
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Connexion</h1>
            <p className="text-gray-400">Accédez à votre veille économique</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
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
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Continuer
            </button>
          </form>

          {/* Info Message */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-center text-gray-400">
              🚧 Authentification en cours de développement.<br />
              Backend à venir prochainement.
            </p>
          </div>
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
