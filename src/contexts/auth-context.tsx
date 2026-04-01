'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isMockMode } from '@/lib/supabase';
import { MOCK_USERS } from '@/lib/mock-data';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isMockMode || !supabase) {
      // Mock mode fallback
      try {
        const stored = localStorage.getItem('musicmap_user');
        if (stored) setUser(JSON.parse(stored) as User);
      } catch { /* ignore */ }
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          display_name: session.user.user_metadata?.full_name ?? session.user.email ?? 'User',
          avatar_url: session.user.user_metadata?.avatar_url ?? '',
        };
        setUser(u);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          display_name: session.user.user_metadata?.full_name ?? session.user.email ?? 'User',
          avatar_url: session.user.user_metadata?.avatar_url ?? '',
        };
        setUser(u);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function login() {
    if (isMockMode || !supabase) {
      const mockUser = MOCK_USERS[0];
      setUser(mockUser);
      localStorage.setItem('musicmap_user', JSON.stringify(mockUser));
      return;
    }

    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/`
          : 'https://musicmap-ruby.vercel.app/',
      },
    });
  }

  function logout() {
    if (isMockMode || !supabase) {
      setUser(null);
      localStorage.removeItem('musicmap_user');
      return;
    }

    supabase.auth.signOut().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
