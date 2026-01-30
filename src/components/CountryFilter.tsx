'use client';

import React from 'react';

interface CountryFilterProps {
  selected: string;
  onChange: (country: string) => void;
}

export const CountryFilter: React.FC<CountryFilterProps> = ({ selected, onChange }) => {
  const countries = [
    { code: 'ALL', label: 'Tous' },
    { code: 'FR', label: 'France' },
    { code: 'EU', label: 'UE' },
    { code: 'US', label: 'USA' },
  ];

  return (
    <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
      {countries.map((country) => (
        <button
          key={country.code}
          onClick={() => onChange(country.code)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selected === country.code
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          {country.label}
        </button>
      ))}
    </div>
  );
};
