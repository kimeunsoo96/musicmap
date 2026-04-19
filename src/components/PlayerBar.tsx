'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Radio } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { cn } from '@/lib/utils';

export default function PlayerBar() {
  const { currentPin, isPlaying, progress, placeName, queue, currentIndex, togglePlay, next, prev, close } = useAudioPlayer();

  if (!currentPin) return null;

  const track = currentPin.track;
  const hasNext = currentIndex + 1 < queue.length;
  const hasPrev = currentIndex > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] bg-[#0f1117]/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#1db954] to-[#8b5cf6] transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3">
        {/* Album art */}
        <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded overflow-hidden bg-surface-hover">
          {track?.album_art_url && (
            <img src={track.album_art_url} alt={track.album} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {placeName && (
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-[#1db954] font-semibold uppercase tracking-wide mb-0.5">
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="truncate">Playing {placeName} &middot; {currentIndex + 1}/{queue.length}</span>
            </div>
          )}
          <p className="text-sm font-semibold text-slate-100 truncate">{track?.title}</p>
          <p className="text-xs text-slate-400 truncate">{track?.artist}</p>
        </div>

        {/* Controls */}
        <div className="shrink-0 flex items-center gap-1">
          <button
            onClick={prev}
            disabled={!hasPrev}
            className={cn(
              'p-2 rounded-full transition-colors',
              hasPrev ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600',
            )}
            aria-label="Previous"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-white text-black hover:scale-105 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={next}
            disabled={!hasNext}
            className={cn(
              'p-2 rounded-full transition-colors',
              hasNext ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600',
            )}
            aria-label="Next"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={close}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
