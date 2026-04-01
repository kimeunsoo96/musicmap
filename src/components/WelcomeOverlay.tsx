'use client';

import React, { useEffect, useState } from 'react';
import { Music, Globe } from 'lucide-react';

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    try {
      const visited = localStorage.getItem('musicmap_visited');
      if (!visited) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (SSR or private mode), skip overlay
    }
  }, []);

  function dismiss() {
    setDismissing(true);
    try {
      localStorage.setItem('musicmap_visited', 'true');
    } catch {
      // ignore
    }
    setTimeout(() => setVisible(false), 500);
  }

  if (!visible) return null;

  return (
    <div
      className="welcome-overlay"
      style={{
        opacity: dismissing ? 0 : 1,
        transform: dismissing ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Animated gradient background */}
      <div className="welcome-bg" aria-hidden="true" />

      {/* Content card */}
      <div
        className="welcome-card"
        style={{
          opacity: dismissing ? 0 : 1,
          transform: dismissing ? 'translateY(20px) scale(0.97)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s',
        }}
      >
        {/* Icon lockup */}
        <div className="welcome-icon-wrap" aria-hidden="true">
          <div className="welcome-icon-ring" />
          <div className="welcome-icon-inner">
            <Globe className="welcome-globe" />
            <Music className="welcome-music" />
          </div>
        </div>

        {/* Text */}
        <h1 className="welcome-title">MusicMap</h1>
        <p className="welcome-tagline">Pin your music to the world</p>
        <p className="welcome-description">
          Discover the soundtrack of every destination, curated by travelers worldwide
        </p>

        {/* CTA */}
        <button
          onClick={dismiss}
          className="welcome-cta"
          autoFocus
        >
          Explore the Map
        </button>

        {/* Subtle footer */}
        <p className="welcome-footer">No account needed to explore</p>
      </div>
    </div>
  );
}
