'use client';

import React, { useState, useEffect } from 'react';
import { X, Bookmark, MapPin, Plus, Music } from 'lucide-react';
import Link from 'next/link';
import { useMapContext } from '@/contexts/map-context';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import PinCard from './PinCard';
import type { Place, Pin, PlaceDetail } from '@/types';

const AddPinModalLazy = dynamic(() => import('./AddPinModal'), { ssr: false });

interface AddPinButtonProps {
  placeId: string;
  placeName: string;
  onPinAdded: () => void;
  place: Place | null;
}

function AddPinButton({ placeId, placeName, onPinAdded, place }: AddPinButtonProps) {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-spotify hover:bg-spotify-dark text-black font-semibold text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add a Song
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-spotify hover:bg-spotify-dark text-black font-semibold text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add a Song
      </button>
      {modalOpen && (
        <AddPinModalLazy
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            onPinAdded();
          }}
          placeId={placeId}
          placeName={placeName}
          place={place}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------
// Empty state component
// ----------------------------------------------------------------
function EmptyPins({ placeName }: { placeName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
      <div className="empty-state-icon w-14 h-14 rounded-full bg-surface-hover flex items-center justify-center">
        <Music className="w-6 h-6 text-spotify/60" />
      </div>
      <div>
        <p className="font-semibold text-slate-300 text-sm mb-1">
          Be the first to share a song here
        </p>
        <p className="text-slate-500 text-sm leading-relaxed">
          What song reminds you of {placeName}?
        </p>
      </div>
    </div>
  );
}

export default function PlacePanel() {
  const { selectedPlace, isPanelOpen, closePanel } = useMapContext();
  const [detail, setDetail] = useState<PlaceDetail | null>(null);
  const [saved, setSaved] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load place detail whenever selectedPlace changes
  useEffect(() => {
    if (!selectedPlace) {
      setDetail(null);
      setSaved(false);
      return;
    }

    setLoadingDetail(true);
    fetch(`/api/places/${selectedPlace.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PlaceDetail | null) => {
        setDetail(data);
      })
      .catch(() => setDetail(null))
      .finally(() => setLoadingDetail(false));
  }, [selectedPlace?.id]);

  function refreshDetail() {
    if (!selectedPlace) return;
    fetch(`/api/places/${selectedPlace.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PlaceDetail | null) => setDetail(data))
      .catch(() => {});
  }

  async function handleSave() {
    if (!selectedPlace) return;
    try {
      const res = await fetch(`/api/places/${selectedPlace.id}/save`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setSaved(result.saved);
      }
    } catch {
      // ignore
    }
  }

  const pins: Pin[] = detail
    ? [...detail.pins].sort((a, b) => b.likes_count - a.likes_count)
    : [];

  const isOpen = isPanelOpen && selectedPlace !== null;

  return (
    <div
      className={cn(
        'fixed z-[9999]',
        'bg-surface-light border-accent/20',
        'flex flex-col',
        'transition-transform duration-300 ease-in-out',
        // Mobile: bottom sheet
        'bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t border-l-0 border-r-0',
        !isOpen && 'translate-y-full',
        isOpen && 'translate-y-0',
        // Desktop: right panel
        'md:bottom-auto md:left-auto md:right-0 md:top-[60px] md:w-[380px] md:h-[calc(100vh-60px)] md:overflow-hidden',
        'md:rounded-none md:border-l md:border-t-0',
        !isOpen && 'md:translate-y-0 md:translate-x-full',
        isOpen && 'md:translate-x-0',
      )}
    >
      {/* Mobile drag handle */}
      <div className="md:hidden pt-2.5 pb-1 flex justify-center shrink-0">
        <div className="drag-handle" />
      </div>

      {selectedPlace && (
        <>
          {/* Header */}
          <div className="shrink-0 px-4 pt-3 pb-3 border-b border-white/5 md:pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-100 truncate">{selectedPlace.name}</h2>
                <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedPlace.city}, {selectedPlace.country}
                </p>
              </div>
              <button
                onClick={closePanel}
                className="shrink-0 p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-spotify/10 text-spotify text-xs font-semibold">
                {detail?.pin_count ?? selectedPlace.pin_count} {(detail?.pin_count ?? selectedPlace.pin_count) === 1 ? 'pin' : 'pins'}
              </span>
              <button
                onClick={handleSave}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                  saved
                    ? 'bg-accent/20 text-accent'
                    : 'bg-surface-hover text-slate-400 hover:text-slate-200',
                )}
              >
                <Bookmark className={cn('w-3.5 h-3.5', saved && 'fill-current')} />
                {saved ? 'Saved' : 'Save Place'}
              </button>
            </div>
          </div>

          {/* Pin list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {loadingDetail ? (
              <p className="text-sm text-slate-500 text-center py-8">Loading...</p>
            ) : pins.length === 0 ? (
              <EmptyPins placeName={selectedPlace.name} />
            ) : (
              pins.map((pin) => <PinCard key={pin.id} pin={pin} />)
            )}
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 px-4 py-3 border-t border-white/5 bottom-sheet-footer">
            <AddPinButton
              placeId={selectedPlace.id}
              placeName={selectedPlace.name}
              onPinAdded={refreshDetail}
              place={selectedPlace}
            />
          </div>
        </>
      )}
    </div>
  );
}
