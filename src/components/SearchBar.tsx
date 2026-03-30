'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useMapContext } from '@/contexts/map-context';
import type { Place } from '@/types';
import { cn } from '@/lib/utils';

export default function SearchBar() {
  const { setSelectedPlace } = useMapContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.places || []);
      setShowDropdown((data.places || []).length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { search(query); }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  function handleSelect(place: Place) {
    setSelectedPlace(place);
    setQuery(place.name);
    setShowDropdown(false);
  }

  function handleBlur() {
    setTimeout(() => setShowDropdown(false), 150);
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={handleBlur}
          placeholder="Search a destination..."
          className={cn(
            'w-full pl-9 pr-4 py-2 text-sm rounded-full',
            'bg-surface-light text-slate-200 placeholder:text-slate-500',
            'border border-white/10',
            'outline-none focus:ring-2 focus:ring-spotify/60 focus:border-spotify/40',
            'transition-all',
          )}
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-surface-light border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {results.map((place) => (
            <button
              key={place.id}
              onMouseDown={() => handleSelect(place)}
              className="w-full flex flex-col items-start px-4 py-2.5 hover:bg-surface-hover transition-colors text-left"
            >
              <span className="text-sm font-medium text-slate-200">{place.name}</span>
              <span className="text-xs text-slate-500">
                {place.city}, {place.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
