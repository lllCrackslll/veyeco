'use client';

import { useState, useEffect } from 'react';
import { NewsItemCard } from '@/components/NewsItemCard';
import type { NewsItem } from '@/lib/mockData';
import { Flame, Coffee } from 'lucide-react';
import { useFilters } from './filters-context';

export default function DashboardPage() {
  const [breakingItems, setBreakingItems] = useState<NewsItem[]>([]);
  const [briefItems, setBriefItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { searchQuery, selectedCountry, alertThreshold } = useFilters();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || '';

  const mapItems = (items: any[], countryFallback: NewsItem['country']): NewsItem[] =>
    items.map((item) => ({
      id: item.url,
      title: item.title,
      source: item.source,
      url: item.url,
      publishedAt: item.publishedAt,
      country: (item.country || countryFallback) as NewsItem['country'],
      tags: item.tags || [],
      importanceScore: item.importanceScore || 0,
      summaryBullets: item.summaryBullets || [],
    }));

  useEffect(() => {
    const country = selectedCountry === 'ALL' ? 'FR' : selectedCountry;
    const controller = new AbortController();

    const fetchFeed = async () => {
      if (!apiBaseUrl) {
        setLoadError('API non configurée.');
        return;
      }
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(
          `${apiBaseUrl}/feed?country=${country}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Erreur API (${response.status})`);
        }
        const data = await response.json();
        const dailyItems = data?.daily?.items || [];
        const breakingItems = data?.breaking?.items || [];
        setBriefItems(mapItems(dailyItems, country as NewsItem['country']));
        setBreakingItems(mapItems(breakingItems, country as NewsItem['country']));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setLoadError((error as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();

    return () => {
      controller.abort();
    };
  }, [apiBaseUrl, selectedCountry]);

  // Filtrage local
  const filterItems = (items: NewsItem[]) => {
    return items.filter((item) => {
      if (item.importanceScore < alertThreshold) {
        return false;
      }
      // Filtre pays
      if (selectedCountry !== 'ALL' && item.country !== selectedCountry) {
        return false;
      }

      // Filtre recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSource = item.source.toLowerCase().includes(query);
        const matchTags = item.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchTitle && !matchSource && !matchTags) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredBreaking = filterItems(breakingItems);
  const filteredBrief = filterItems(briefItems);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Toutes les actualités économiques importantes en temps réel
          </p>
        </div>
        <div className="glass-card px-4 py-2 rounded-lg text-right">
          <p className="text-sm text-gray-400">Live</p>
          <p className="text-xs text-gray-500">
            {isLoading ? 'Chargement...' : loadError ? 'Erreur API' : 'Données temps réel'}
          </p>
          <p className="text-[11px] text-gray-500">Seuil: {alertThreshold}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Breaking News - Left Column (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Breaking</h2>
              <p className="text-sm text-gray-400">{filteredBreaking.length} alertes</p>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBreaking.length > 0 ? (
              filteredBreaking.map((item) => (
                <NewsItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-gray-400">Aucune alerte breaking pour ces filtres</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Brief - Right Column (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <Coffee className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Brief du jour</h2>
              <p className="text-sm text-gray-400">{filteredBrief.length} actualités</p>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBrief.length > 0 ? (
              filteredBrief.map((item) => (
                <NewsItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-gray-400">Aucune actualité pour ces filtres</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
