import Link from 'next/link';
import { ArrowRight, Zap, Calendar, Globe } from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import { LandingNavbar } from '@/components/LandingNavbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center pt-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm">
            <Zap className="w-4 h-4" />
            <span>Veille économique nouvelle génération</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Veille économique<br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              l'essentiel sans le bruit
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Brief quotidien + breaking alerts sur le budget, la fiscalité, 
            les banques centrales et la macro-économie.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/login"
              className="btn-secondary inline-flex items-center gap-2 text-lg"
            >
              Se connecter
            </Link>
            <Link
              href="/login"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Essayer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 border-t border-white/10 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Une veille qui s'adapte à vos besoins
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card rounded-2xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Brief quotidien</h3>
              <p className="text-gray-300">
                Recevez chaque matin une synthèse des actualités économiques 
                les plus importantes pour votre pays et vos thématiques.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-2xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Breaking Alerts</h3>
              <p className="text-gray-300">
                Soyez alerté en temps réel des événements majeurs : décisions 
                BCE/Fed, budgets, réformes fiscales, chocs macro.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-2xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Tags & Pays</h3>
              <p className="text-gray-300">
                Filtrez par pays (FR, UE, USA) et par thématiques (budget, 
                fiscalité, inflation, emploi, commerce, dette).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing" className="scroll-mt-20">
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-lg font-bold text-white">Veyeco</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Veyeco. Veille économique intelligente.
          </p>
        </div>
      </footer>
    </div>
  );
}
