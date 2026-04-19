'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Pin } from '@/types';

interface AudioPlayerContextValue {
  queue: Pin[];
  currentIndex: number;
  currentPin: Pin | null;
  isPlaying: boolean;
  progress: number;
  placeName: string | null;
  playPlace: (placeName: string, pins: Pin[]) => void;
  playPin: (pin: Pin) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  close: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Pin[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [placeName, setPlaceName] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Pin[]>([]);
  const indexRef = useRef(0);

  queueRef.current = queue;
  indexRef.current = currentIndex;

  const currentPin = queue[currentIndex] ?? null;
  const currentUrl = currentPin?.track?.preview_url ?? null;

  // Init audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTime = () => {
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
    };
    const onEnded = () => {
      const i = indexRef.current;
      const q = queueRef.current;
      if (i + 1 < q.length) {
        setCurrentIndex(i + 1);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Load and play current track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentUrl) {
      audio.pause();
      return;
    }
    audio.src = currentUrl;
    audio.play().catch(() => setIsPlaying(false));
  }, [currentUrl]);

  // Pause all non-player audio elements when global player starts
  useEffect(() => {
    if (!isPlaying) return;
    document.querySelectorAll('audio').forEach((a) => {
      if (a !== audioRef.current) a.pause();
    });
  }, [isPlaying, currentUrl]);

  function playPlace(name: string, pins: Pin[]) {
    const playable = pins.filter((p) => p.track?.preview_url);
    if (playable.length === 0) return;
    setPlaceName(name);
    setQueue(playable);
    setCurrentIndex(0);
  }

  function playPin(pin: Pin) {
    if (!pin.track?.preview_url) return;
    const idx = queue.findIndex((p) => p.id === pin.id);
    if (idx >= 0) {
      if (idx === currentIndex) {
        audioRef.current?.play().catch(() => {});
      } else {
        setCurrentIndex(idx);
      }
      return;
    }
    setPlaceName(null);
    setQueue([pin]);
    setCurrentIndex(0);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  function next() {
    if (currentIndex + 1 < queue.length) setCurrentIndex(currentIndex + 1);
  }

  function prev() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function close() {
    audioRef.current?.pause();
    setQueue([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    setPlaceName(null);
    setProgress(0);
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        queue,
        currentIndex,
        currentPin,
        isPlaying,
        progress,
        placeName,
        playPlace,
        playPin,
        togglePlay,
        next,
        prev,
        close,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer(): AudioPlayerContextValue {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
