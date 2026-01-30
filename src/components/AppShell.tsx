'use client';

import React from 'react';
import { Topbar } from './Topbar';
import { TopTabs } from './TopTabs';

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
      <main className="flex-1 max-w-[1600px] mx-auto px-6 py-8 w-full">
        {children}
      </main>
    </div>
  );
};
