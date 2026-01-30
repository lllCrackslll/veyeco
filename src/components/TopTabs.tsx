'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Database, Settings } from 'lucide-react';

interface TabItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/sources', label: 'Sources', icon: Database },
  { href: '/app/settings', label: 'Paramètres', icon: Settings },
];

export const TopTabs: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === '/app';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex gap-2 py-3" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                role="tab"
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg transition-all duration-200'
                    : 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200'
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
