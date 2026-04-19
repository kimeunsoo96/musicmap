'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackPreviewButtonProps {
  previewUrl: string | null;
}

export default function TrackPreviewButton({ previewUrl }: TrackPreviewButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  if (!previewUrl) return null;

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(previewUrl!);
      audioRef.current.volume = 0.6;
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      document.querySelectorAll('audio').forEach((a) => a.pause());
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-all',
        isPlaying ? 'bg-spotify text-black' : 'bg-surface-hover text-slate-400 hover:text-spotify hover:bg-spotify/20',
      )}
      aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
    >
      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
    </button>
  );
}
