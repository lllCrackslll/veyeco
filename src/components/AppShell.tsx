'use client';

import React from 'react';
import { Topbar } from './Topbar';
import { TopTabs } from './TopTabs';
import Link from 'next/link';
import { useAuth } from '@/app/providers';

interface AppShellProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
}) => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
      />

      {/* Top Tabs Navigation */}
      <TopTabs />

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto px-6 py-8 w-full relative">
        {children}
        {!loading && !user && (
          <div className="fixed bottom-6 right-6 z-40 max-w-sm glass-card rounded-xl p-4 border border-sky-500/30">
            <p className="text-sm text-white font-medium">Connecte-toi pour personnaliser ta veille</p>
            <p className="text-xs text-gray-400 mt-1">
              Accès complet, filtres sauvegardés et emails hebdo.
            </p>
            <div className="mt-3 flex gap-2">
              <Link href="/login" className="btn-primary px-4 py-2 text-sm">
                Se connecter
              </Link>
              <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
