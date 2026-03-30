'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Music } from 'lucide-react';
import { addMockPin } from '@/lib/mock-data';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import type { Track } from '@/types';
import TrackSearchResult from './TrackSearchResult';

interface AddPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
}

const MAX_CAPTION = 140;

export default function AddPinModal({ isOpen, onClose, placeId, placeName }: AddPinModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResults, setTrackResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTrackQuery('');
      setTrackResults([]);
      setSelectedTrack(null);
      setCaption('');
    }
  }, [isOpen]);

  // Debounced track search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (trackQuery.trim()) {
        try {
          const res = await fetch(`/api/music/search?q=${encodeURIComponent(trackQuery)}`);
          const data = await res.json();
          setTrackResults(data.tracks || []);
        } catch {
          setTrackResults([]);
        }
      } else {
        setTrackResults([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trackQuery]);

  function handleSelectTrack(track: Track) {
    setSelectedTrack(track);
    setStep(2);
  }

  function handleBack() {
    setStep(1);
    setSelectedTrack(null);
  }

  async function handleSubmit() {
    if (!selectedTrack || !user) return;
    setSubmitting(true);
    try {
      addMockPin(placeId, selectedTrack.id, user.id, caption.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div
        className={cn(
          'w-full max-w-lg bg-surface-light rounded-xl shadow-2xl border border-white/10',
          'flex flex-col max-h-[90vh]',
          'transition-all duration-200',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5 shrink-0">
          <h2 className="text-base font-semibold text-slate-100">
            {step === 1 ? `Add a song to ${placeName}` : 'Add a caption'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Track search */}
        {step === 1 && (
          <div className="flex flex-col flex-1 min-h-0 px-5 py-4 gap-3">
            <div className="relative flex items-center shrink-0">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Search for a track or artist..."
                className={cn(
                  'w-full pl-9 pr-4 py-2 text-sm rounded-lg',
                  'bg-surface text-slate-200 placeholder:text-slate-500',
                  'border border-white/10',
                  'outline-none focus:ring-2 focus:ring-spotify/60 focus:border-spotify/40',
                  'transition-all',
                )}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {trackResults.length === 0 && trackQuery.trim() === '' && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                  <Music className="w-8 h-8 opacity-40" />
                  <p className="text-sm">Search for a track to pin</p>
                </div>
              )}
              {trackResults.length === 0 && trackQuery.trim() !== '' && (
                <p className="text-sm text-slate-500 text-center py-6">No tracks found</p>
              )}
              {trackResults.map((track) => (
                <TrackSearchResult
                  key={track.id}
                  track={track}
                  onSelect={handleSelectTrack}
                  isSelected={selectedTrack?.id === track.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Caption */}
        {step === 2 && selectedTrack && (
          <div className="flex flex-col px-5 py-4 gap-4">
            {/* Selected track preview */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-spotify/30">
              <div className="shrink-0 w-12 h-12 rounded overflow-hidden bg-surface-hover">
                {selectedTrack.album_art_url ? (
                  <img
                    src={selectedTrack.album_art_url}
                    alt={selectedTrack.album}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-slate-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{selectedTrack.title}</p>
                <p className="text-xs text-slate-400 truncate">{selectedTrack.artist}</p>
              </div>
            </div>

            {/* Caption textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Caption <span className="text-slate-600 normal-case">(optional)</span>
              </label>
              <textarea
                autoFocus
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
                placeholder="What does this song mean to you here?"
                rows={3}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-lg resize-none',
                  'bg-surface text-slate-200 placeholder:text-slate-500',
                  'border border-white/10',
                  'outline-none focus:ring-2 focus:ring-spotify/60 focus:border-spotify/40',
                  'transition-all',
                )}
              />
              <p className="text-xs text-slate-600 text-right">
                {caption.length} / {MAX_CAPTION}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleBack}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 bg-surface hover:bg-surface-hover border border-white/10 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold text-black transition-colors',
                  'bg-spotify hover:bg-spotify-dark',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                {submitting ? 'Pinning...' : 'Pin this song'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
