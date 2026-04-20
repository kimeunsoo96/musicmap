'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Music, Globe2 } from 'lucide-react';
import { useMapContext } from '@/contexts/map-context';
import type { Pin, Place, Track } from '@/types';

interface TrackPlacesModalProps {
  trackId: string;
  onClose: () => void;
}

interface Data {
  track: Track;
  pins: (Pin & { place: Place })[];
}

export default function TrackPlacesModal({ trackId, onClose }: TrackPlacesModalProps) {
  const { setSelectedPlace } = useMapContext();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tracks/${trackId}/places`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Data | null) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [trackId]);

  function handlePlaceClick(place: Place) {
    setSelectedPlace(place);
    onClose();
  }

  const uniquePlaces = React.useMemo(() => {
    if (!data) return [];
    const seen = new Set<string>();
    const result: { place: Place; pinCount: number }[] = [];
    for (const pin of data.pins) {
      if (seen.has(pin.place.id)) {
        const entry = result.find((r) => r.place.id === pin.place.id);
        if (entry) entry.pinCount++;
      } else {
        seen.add(pin.place.id);
        result.push({ place: pin.place, pinCount: 1 });
      }
    }
    return result;
  }, [data]);

  return (
    <div
      className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center px-0 md:px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#14151c] w-full md:max-w-md rounded-t-2xl md:rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 p-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8b5cf6] uppercase tracking-wide">
              <Globe2 className="w-3.5 h-3.5" />
              Where this track lives
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {data && (
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-14 h-14 rounded overflow-hidden bg-surface-hover flex items-center justify-center">
                {data.track.album_art_url ? (
                  <img src={data.track.album_art_url} alt={data.track.album} className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-100 truncate">{data.track.title}</p>
                <p className="text-sm text-slate-400 truncate">{data.track.artist}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  pinned in {uniquePlaces.length} {uniquePlaces.length === 1 ? 'place' : 'places'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">Loading…</p>
          ) : uniquePlaces.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No places found.</p>
          ) : (
            <div className="space-y-1.5">
              {uniquePlaces.map(({ place, pinCount }) => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left transition-colors group"
                >
                  <div className="shrink-0 w-9 h-9 rounded-full bg-spotify/10 flex items-center justify-center group-hover:bg-spotify/20 transition-colors">
                    <MapPin className="w-4 h-4 text-spotify" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-100 truncate">{place.name}</p>
                    <p className="text-xs text-slate-400 truncate">{place.city}, {place.country}</p>
                  </div>
                  {pinCount > 1 && (
                    <span className="shrink-0 text-xs text-slate-500">×{pinCount}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
