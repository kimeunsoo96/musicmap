export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
}

export interface Place {
  id: string;
  google_place_id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  cover_image: string | null;
  pin_count: number;
  created_at: string;
}

export interface Track {
  id: string;
  spotify_track_id: string;
  title: string;
  artist: string;
  album: string;
  album_art_url: string;
  preview_url: string | null;
  duration_ms: number;
  created_at: string;
}

export type Mood = 'chill' | 'energy' | 'melancholy' | 'romantic' | 'nostalgic';

export const MOODS: { id: Mood; label: string; emoji: string; color: string }[] = [
  { id: 'chill',      label: 'Chill',      emoji: '🌿', color: '#10b981' },
  { id: 'energy',     label: 'Energy',     emoji: '⚡', color: '#f59e0b' },
  { id: 'melancholy', label: 'Melancholy', emoji: '🌧️', color: '#64748b' },
  { id: 'romantic',   label: 'Romantic',   emoji: '🌹', color: '#ec4899' },
  { id: 'nostalgic',  label: 'Nostalgic',  emoji: '📼', color: '#a78bfa' },
];

export interface Pin {
  id: string;
  place_id: string;
  track_id: string;
  user_id: string;
  caption: string;
  mood?: Mood | null;
  likes_count: number;
  created_at: string;
  track?: Track;
  user?: User;
  place?: Place;
}

export interface PinLike {
  id: string;
  pin_id: string;
  user_id: string;
  created_at: string;
}

export interface SavedPlace {
  id: string;
  place_id: string;
  user_id: string;
  created_at: string;
  place?: Place;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PlaceDetail extends Place {
  pins: Pin[];
}

export interface SpotifySearchResult {
  tracks: Track[];
}
