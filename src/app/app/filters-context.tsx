"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type FiltersState = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  alertThreshold: number;
  setAlertThreshold: (value: number) => void;
};

const DEFAULT_THRESHOLD = 70;
const FiltersContext = createContext<FiltersState | null>(null);

const readLocal = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }
  const value = window.localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const writeLocal = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState(() =>
    readLocal("filters.searchQuery", "")
  );
  const [selectedCountry, setSelectedCountry] = useState(() =>
    readLocal("filters.selectedCountry", "ALL")
  );
  const [alertThreshold, setAlertThreshold] = useState(() =>
    readLocal("filters.alertThreshold", DEFAULT_THRESHOLD)
  );

  const value = useMemo<FiltersState>(
    () => ({
      searchQuery,
      setSearchQuery: (next) => {
        setSearchQuery(next);
        writeLocal("filters.searchQuery", next);
      },
      selectedCountry,
      setSelectedCountry: (next) => {
        setSelectedCountry(next);
        writeLocal("filters.selectedCountry", next);
      },
      alertThreshold,
      setAlertThreshold: (next) => {
        setAlertThreshold(next);
        writeLocal("filters.alertThreshold", next);
      },
    }),
    [alertThreshold, searchQuery, selectedCountry]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters doit être utilisé dans FiltersProvider");
  }
  return context;
};
