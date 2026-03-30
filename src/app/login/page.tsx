'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Music, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth.isAuthenticated, router]);

  function handleLoginWithGoogle() {
    auth.login();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(29,185,84,0.08) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)',
        }}
      />

      {/* Decorative floating icons */}
      <div className="absolute top-16 left-12 text-[#1db954]/10 rotate-12">
        <Music className="w-16 h-16" />
      </div>
      <div className="absolute bottom-24 right-16 text-[#8b5cf6]/10 -rotate-12">
        <MapPin className="w-14 h-14" />
      </div>
      <div className="absolute top-1/3 right-10 text-[#1db954]/8 rotate-6">
        <Music className="w-10 h-10" />
      </div>
      <div className="absolute bottom-1/3 left-8 text-[#8b5cf6]/8 -rotate-6">
        <MapPin className="w-10 h-10" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-[#1a1b23] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music className="w-7 h-7 text-[#1db954]" />
          <span
            className="text-3xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #1db954, #8b5cf6)' }}
          >
            MusicMap
          </span>
        </div>

        {/* Tagline */}
        <p className="text-slate-300 font-medium mb-1">Pin your music to the world</p>
        <p className="text-sm text-slate-500 mb-8">
          Discover the soundtrack of every destination, curated by travelers like you.
        </p>

        {/* Google button */}
        <button
          onClick={handleLoginWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#252833] hover:bg-[#2e3040] border border-white/10 text-slate-200 font-medium text-sm transition-colors mb-3"
        >
          {/* Generic "G" icon placeholder */}
          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#0f1117] font-bold text-xs leading-none select-none">
            G
          </span>
          Continue with Google
        </button>

        {/* Guest link */}
        <Link
          href="/"
          className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Continue as Guest
        </Link>
      </div>
    </div>
  );
}
