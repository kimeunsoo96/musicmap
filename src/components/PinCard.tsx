'use client';

import React, { useState } from 'react';
import { Heart, Music, Globe2, Trash2 } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import type { Pin } from '@/types';
import AudioPreview from './AudioPreview';
import { useAuth } from '@/contexts/auth-context';
import dynamic from 'next/dynamic';

const TrackPlacesModalLazy = dynamic(() => import('./TrackPlacesModal'), { ssr: false });

interface PinCardProps {
  pin: Pin;
  onDelete?: () => void;
}

export default function PinCard({ pin, onDelete }: PinCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(pin.likes_count);
  const [showPlaces, setShowPlaces] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwnPin = user?.id && pin.user_id === user.id;

  async function handleLike() {
    if (!user) {
      alert('Sign in to like pins');
      return;
    }
    try {
      const res = await fetch(`/api/pins/${pin.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        const result = await res.json();
        setLiked(result.liked);
        setLikesCount(result.likes_count);
      }
    } catch {
      // ignore network errors
    }
  }

  async function handleDelete() {
    if (!user) return;
    if (!confirm('Delete this pin?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pins/${pin.id}?userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete?.();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Delete failed: ${err?.error ?? res.status}`);
      }
    } catch (e) {
      alert('Delete failed: network error');
    } finally {
      setDeleting(false);
    }
  }

  const track = pin.track;
  const user_ = pin.user;

  return (
    <>
      <div className="group flex items-start gap-3 p-3 rounded-lg bg-surface hover:bg-surface-hover transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-black/30">
        {/* Album art — clickable to explore places */}
        <button
          onClick={() => track && setShowPlaces(true)}
          className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded overflow-hidden bg-surface-hover flex items-center justify-center relative group/art"
          aria-label="See all places for this track"
        >
          {track?.album_art_url ? (
            <img
              src={track.album_art_url}
              alt={track.album}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Music className="w-5 h-5 text-slate-500" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
        </button>

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
            pinned by {user_?.display_name ?? 'someone'} &middot; {timeAgo(pin.created_at)}
          </p>
        </div>

        {/* Audio preview */}
        <AudioPreview pin={pin} />

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-center gap-0.5">
          <button
            onClick={handleLike}
            className={cn(
              'p-1.5 rounded-full transition-all duration-150',
              liked
                ? 'text-red-500 hover:text-red-400 scale-110'
                : 'text-slate-500 hover:text-slate-300 hover:scale-110',
            )}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          </button>
          <span className="text-xs text-slate-500">{likesCount}</span>
          {isOwnPin && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-full text-slate-600 hover:text-red-400 hover:scale-110 transition-all mt-1 disabled:opacity-50"
              aria-label="Delete pin"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {showPlaces && track && (
        <TrackPlacesModalLazy trackId={track.id} onClose={() => setShowPlaces(false)} />
      )}
    </>
  );
}
