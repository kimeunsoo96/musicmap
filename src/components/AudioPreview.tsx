'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { cn } from '@/lib/utils';
import type { Pin } from '@/types';

interface AudioPreviewProps {
  pin: Pin;
}

export default function AudioPreview({ pin }: AudioPreviewProps) {
  const { currentPin, isPlaying, togglePlay, playPin } = useAudioPlayer();
  const previewUrl = pin.track?.preview_url;
  if (!previewUrl) return null;

  const isThisPin = currentPin?.id === pin.id;
  const active = isThisPin && isPlaying;

  function handleToggle() {
    if (isThisPin) togglePlay();
    else playPin(pin);
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-all',
        active
          ? 'bg-spotify text-black'
          : 'bg-surface-hover text-slate-400 hover:text-spotify hover:bg-spotify/20',
      )}
      aria-label={active ? 'Pause preview' : 'Play preview'}
    >
      {active ? (
        <Pause className="w-3.5 h-3.5" />
      ) : (
        <Play className="w-3.5 h-3.5 ml-0.5" />
      )}
    </button>
  );
}
