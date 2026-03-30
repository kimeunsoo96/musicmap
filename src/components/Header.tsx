'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Music, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] h-[60px] px-4 flex items-center gap-4 bg-surface/80 backdrop-blur-lg border-b border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <Music className="w-5 h-5 text-spotify" />
        <span className="font-bold text-lg bg-gradient-to-r from-spotify to-accent bg-clip-text text-transparent">
          MusicMap
        </span>
      </div>

      {/* Center slot */}
      <div className="flex-1 flex justify-center">
        {children}
      </div>

      {/* Right: auth */}
      <div className="shrink-0">
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-surface-hover transition-colors"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
              <span className="text-sm text-slate-200 hidden sm:block">{user.display_name}</span>
              <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', dropdownOpen && 'rotate-180')} />
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
            className="text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
