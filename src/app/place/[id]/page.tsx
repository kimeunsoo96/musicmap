'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Music, Bookmark, ArrowLeft } from 'lucide-react';
import { getMockPlaceDetail, isMockSaved, toggleMockSave } from '@/lib/mock-data';
import PinCard from '@/components/PinCard';
import type { PlaceDetail } from '@/types';
import { cn } from '@/lib/utils';

export default function PlaceDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [detail, setDetail] = useState<PlaceDetail | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const result = getMockPlaceDetail(id);
    setDetail(result);
    if (result) {
      setSaved(isMockSaved(result.id));
    }
  }, [id]);

  function handleSave() {
    if (!detail) return;
    const result = toggleMockSave(detail.id);
    setSaved(result.saved);
  }

  // Loading state
  if (detail === undefined) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (detail === null) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center gap-4 text-slate-300">
        <MapPin className="w-12 h-12 text-slate-600" />
        <p className="text-lg font-medium">Place not found</p>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#1db954] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>
      </div>
    );
  }

  const pins = [...detail.pins].sort((a, b) => b.likes_count - a.likes_count);

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
        {/* Cover image / hero */}
        <div className="relative w-full h-40 md:h-52 rounded-2xl overflow-hidden mb-6">
          {detail.cover_image ? (
            <img
              src={detail.cover_image}
              alt={detail.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1db954]/30 via-[#8b5cf6]/20 to-[#0f1117]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117]/80 to-transparent" />
        </div>

        {/* Place header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1 leading-tight">{detail.name}</h1>
            <p className="text-slate-400 flex items-center gap-1.5 text-sm md:text-base">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{detail.city}, {detail.country}</span>
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1db954]/10 text-[#1db954] text-xs md:text-sm font-semibold">
                <Music className="w-3.5 h-3.5" />
                {detail.pin_count} {detail.pin_count === 1 ? 'pin' : 'pins'}
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-3 py-2 md:px-4 rounded-full text-xs md:text-sm font-medium transition-all duration-150',
              saved
                ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10',
            )}
          >
            <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save Place'}</span>
          </button>
        </div>

        {/* Pins list */}
        <section>
          <h2 className="text-base md:text-lg font-semibold text-slate-200 mb-4">Songs pinned here</h2>
          {pins.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Music className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No songs pinned yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
