import type { User, Place, Track, Pin, SavedPlace, MapBounds, PlaceDetail } from '@/types';

// ============================================================
// HELPERS
// ============================================================

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// ============================================================
// MOCK USERS
// ============================================================

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'alex@example.com',
    display_name: 'Alex Rivera',
    avatar_url: 'https://picsum.photos/seed/user-1/100/100',
  },
  {
    id: 'user-2',
    email: 'yuki@example.com',
    display_name: 'Yuki Tanaka',
    avatar_url: 'https://picsum.photos/seed/user-2/100/100',
  },
  {
    id: 'user-3',
    email: 'emma@example.com',
    display_name: 'Emma Lindström',
    avatar_url: 'https://picsum.photos/seed/user-3/100/100',
  },
];

// ============================================================
// MOCK TRACKS
// ============================================================

export const MOCK_TRACKS: Track[] = [
  {
    id: 'track-sunset-lover',
    spotify_track_id: 'spotify-sunset-lover',
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    album: 'Presence',
    album_art_url: 'https://picsum.photos/seed/track-1/300/300',
    preview_url: null,
    duration_ms: 237000,
    created_at: daysAgo(30),
  },
  {
    id: 'track-midnight-city',
    spotify_track_id: 'spotify-midnight-city',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    album_art_url: 'https://picsum.photos/seed/track-2/300/300',
    preview_url: null,
    duration_ms: 244000,
    created_at: daysAgo(29),
  },
  {
    id: 'track-bam-bam',
    spotify_track_id: 'spotify-bam-bam',
    title: 'Bam Bam',
    artist: 'Sister Nancy',
    album: 'One Two',
    album_art_url: 'https://picsum.photos/seed/track-3/300/300',
    preview_url: null,
    duration_ms: 218000,
    created_at: daysAgo(28),
  },
  {
    id: 'track-svefn-g-englar',
    spotify_track_id: 'spotify-svefn-g-englar',
    title: 'Svefn-g-englar',
    artist: 'Sigur Rós',
    album: 'Ágætis byrjun',
    album_art_url: 'https://picsum.photos/seed/track-4/300/300',
    preview_url: null,
    duration_ms: 610000,
    created_at: daysAgo(27),
  },
  {
    id: 'track-breathing-underwater',
    spotify_track_id: 'spotify-breathing-underwater',
    title: 'Breathing Underwater',
    artist: 'Emeli Sandé',
    album: 'Long Live The Angels',
    album_art_url: 'https://picsum.photos/seed/track-5/300/300',
    preview_url: null,
    duration_ms: 236000,
    created_at: daysAgo(26),
  },
  {
    id: 'track-people-everywhere',
    spotify_track_id: 'spotify-people-everywhere',
    title: 'People Everywhere (Still Alive)',
    artist: 'Khruangbin',
    album: 'Mordechai',
    album_art_url: 'https://picsum.photos/seed/track-6/300/300',
    preview_url: null,
    duration_ms: 205000,
    created_at: daysAgo(25),
  },
  {
    id: 'track-lost-in-japan',
    spotify_track_id: 'spotify-lost-in-japan',
    title: 'Lost in Japan',
    artist: 'Shawn Mendes',
    album: 'Shawn Mendes',
    album_art_url: 'https://picsum.photos/seed/track-7/300/300',
    preview_url: null,
    duration_ms: 197000,
    created_at: daysAgo(24),
  },
  {
    id: 'track-la-vie-en-rose',
    spotify_track_id: 'spotify-la-vie-en-rose',
    title: 'La Vie en Rose',
    artist: 'Édith Piaf',
    album: 'The Very Best Of',
    album_art_url: 'https://picsum.photos/seed/track-8/300/300',
    preview_url: null,
    duration_ms: 198000,
    created_at: daysAgo(23),
  },
  {
    id: 'track-africa',
    spotify_track_id: 'spotify-africa',
    title: 'Africa',
    artist: 'TOTO',
    album: 'Toto IV',
    album_art_url: 'https://picsum.photos/seed/track-9/300/300',
    preview_url: null,
    duration_ms: 295000,
    created_at: daysAgo(22),
  },
  {
    id: 'track-comptine',
    spotify_track_id: 'spotify-comptine',
    title: "Comptine d'un autre été",
    artist: 'Yann Tiersen',
    album: 'Amelie OST',
    album_art_url: 'https://picsum.photos/seed/track-10/300/300',
    preview_url: null,
    duration_ms: 141000,
    created_at: daysAgo(21),
  },
  {
    id: 'track-island-in-the-sun',
    spotify_track_id: 'spotify-island-in-the-sun',
    title: 'Island in the Sun',
    artist: 'Weezer',
    album: 'Weezer (Green Album)',
    album_art_url: 'https://picsum.photos/seed/track-11/300/300',
    preview_url: null,
    duration_ms: 194000,
    created_at: daysAgo(20),
  },
  {
    id: 'track-saudade',
    spotify_track_id: 'spotify-saudade',
    title: 'Saudade',
    artist: 'Thievery Corporation',
    album: 'Saudade',
    album_art_url: 'https://picsum.photos/seed/track-12/300/300',
    preview_url: null,
    duration_ms: 287000,
    created_at: daysAgo(19),
  },
  {
    id: 'track-electric-feel',
    spotify_track_id: 'spotify-electric-feel',
    title: 'Electric Feel',
    artist: 'MGMT',
    album: 'Oracular Spectacular',
    album_art_url: 'https://picsum.photos/seed/track-13/300/300',
    preview_url: null,
    duration_ms: 229000,
    created_at: daysAgo(18),
  },
  {
    id: 'track-riptide',
    spotify_track_id: 'spotify-riptide',
    title: 'Riptide',
    artist: 'Vance Joy',
    album: 'Dream Your Life Away',
    album_art_url: 'https://picsum.photos/seed/track-14/300/300',
    preview_url: null,
    duration_ms: 203000,
    created_at: daysAgo(17),
  },
  {
    id: 'track-clocks',
    spotify_track_id: 'spotify-clocks',
    title: 'Clocks',
    artist: 'Coldplay',
    album: 'A Rush of Blood to the Head',
    album_art_url: 'https://picsum.photos/seed/track-15/300/300',
    preview_url: null,
    duration_ms: 308000,
    created_at: daysAgo(16),
  },
];

