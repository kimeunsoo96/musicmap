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
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(29,185,84,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 75% 40%, rgba(139,92,246,0.08) 0%, transparent 60%)',
          animation: 'none',
        }}
      />

      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating decorative icons */}
      <div className="absolute top-12 left-8 text-[#1db954]/10 rotate-12 pointer-events-none">
        <Music className="w-20 h-20" />
      </div>
      <div className="absolute bottom-20 right-12 text-[#8b5cf6]/10 -rotate-12 pointer-events-none">
        <MapPin className="w-16 h-16" />
      </div>
      <div className="absolute top-1/3 right-8 text-[#1db954]/[0.07] rotate-6 pointer-events-none">
        <Music className="w-12 h-12" />
      </div>
      <div className="absolute bottom-1/3 left-6 text-[#8b5cf6]/[0.07] -rotate-6 pointer-events-none">
        <MapPin className="w-11 h-11" />
      </div>
      <div className="absolute top-1/2 left-1/4 text-[#1db954]/[0.04] rotate-45 pointer-events-none">
        <Music className="w-8 h-8" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(29,185,84,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative bg-[#1a1b23]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          {/* Logo mark */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#1db954]/15 border border-[#1db954]/20 flex items-center justify-center">
              <Music className="w-5 h-5 text-[#1db954]" />
            </div>
          </div>

          {/* Brand name */}
          <h1
            className="text-3xl font-extrabold bg-clip-text text-transparent mb-1"
            style={{ backgroundImage: 'linear-gradient(95deg, #1db954 20%, #8b5cf6 80%)' }}
          >
            MusicMap
          </h1>

          {/* Tagline */}
          <p className="text-slate-300 font-medium mb-1 text-sm">Pin your music to the world</p>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            Discover the soundtrack of every destination,<br className="hidden sm:block" /> curated by travelers like you.
          </p>

          {/* Divider with label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600 shrink-0">continue with</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google button */}
          <button
            onClick={handleLoginWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#252833] hover:bg-[#2e3040] active:bg-[#1e2030] border border-white/10 hover:border-white/20 text-slate-200 font-medium text-sm transition-all duration-150 mb-3 group"
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#0f1117] font-bold text-xs leading-none select-none shrink-0 group-hover:scale-110 transition-transform">
              G
            </span>
            Continue with Google
          </button>

          {/* Guest link */}
          <Link
            href="/"
            className="block text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
          >
            Continue as Guest &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
