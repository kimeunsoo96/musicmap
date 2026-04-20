'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Place, MapBounds, Mood } from '@/types';

interface MapCenter {
  lat: number;
  lng: number;
}

interface MapContextValue {
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  mapCenter: MapCenter;
  setMapCenter: (center: MapCenter) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  visibleBounds: MapBounds | null;
  setVisibleBounds: (bounds: MapBounds | null) => void;
  activeMood: Mood | null;
  setActiveMood: (mood: Mood | null) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

const DEFAULT_CENTER: MapCenter = { lat: 20, lng: 0 };
const DEFAULT_ZOOM = 3;

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlace, setSelectedPlaceState] = useState<Place | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapCenter>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [visibleBounds, setVisibleBounds] = useState<MapBounds | null>(null);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  function setSelectedPlace(place: Place | null) {
    setSelectedPlaceState(place);
    if (place) {
      setIsPanelOpen(true);
      setMapCenter({ lat: place.lat, lng: place.lng });
    }
  }

  function openPanel() {
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
    setSelectedPlaceState(null);
  }

  return (
    <MapContext.Provider
      value={{
        selectedPlace,
        setSelectedPlace,
        isPanelOpen,
        openPanel,
        closePanel,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        visibleBounds,
        setVisibleBounds,
        activeMood,
        setActiveMood,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within MapProvider');
  return ctx;
}
