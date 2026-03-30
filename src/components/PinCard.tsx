'use client';

import React, { useState } from 'react';
import { Heart, Music } from 'lucide-react';
import { toggleMockLike, isMockLiked } from '@/lib/mock-data';
import { cn, timeAgo } from '@/lib/utils';
import type { Pin } from '@/types';
import AudioPreview from './AudioPreview';

interface PinCardProps {
  pin: Pin;
}

export default function PinCard({ pin }: PinCardProps) {
  const [liked, setLiked] = useState(() => isMockLiked(pin.id));
  const [likesCount, setLikesCount] = useState(pin.likes_count);

  function handleLike() {
    const result = toggleMockLike(pin.id);
    setLiked(result.liked);
    setLikesCount(result.likes_count);
  }

  const track = pin.track;
  const user = pin.user;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors">
      {/* Album art */}
      <div className="shrink-0 w-12 h-12 rounded overflow-hidden bg-surface-hover flex items-center justify-center">
        {track?.album_art_url ? (
          <img
            src={track.album_art_url}
            alt={track.album}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music className="w-5 h-5 text-slate-500" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-100 truncate">
          {track?.title ?? 'Unknown track'}
        </p>
        <p className="text-sm text-slate-400 truncate">
          {track?.artist ?? 'Unknown artist'}
        </p>
        {pin.caption && (
          <p className="text-sm text-slate-300 italic mt-0.5 line-clamp-2">
            &ldquo;{pin.caption}&rdquo;
          </p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          pinned by {user?.display_name ?? 'someone'} &middot; {timeAgo(pin.created_at)}
        </p>
      </div>

      {/* Audio preview */}
      <AudioPreview previewUrl={track?.preview_url ?? null} />

      {/* Like button */}
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <button
          onClick={handleLike}
          className={cn(
            'p-1.5 rounded-full transition-colors',
            liked
              ? 'text-red-500 hover:text-red-400'
              : 'text-slate-500 hover:text-slate-300',
          )}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
        </button>
        <span className="text-xs text-slate-500">{likesCount}</span>
      </div>
    </div>
  );
}
