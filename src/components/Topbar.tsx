'use client';

import React from 'react';
import Link from 'next/link';
import { SearchInput } from './SearchInput';
import { CountryFilter } from './CountryFilter';
import { User, TrendingUp } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#06162f]/95 via-[#0b1b3a]/95 to-black/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
              Veyeco
            </span>
          </Link>

          {/* Search & Filters */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Rechercher par titre, source ou tag..."
              />
            </div>
            <CountryFilter
              selected={selectedCountry}
              onChange={onCountryChange}
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Connexion</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