// ============================================================
// MOCK PLACES
// ============================================================

export const MOCK_PLACES: Place[] = [
  {
    id: 'place-bali',
    google_place_id: 'gplace-bali',
    name: 'Bali',
    lat: -8.4095,
    lng: 115.1889,
    city: 'Denpasar',
    country: 'Indonesia',
    cover_image: 'https://picsum.photos/seed/place-Bali/800/400',
    pin_count: 3,
    created_at: daysAgo(30),
  },
  {
    id: 'place-tokyo',
    google_place_id: 'gplace-tokyo',
    name: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    city: 'Tokyo',
    country: 'Japan',
    cover_image: 'https://picsum.photos/seed/place-Tokyo/800/400',
    pin_count: 2,
    created_at: daysAgo(29),
  },
  {
    id: 'place-paris',
    google_place_id: 'gplace-paris',
    name: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    city: 'Paris',
    country: 'France',
    cover_image: 'https://picsum.photos/seed/place-Paris/800/400',
    pin_count: 3,
    created_at: daysAgo(28),
  },
  {
    id: 'place-lisbon',
    google_place_id: 'gplace-lisbon',
    name: 'Lisbon',
    lat: 38.7223,
    lng: -9.1393,
    city: 'Lisbon',
    country: 'Portugal',
    cover_image: 'https://picsum.photos/seed/place-Lisbon/800/400',
    pin_count: 2,
    created_at: daysAgo(27),
  },
  {
    id: 'place-marrakech',
    google_place_id: 'gplace-marrakech',
    name: 'Marrakech',
    lat: 31.6295,
    lng: -7.9811,
    city: 'Marrakech',
    country: 'Morocco',
    cover_image: 'https://picsum.photos/seed/place-Marrakech/800/400',
    pin_count: 2,
    created_at: daysAgo(26),
  },
  {
    id: 'place-tulum',
    google_place_id: 'gplace-tulum',
    name: 'Tulum',
    lat: 20.2114,
    lng: -87.4654,
    city: 'Tulum',
    country: 'Mexico',
    cover_image: 'https://picsum.photos/seed/place-Tulum/800/400',
    pin_count: 2,
    created_at: daysAgo(25),
  },
  {
    id: 'place-reykjavik',
    google_place_id: 'gplace-reykjavik',
    name: 'Reykjavik',
    lat: 64.1466,
    lng: -21.9426,
    city: 'Reykjavik',
    country: 'Iceland',
    cover_image: 'https://picsum.photos/seed/place-Reykjavik/800/400',
    pin_count: 1,
    created_at: daysAgo(24),
  },
  {
    id: 'place-cape-town',
    google_place_id: 'gplace-cape-town',
    name: 'Cape Town',
    lat: -33.9249,
    lng: 18.4241,
    city: 'Cape Town',
    country: 'South Africa',
    cover_image: 'https://picsum.photos/seed/place-CapeTown/800/400',
    pin_count: 2,
    created_at: daysAgo(23),
  },
  {
    id: 'place-bangkok',
    google_place_id: 'gplace-bangkok',
    name: 'Bangkok',
    lat: 13.7563,
    lng: 100.5018,
    city: 'Bangkok',
    country: 'Thailand',
    cover_image: 'https://picsum.photos/seed/place-Bangkok/800/400',
    pin_count: 2,
    created_at: daysAgo(22),
  },
  {
    id: 'place-new-york',
    google_place_id: 'gplace-new-york',
    name: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    city: 'New York',
    country: 'USA',
    cover_image: 'https://picsum.photos/seed/place-NewYork/800/400',
    pin_count: 3,
    created_at: daysAgo(21),
  },
];

