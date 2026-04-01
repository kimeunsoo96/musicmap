'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapContext } from '@/contexts/map-context';
import type { Place } from '@/types';

// ----------------------------------------------------------------
// Custom pin icon
// ----------------------------------------------------------------
const createPinIcon = (pinCount: number) => {
  const size = Math.min(32, Math.max(14, 10 + pinCount * 2));
  const pulseClass = pinCount >= 3 ? 'pin-pulse' : '';
  return L.divIcon({
    className: 'custom-pin',
    html: `<div class="${pulseClass}" style="width:${size}px;height:${size}px;background:#1DB954;border-radius:50%;border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 10px rgba(29,185,84,0.4);transition:transform 0.2s;cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ----------------------------------------------------------------
// FlyToHandler - watches mapCenter changes and flies the map there
// ----------------------------------------------------------------
function FlyToHandler() {
  const map = useMap();
  const { mapCenter, selectedPlace } = useMapContext();

  useEffect(() => {
    // Only fly when a place is actually selected (not on initial load)
    if (selectedPlace) {
      map.flyTo([mapCenter.lat, mapCenter.lng], 12, { duration: 1.2 });
    }
  }, [mapCenter, selectedPlace]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

// ----------------------------------------------------------------
// MapEvents - listens for moveend
// ----------------------------------------------------------------
function MapEvents() {
  useMapEvents({
    moveend: () => {
      // bounds-based fetching can be wired here in future
    },
  });
  return null;
}

// ----------------------------------------------------------------
// Main Map component
// ----------------------------------------------------------------
export default function Map() {
  const { setSelectedPlace, selectedPlace } = useMapContext();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetch('/api/places')
      .then((res) => res.json())
      .then((data: Place[]) => setPlaces(Array.isArray(data) ? data : []))
      .catch(() => setPlaces([]));
  }, []);

  // Add searched places that aren't already in the list
  useEffect(() => {
    if (selectedPlace && !places.find((p) => p.id === selectedPlace.id)) {
      setPlaces((prev) => [...prev, selectedPlace]);
    }
  }, [selectedPlace]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      <FlyToHandler />
      <MapEvents />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createPinIcon(place.pin_count)}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              setTimeout(() => setSelectedPlace(place), 10);
            },
            mouseover: (e) => {
              const marker = e.target;
              marker.bindTooltip(
                `<strong>${place.name}</strong><br/><span style="color:#1DB954">${place.pin_count} ${place.pin_count === 1 ? 'pin' : 'pins'}</span>`,
                {
                  className: 'custom-tooltip',
                  direction: 'top',
                  offset: [0, -10],
                }
              ).openTooltip();
            },
            mouseout: (e) => {
              e.target.closeTooltip();
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
