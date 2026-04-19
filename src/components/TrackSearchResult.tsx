'use client';

import React from 'react';
import { Music } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Track } from '@/types';
import TrackPreviewButton from './TrackPreviewButton';

interface TrackSearchResultProps {
  track: Track;
  onSelect: (track: Track) => void;
  isSelected: boolean;
}

export default function TrackSearchResult({ track, onSelect, isSelected }: TrackSearchResultProps) {
  return (
    <div
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
        isSelected
          ? 'bg-spotify/10 border border-spotify'
          : 'hover:bg-surface-hover border border-transparent',
        'cursor-pointer',
      )}
    >
      {/* Clickable area: album art + track info + duration */}
      <button
        onClick={() => onSelect(track)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        {/* Album art */}
        <div className="shrink-0 w-10 h-10 rounded overflow-hidden bg-surface-hover flex items-center justify-center">
          {track.album_art_url ? (
            <img
              src={track.album_art_url}
              alt={track.album}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-4 h-4 text-slate-500" />
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold truncate', isSelected ? 'text-spotify' : 'text-slate-100')}>
            {track.title}
          </p>
          <p className="text-xs text-slate-400 truncate">{track.artist}</p>
        </div>

        {/* Duration */}
        <span className="shrink-0 text-xs text-slate-500 tabular-nums">
          {formatDuration(track.duration_ms)}
        </span>
      </button>

      {/* Audio preview */}
      <TrackPreviewButton previewUrl={track.preview_url ?? null} />
    </div>
  );
}
