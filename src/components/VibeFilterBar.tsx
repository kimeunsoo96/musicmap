'use client';

import React from 'react';
import { MOODS } from '@/types';
import { useMapContext } from '@/contexts/map-context';
import { cn } from '@/lib/utils';

export default function VibeFilterBar() {
  const { activeMood, setActiveMood } = useMapContext();

  return (
    <div className="absolute top-0 left-0 right-0 z-[999] pointer-events-none">
      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto pointer-events-auto md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={() => setActiveMood(null)}
          className={cn(
            'shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all backdrop-blur-md',
            activeMood === null
              ? 'bg-white text-black border-white'
              : 'bg-black/40 text-slate-200 border-white/10 hover:border-white/30',
          )}
        >
          All
        </button>
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMood(activeMood === m.id ? null : m.id)}
            className={cn(
              'shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all backdrop-blur-md',
              activeMood === m.id
                ? 'bg-white text-black border-white scale-105'
                : 'bg-black/40 text-slate-200 border-white/10 hover:border-white/30',
            )}
          >
            <span>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