// ============================================================
// MOCK PINS
// ============================================================

export let MOCK_PINS: Pin[] = [
  // Bali
  {
    id: 'pin-1',
    place_id: 'place-bali',
    track_id: 'track-sunset-lover',
    user_id: 'user-1',
    caption: 'Seminyak sunset perfection',
    likes_count: 14,
    created_at: daysAgo(10),
  },
  {
    id: 'pin-2',
    place_id: 'place-bali',
    track_id: 'track-island-in-the-sun',
    user_id: 'user-2',
    caption: 'Every rice field looks like a painting here',
    likes_count: 9,
    created_at: daysAgo(9),
  },
  {
    id: 'pin-3',
    place_id: 'place-bali',
    track_id: 'track-electric-feel',
    user_id: 'user-3',
    caption: 'Ubud jungle energy is unreal',
    likes_count: 7,
    created_at: daysAgo(8),
  },

  // Tokyo
  {
    id: 'pin-4',
    place_id: 'place-tokyo',
    track_id: 'track-lost-in-japan',
    user_id: 'user-2',
    caption: 'Lost in Shibuya at 2am',
    likes_count: 21,
    created_at: daysAgo(15),
  },
  {
    id: 'pin-5',
    place_id: 'place-tokyo',
    track_id: 'track-midnight-city',
    user_id: 'user-1',
    caption: 'Shinjuku neon lights hit different',
    likes_count: 18,
    created_at: daysAgo(14),
  },

  // Paris
  {
    id: 'pin-6',
    place_id: 'place-paris',
    track_id: 'track-la-vie-en-rose',
    user_id: 'user-3',
    caption: 'Walking along the Seine at dusk',
    likes_count: 33,
    created_at: daysAgo(20),
  },
  {
    id: 'pin-7',
    place_id: 'place-paris',
    track_id: 'track-comptine',
    user_id: 'user-1',
    caption: 'Café near Montmartre, rain outside',
    likes_count: 27,
    created_at: daysAgo(19),
  },
  {
    id: 'pin-8',
    place_id: 'place-paris',
    track_id: 'track-clocks',
    user_id: 'user-2',
    caption: 'Last morning before flying home',
    likes_count: 11,
    created_at: daysAgo(18),
  },

  // Lisbon
  {
    id: 'pin-9',
    place_id: 'place-lisbon',
    track_id: 'track-saudade',
    user_id: 'user-3',
    caption: 'Fado in the air, cobblestones underfoot',
    likes_count: 16,
    created_at: daysAgo(12),
  },
  {
    id: 'pin-10',
    place_id: 'place-lisbon',
    track_id: 'track-riptide',
    user_id: 'user-1',
    caption: 'Watching the Atlantic from Belém',
    likes_count: 8,
    created_at: daysAgo(11),
  },

  // Marrakech
  {
    id: 'pin-11',
    place_id: 'place-marrakech',
    track_id: 'track-africa',
    user_id: 'user-2',
    caption: 'Djemaa el-Fna at golden hour',
    likes_count: 19,
    created_at: daysAgo(7),
  },
  {
    id: 'pin-12',
    place_id: 'place-marrakech',
    track_id: 'track-people-everywhere',
    user_id: 'user-3',
    caption: 'The souk is alive with sound',
    likes_count: 12,
    created_at: daysAgo(6),
  },

  // Tulum
  {
    id: 'pin-13',
    place_id: 'place-tulum',
    track_id: 'track-bam-bam',
    user_id: 'user-1',
    caption: 'Beach vibes and jungle beats',
    likes_count: 24,
    created_at: daysAgo(5),
  },
  {
    id: 'pin-14',
    place_id: 'place-tulum',
    track_id: 'track-breathing-underwater',
    user_id: 'user-2',
    caption: 'Cenote diving, pure serenity',
    likes_count: 17,
    created_at: daysAgo(4),
  },

  // Reykjavik
  {
    id: 'pin-15',
    place_id: 'place-reykjavik',
    track_id: 'track-svefn-g-englar',
    user_id: 'user-3',
    caption: 'Northern lights, no words needed',
    likes_count: 42,
    created_at: daysAgo(3),
  },

  // Cape Town
  {
    id: 'pin-16',
    place_id: 'place-cape-town',
    track_id: 'track-africa',
    user_id: 'user-1',
    caption: 'Table Mountain at sunrise',
    likes_count: 22,
    created_at: daysAgo(16),
  },
  {
    id: 'pin-17',
    place_id: 'place-cape-town',
    track_id: 'track-saudade',
    user_id: 'user-2',
    caption: 'Kalk Bay harbor, late afternoon light',
    likes_count: 13,
    created_at: daysAgo(15),
  },

  // Bangkok
  {
    id: 'pin-18',
    place_id: 'place-bangkok',
    track_id: 'track-people-everywhere',
    user_id: 'user-3',
    caption: 'Chatuchak on a Sunday morning',
    likes_count: 10,
    created_at: daysAgo(8),
  },
  {
    id: 'pin-19',
    place_id: 'place-bangkok',
    track_id: 'track-electric-feel',
    user_id: 'user-1',
    caption: 'Tuk-tuk through the neon rain',
    likes_count: 15,
    created_at: daysAgo(7),
  },

  // New York
  {
    id: 'pin-20',
    place_id: 'place-new-york',
    track_id: 'track-midnight-city',
    user_id: 'user-2',
    caption: 'Manhattan at midnight, never sleeps',
    likes_count: 29,
    created_at: daysAgo(2),
  },
  {
    id: 'pin-21',
    place_id: 'place-new-york',
    track_id: 'track-clocks',
    user_id: 'user-3',
    caption: 'Grand Central rush hour, time flies',
    likes_count: 20,
    created_at: daysAgo(2),
  },
  {
    id: 'pin-22',
    place_id: 'place-new-york',
    track_id: 'track-riptide',
    user_id: 'user-1',
    caption: 'Brooklyn Bridge walk on a clear day',
    likes_count: 18,
    created_at: daysAgo(1),
  },
];

