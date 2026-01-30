'use client';

import { AppShell } from '@/components/AppShell';
import { FiltersProvider, useFilters } from './filters-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FiltersProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </FiltersProvider>
  );
}

const AppLayoutInner = ({ children }: { children: React.ReactNode }) => {
  const { searchQuery, setSearchQuery, selectedCountry, setSelectedCountry } =
    useFilters();

  return (
    <AppShell
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCountry={selectedCountry}
      onCountryChange={setSelectedCountry}
    >
      {children}
    </AppShell>
  );
};
