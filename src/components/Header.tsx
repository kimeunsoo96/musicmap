'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Music, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import type { Place } from '@/types';

interface HeaderProps {
  children?: React.ReactNode;
  /** If true, render the search bar in a second row on mobile */
  hasSearch?: boolean;
}

export default function Header({ children, hasSearch }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState<{ places: number; pins: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch total places + pins count for the header badge
  useEffect(() => {
    fetch('/api/places')
      .then((res) => res.json())
      .then((data: Place[]) => {
        if (!Array.isArray(data)) return;
        const places = data.length;
        const pins = data.reduce((sum, p) => sum + (p.pin_count ?? 0), 0);
        setStats({ places, pins });
      })
      .catch(() => {});
  }, []);

  const showMobileSearch = hasSearch && children;

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] bg-surface/80 backdrop-blur-lg border-b border-white/5">
      {/* Primary row: logo + [desktop search] + stats + auth */}
      <div className="h-[52px] md:h-[60px] px-3 md:px-4 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Music className="w-5 h-5 text-spotify" />
          <span className="font-bold text-base md:text-lg bg-gradient-to-r from-spotify to-accent bg-clip-text text-transparent">
            MusicMap
          </span>
        </div>

        {/* Desktop search slot */}
        <div className="hidden md:flex flex-1 justify-center">
          {children}
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Stats badge — desktop only */}
        {stats && (
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-hover border border-white/5 text-xs text-slate-400 shrink-0 select-none">
            <span>🌍</span>
            <span className="text-slate-300 font-medium">{stats.places}</span>
            <span className="mx-0.5 text-slate-600">·</span>
            <span>🎵</span>
            <span className="text-slate-300 font-medium">{stats.pins}</span>
          </div>
        )}

        {/* Auth */}
        <div className="shrink-0">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full px-1.5 py-1 hover:bg-surface-hover transition-colors"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-hover flex items-center justify-center">
                    <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                  </div>
                )}
                <span className="text-sm text-slate-200 hidden sm:block">{user.display_name}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', dropdownOpen && 'rotate-180')} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-surface-light border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-200 hover:bg-surface-hover transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-400 hover:bg-surface-hover hover:text-slate-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-surface-hover transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search row — only rendered when hasSearch=true */}
      {showMobileSearch && (
        <div className="md:hidden px-3 pb-2.5">
          {children}
        </div>
      )}
    </header>
  );
}