// ============================================================
// MUTABLE STATE
// ============================================================

export const MOCK_LIKED_PINS: Set<string> = new Set(['pin-6', 'pin-15', 'pin-20']);
export const MOCK_SAVED_PLACES: Set<string> = new Set(['place-bali', 'place-reykjavik']);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getTrackById(trackId: string): Track | undefined {
  return MOCK_TRACKS.find((t) => t.id === trackId);
}

function getUserById(userId: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === userId);
}

function getPlaceById(placeId: string): Place | undefined {
  return MOCK_PLACES.find((p) => p.id === placeId);
}

function enrichPin(pin: Pin): Pin {
  return {
    ...pin,
    track: getTrackById(pin.track_id),
    user: getUserById(pin.user_id),
    place: getPlaceById(pin.place_id),
  };
}

// ============================================================
// EXPORTED API
// ============================================================

export function getMockPlaces(bounds?: MapBounds): Place[] {
  if (!bounds) return [...MOCK_PLACES];
  return MOCK_PLACES.filter(
    (p) =>
      p.lat <= bounds.north &&
      p.lat >= bounds.south &&
      p.lng <= bounds.east &&
      p.lng >= bounds.west,
  );
}

export function getMockPlaceDetail(placeId: string): PlaceDetail | null {
  const place = getPlaceById(placeId);
  if (!place) return null;
  const pins = MOCK_PINS.filter((p) => p.place_id === placeId).map(enrichPin);
  return { ...place, pins };
}

