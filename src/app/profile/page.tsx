'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Music, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import PinCard from '@/components/PinCard';
import type { Pin, SavedPlace } from '@/types';
import { cn } from '@/lib/utils';

type Tab = 'pins' | 'saved';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('pins');
  const [userPins, setUserPins] = useState<Pin[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/users/${user.id}/pins?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { pins: [] }))
      .then((d) => {
        console.log('[profile] pins received:', d.pins);
        setUserPins(d.pins ?? []);
      })
      .catch(() => setUserPins([]));
    setSavedPlaces([]);
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0f1117]/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
        {/* User header */}
        <div className="flex items-center gap-4 mb-8">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-[#1db954]/30 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#252833] flex items-center justify-center ring-2 ring-white/10 shrink-0">
              <User className="w-7 h-7 md:w-8 md:h-8 text-slate-400" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 truncate">{user.display_name}</h1>
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Tabs — scrollable on very small screens */}
        <div className="flex gap-0 border-b border-white/5 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pins')}
            className={cn(
              'pb-3 px-1 mr-6 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0',
              activeTab === 'pins'
                ? 'text-[#1db954] border-[#1db954]'
                : 'text-slate-400 border-transparent hover:text-slate-200',
            )}
          >
            My Pins
            <span className="ml-1.5 text-xs text-slate-500">({userPins.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={cn(
              'pb-3 px-1 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0',
              activeTab === 'saved'
                ? 'text-[#1db954] border-[#1db954]'
                : 'text-slate-400 border-transparent hover:text-slate-200',
            )}
          >
            Saved Places
            <span className="ml-1.5 text-xs text-slate-500">({savedPlaces.length})</span>
          </button>
        </div>

        {/* My Pins tab */}
        {activeTab === 'pins' && (
          <div>
            {userPins.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Music className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>You haven&apos;t pinned any songs yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userPins.map((pin) => (
                  <div key={pin.id}>
                    {pin.place && (
                      <Link
                        href={`/place/${pin.place_id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#8b5cf6] hover:underline mb-1"
                      >
                        <MapPin className="w-3 h-3" />
                        {pin.place.name}
                      </Link>
                    )}
                    <PinCard
                      pin={pin}
                      onDelete={() => setUserPins((prev) => prev.filter((p) => p.id !== pin.id))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Places tab */}
        {activeTab === 'saved' && (
          <div>
            {savedPlaces.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No saved places yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedPlaces.map((saved) => {
                  const place = saved.place;
                  if (!place) return null;
                  return (
                    <Link
                      key={saved.id}
                      href={`/place/${place.id}`}
                      className="block p-4 rounded-xl bg-[#1a1b23] border border-white/5 hover:border-white/10 hover:bg-[#252833] transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-black/30"
                    >
                      {place.cover_image ? (
                        <div className="w-full h-28 rounded-lg overflow-hidden mb-3">
                          <img
                            src={place.cover_image}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-28 rounded-lg mb-3 bg-gradient-to-br from-[#1db954]/20 to-[#8b5cf6]/10" />
                      )}
                      <h3 className="font-semibold text-slate-100 truncate">{place.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{place.city}, {place.country}</span>
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-[#1db954]">
                        <Music className="w-3 h-3" />
                        {place.pin_count} {place.pin_count === 1 ? 'pin' : 'pins'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
