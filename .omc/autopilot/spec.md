# MusicMap - Product Specification

## One-Line Definition
"A map where travelers pin places and share the songs that define their moments"

## Core Concept
A web app where a Google Maps-based interface lets travelers worldwide:
- Pin travel destinations on an interactive map
- Share songs/playlists tied to specific places
- Discover music other travelers associated with locations
- Build community-driven, location-based playlists

This is an **"Emotion Map"** — not just music recommendations, but feelings and memories tied to places.

## User Scenarios
1. A traveler visits Bali, pins the location, adds "Sunset Lover" by Petit Biscuit with a note "Perfect for Seminyak sunset"
2. Someone planning a Tokyo trip browses the map, finds Tokyo pins, discovers a playlist of songs other travelers loved there
3. A user searches "Paris" and sees a curated community playlist of songs people associate with Paris

## MVP Scope (Build Now)

### Features
1. **Interactive Map** — Google Maps with place pins showing music activity
2. **Place Search** — Search destinations via Google Places API
3. **Add Song to Place** — Pin a Spotify track to a location with a one-line emotion/caption
4. **Place Detail View** — See all songs pinned to a location, sorted by popularity
5. **User Auth** — Google OAuth login via Supabase
6. **Like/Save** — Like songs on places, save places to favorites
7. **Browse & Discover** — Explore the map, click clusters, find music

### NOT in MVP
- Shorts/reels auto-generation (Phase 2)
- Spotify playlist auto-creation (Phase 2)
- Comments/social features beyond likes (Phase 2)
- Admin back-office (Phase 2)
- TikTok/Instagram/YouTube API integration (Phase 2)
- Mobile app (Phase 2)

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark theme)
- **Database + Auth:** Supabase (PostgreSQL + Auth + Row-Level Security)
- **Map:** Google Maps JavaScript API + Places API
- **Music:** Spotify Web API (search, track metadata, embeds)
- **Deployment:** Static/Vercel-ready (but no deploy in MVP build)

## Database Schema

### places
- id (uuid, PK)
- google_place_id (text, unique)
- name (text)
- lat (float8)
- lng (float8)
- city (text)
- country (text)
- cover_image (text, nullable)
- pin_count (int, default 0)
- created_at (timestamptz)

### tracks
- id (uuid, PK)
- spotify_track_id (text, unique)
- title (text)
- artist (text)
- album (text)
- album_art_url (text)
- preview_url (text, nullable)
- duration_ms (int)
- created_at (timestamptz)

### pins (place_track_posts)
- id (uuid, PK)
- place_id (uuid, FK -> places)
- track_id (uuid, FK -> tracks)
- user_id (uuid, FK -> auth.users)
- caption (text, max 140 chars)
- likes_count (int, default 0)
- created_at (timestamptz)

### pin_likes
- id (uuid, PK)
- pin_id (uuid, FK -> pins)
- user_id (uuid, FK -> auth.users)
- created_at (timestamptz)
- UNIQUE(pin_id, user_id)

### saved_places
- id (uuid, PK)
- place_id (uuid, FK -> places)
- user_id (uuid, FK -> auth.users)
- created_at (timestamptz)
- UNIQUE(place_id, user_id)

## Page Structure
- `/` — Main map view (full-screen map + search + sidebar)
- `/place/[id]` — Place detail (all pinned songs, place info)
- `/login` — Auth page
- `/profile` — User's pins and saved places

## UI/UX Direction
- Dark theme (surface: #0f1117)
- Full-screen map as the primary interface
- Slide-in panel for place details (right side)
- Floating search bar at top
- Spotify-green accent (#1DB954) for music elements
- Purple accent (#8b5cf6) for UI elements
- Clusters on map showing activity density
- Mobile-responsive

## Key Interactions
1. **Browse Map** — Pan/zoom, see pin clusters
2. **Click Cluster/Pin** — Opens place detail panel
3. **Search Place** — Google Places autocomplete, map flies to location
4. **Add Pin** — Select place → Search Spotify track → Add caption → Submit
5. **Like Pin** — Heart button on each song card
6. **Save Place** — Bookmark a place for later
7. **Play Preview** — 30-sec Spotify preview inline (if available)

## API Routes
- `GET /api/places` — Get places with pins (within map bounds)
- `GET /api/places/[id]` — Get place detail with pins
- `POST /api/places` — Create/get place from Google place_id
- `POST /api/pins` — Create a new pin (auth required)
- `POST /api/pins/[id]/like` — Toggle like (auth required)
- `POST /api/places/[id]/save` — Toggle save (auth required)
- `GET /api/spotify/search` — Proxy Spotify track search
- `GET /api/profile` — Get user's pins and saved places