export function searchMockTracks(query: string): Track[] {
  const q = query.toLowerCase();
  return MOCK_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q),
  );
}

export function getMockUserPins(userId: string): Pin[] {
  return MOCK_PINS.filter((p) => p.user_id === userId).map(enrichPin);
}

export function getMockSavedPlaces(userId: string): SavedPlace[] {
  return Array.from(MOCK_SAVED_PLACES).map((placeId, index) => ({
    id: `saved-${userId}-${index}`,
    place_id: placeId,
    user_id: userId,
    created_at: daysAgo(index + 1),
    place: getPlaceById(placeId),
  }));
}

export function addMockPin(
  placeId: string,
  trackId: string,
  userId: string,
  caption: string,
  mood: Pin['mood'] = null,
): Pin {
  const newPin: Pin = {
    id: `pin-${Date.now()}`,
    place_id: placeId,
    track_id: trackId,
    user_id: userId,
    caption,
    mood,
    likes_count: 0,
    created_at: new Date().toISOString(),
  };
  MOCK_PINS = [...MOCK_PINS, newPin];

  // Update pin_count on the place
  const place = MOCK_PLACES.find((p) => p.id === placeId);
  if (place) {
    place.pin_count += 1;
  }

  return enrichPin(newPin);
}

export function toggleMockLike(pinId: string): { liked: boolean; likes_count: number } {
  const pin = MOCK_PINS.find((p) => p.id === pinId);
  if (!pin) return { liked: false, likes_count: 0 };

  if (MOCK_LIKED_PINS.has(pinId)) {
    MOCK_LIKED_PINS.delete(pinId);
    pin.likes_count = Math.max(pin.likes_count - 1, 0);
    return { liked: false, likes_count: pin.likes_count };
  } else {
    MOCK_LIKED_PINS.add(pinId);
    pin.likes_count += 1;
    return { liked: true, likes_count: pin.likes_count };
  }
}

export function toggleMockSave(placeId: string): { saved: boolean } {
  if (MOCK_SAVED_PLACES.has(placeId)) {
    MOCK_SAVED_PLACES.delete(placeId);
    return { saved: false };
  } else {
    MOCK_SAVED_PLACES.add(placeId);
    return { saved: true };
  }
}

export function isMockLiked(pinId: string): boolean {
  return MOCK_LIKED_PINS.has(pinId);
}

export function isMockSaved(placeId: string): boolean {
  return MOCK_SAVED_PLACES.has(placeId);
}

export function getMockPlacesByMood(mood: NonNullable<Pin['mood']>, bounds?: MapBounds): Place[] {
  const placeIdsWithMood = new Set(
    MOCK_PINS.filter((p) => p.mood === mood).map((p) => p.place_id),
  );
  let places = MOCK_PLACES.filter((p) => placeIdsWithMood.has(p.id));
  if (bounds) {
    places = places.filter(
      (p) =>
        p.lat <= bounds.north &&
        p.lat >= bounds.south &&
        p.lng <= bounds.east &&
        p.lng >= bounds.west,
    );
  }
  return places;
}

export function getMockPinsInRegion(bounds: MapBounds, mood?: Pin['mood'] | null) {
  const placesInRegion = MOCK_PLACES.filter(
    (p) =>
      p.lat <= bounds.north &&
      p.lat >= bounds.south &&
      p.lng <= bounds.east &&
      p.lng >= bounds.west,
  );
  const placeIds = new Set(placesInRegion.map((p) => p.id));
  return MOCK_PINS
    .filter((pin) => placeIds.has(pin.place_id))
    .filter((pin) => !mood || pin.mood === mood)
    .map((p) => ({ ...enrichPin(p), place: getPlaceById(p.place_id)! }))
    .filter((p) => p.place);
}

export function getMockTrackPlaces(trackId: string) {
  const track = MOCK_TRACKS.find((t) => t.id === trackId);
  if (!track) return null;
  const pins = MOCK_PINS
    .filter((p) => p.track_id === trackId)
    .map((p) => ({ ...enrichPin(p), place: getPlaceById(p.place_id)! }))
    .filter((p) => p.place);
  return { track, pins };
}
