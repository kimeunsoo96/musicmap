'use client';

import React, { useState } from 'react';
import { Route, Loader2 } from 'lucide-react';
import { useMapContext } from '@/contexts/map-context';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import type { Pin } from '@/types';

export default function PlayTripButton() {
  const { visibleBounds, isPanelOpen, activeMood } = useMapContext();
  const { playPlace, currentPin } = useAudioPlayer();
  const [loading, setLoading] = useState(false);

  // Hide when panel is open or player bar is active
  if (isPanelOpen || currentPin) return null;

  async function handleClick() {
    if (!visibleBounds) return;
    setLoading(true);
    try {
      const p = visibleBounds;
      const moodQuery = activeMood ? `&mood=${activeMood}` : '';
      const res = await fetch(
        `/api/pins/in-region?north=${p.north}&south=${p.south}&east=${p.east}&west=${p.west}${moodQuery}`,
      );
      const data: { pins: Pin[] } = await res.json();
      const withPreviews = (data.pins ?? []).filter((pin) => pin.track?.preview_url);
      if (withPreviews.length === 0) {
        alert('No playable tracks in this area. Try zooming out.');
        return;
      }
      playPlace('this trip', withPreviews);
    } catch {
      alert('Failed to load tracks.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="fixed bottom-4 left-4 z-[1000] md:left-1/2 md:-translate-x-1/2 md:bottom-6 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold text-sm shadow-lg shadow-purple-900/40 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="Play visible region"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
      Play this trip
    </button>
  );
}
