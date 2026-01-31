'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

export const SimpleTopbar: React.FC = () => {
  const router = useRouter();
  const { user, signOutUser } = useAuth();

  const handleLogout = () => {
    signOutUser();
    router.push('/');
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#06162f]/95 via-[#0b1b3a]/95 to-black/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg md:text-xl font-semibold text-white group-hover:text-sky-300 transition-colors font-display">
              Veyeco
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/feedback"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Donner votre avis
            </Link>
          </div>

          {/* User Menu */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
