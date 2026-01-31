'use client';

import React, { useEffect } from 'react';
import { Topbar } from './Topbar';
import { TopTabs } from './TopTabs';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

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
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-400">
            Chargement...
          </div>
        ) : user ? (
          children
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center gap-4">
            <p className="text-white font-medium">Connexion requise</p>
            <p className="text-sm text-gray-400">
              Connecte-toi pour accéder au dashboard.
            </p>
            <Link href="/login" className="btn-primary px-4 py-2 text-sm">
              Se connecter
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
