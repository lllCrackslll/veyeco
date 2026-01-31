'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SimpleTopbar } from '@/components/SimpleTopbar';
import { SimpleNewsCard } from '@/components/SimpleNewsCard';
import type { NewsItem } from '@/lib/mockData';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useAuth } from '@/app/providers';

export default function SimpleDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || '';

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!apiBaseUrl) {
        setLoadError('API non configurée.');
        return;
      }
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/feed?country=FR`);
        if (!response.ok) {
          throw new Error(`Erreur API (${response.status})`);
        }
        const data = await response.json();
        const dailyItems = data?.daily?.items || [];
        const mapped = dailyItems.map((item: any) => ({
          id: item.url,
          title: item.title,
          source: item.source,
          url: item.url,
          publishedAt: item.publishedAt,
          country: item.country || 'FR',
          tags: item.tags || [],
          importanceScore: item.importanceScore || 0,
          summaryBullets: item.summaryBullets || [],
        }));
        setItems(mapped);
      } catch (error) {
        setLoadError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFeed();
    }
  }, [apiBaseUrl, user]);

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
        {/* Header */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <div className="absolute -top-24 right-[-60px] h-[220px] w-[220px] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-24 left-[-60px] h-[220px] w-[220px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-white font-display mt-2">
                L’essentiel économique, chaque jour
              </h1>
              <p className="text-gray-400 mt-2">
                Toutes les grandes décisions macro, résumées et priorisées.
              </p>
            </div>

            <Link
              href="/dashboard/settings"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </Link>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-400">Chargement...</p>
          ) : loadError ? (
            <p className="text-red-400">{loadError}</p>
          ) : (
            items.map((item) => <SimpleNewsCard key={item.id} item={item} />)
          )}
        </div>

        {/* Info */}
        <div className="mt-12 glass-card rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">
            Veyeco — Veille économique intelligente
          </p>
        </div>
      </main>
    </div>
  );
}
