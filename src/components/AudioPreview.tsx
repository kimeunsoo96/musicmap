'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPreviewProps {
  previewUrl: string | null;
}

export default function AudioPreview({ previewUrl }: AudioPreviewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!previewUrl) return null;

  function handleToggle() {
    if (!previewUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(previewUrl);
      audioRef.current.volume = 0.5;

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(pct);
        }
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any other playing audio on the page
      document.querySelectorAll('audio').forEach(a => a.pause());
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'relative w-8 h-8 rounded-full flex items-center justify-center transition-all',
        isPlaying
          ? 'bg-spotify text-black'
          : 'bg-surface-hover text-slate-400 hover:text-spotify hover:bg-spotify/20',
      )}
      aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
    >
      {/* Circular progress ring */}
      {isPlaying && (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="2"
          />
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 14}`}
            strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
            strokeLinecap="round"
          />
        </svg>
      )}
      {isPlaying ? (
        <Pause className="w-3.5 h-3.5 relative z-10" />
      ) : (
        <Play className="w-3.5 h-3.5 relative z-10 ml-0.5" />
      )}
    </button>
  );
}
