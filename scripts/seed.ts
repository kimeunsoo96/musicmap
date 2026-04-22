/**
 * Seed script — run with `npm run seed`
 *
 * Injects iconic places + tracks + pins into Supabase.
 * Pins use user_id = null (anonymous "curator" entries).
 * Idempotent for places (dedup by google_place_id) and tracks
 * (dedup by spotify_track_id). Pins are only added when the
 * place currently has zero pins from this seed batch.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load env from .env.local if not set
const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Mood = 'chill' | 'energy' | 'melancholy' | 'romantic' | 'nostalgic';

interface Seed {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  query: string;     // Deezer search query
  artistHint?: string; // disambiguate
  mood: Mood;
  caption: string;
}

const SEEDS: Seed[] = [
  { name: 'Eiffel Tower', city: 'Paris', country: 'France', lat: 48.8584, lng: 2.2945,
    query: 'La Vie En Rose Edith Piaf', mood: 'romantic',
    caption: 'The soundtrack I heard stepping out of the metro at dusk.' },
  { name: 'Times Square', city: 'New York', country: 'USA', lat: 40.7580, lng: -73.9855,
    query: 'Empire State of Mind Jay-Z', mood: 'energy',
    caption: 'The city never sleeps — and neither did we.' },
  { name: 'Shibuya Crossing', city: 'Tokyo', country: 'Japan', lat: 35.6595, lng: 139.7004,
    query: 'Plastic Love Mariya Takeuchi', mood: 'nostalgic',
    caption: 'Neon, rain, and a song from another decade.' },
  { name: 'Gangnam', city: 'Seoul', country: 'South Korea', lat: 37.4979, lng: 127.0276,
    query: 'Gangnam Style Psy', mood: 'energy', caption: 'Iconic.' },
  { name: 'Hallgrímskirkja', city: 'Reykjavík', country: 'Iceland', lat: 64.1418, lng: -21.9266,
    query: 'Svefn-g-englar Sigur Rós', mood: 'melancholy',
    caption: 'Cold air, warm cathedral, impossibly tender music.' },
  { name: 'Copacabana Beach', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9711, lng: -43.1822,
    query: 'Girl from Ipanema Astrud Gilberto', mood: 'chill',
    caption: 'The tide in time with the bossa.' },
  { name: 'Old Havana', city: 'Havana', country: 'Cuba', lat: 23.1411, lng: -82.3589,
    query: 'Havana Camila Cabello', mood: 'romantic', caption: 'Salsa on every corner.' },
  { name: 'Brandenburg Gate', city: 'Berlin', country: 'Germany', lat: 52.5163, lng: 13.3777,
    query: 'Heroes David Bowie', mood: 'energy', caption: 'We can be heroes, just for one day.' },
  { name: 'Abbey Road', city: 'London', country: 'UK', lat: 51.5320, lng: -0.1779,
    query: 'Come Together Beatles', mood: 'nostalgic',
    caption: 'Crossed the stripes, pretended I was one of them.' },
  { name: 'Sagrada Família', city: 'Barcelona', country: 'Spain', lat: 41.4036, lng: 2.1744,
    query: 'Barcelona Freddie Mercury Montserrat', mood: 'romantic',
    caption: 'The spires and the aria — chills.' },
  { name: 'Venice Beach', city: 'Los Angeles', country: 'USA', lat: 33.9850, lng: -118.4695,
    query: 'Californication Red Hot Chili Peppers', mood: 'energy',
    caption: 'Skate, surf, repeat.' },
  { name: 'Broadway Nashville', city: 'Nashville', country: 'USA', lat: 36.1612, lng: -86.7775,
    query: 'Ring of Fire Johnny Cash', mood: 'nostalgic',
    caption: 'Honky-tonks all the way down the block.' },
  { name: 'Bob Marley Museum', city: 'Kingston', country: 'Jamaica', lat: 18.0156, lng: -76.7947,
    query: 'Three Little Birds Bob Marley', mood: 'chill',
    caption: 'Don\'t worry about a thing.' },
  { name: 'Temple Bar', city: 'Dublin', country: 'Ireland', lat: 53.3455, lng: -6.2644,
    query: 'Zombie Cranberries', mood: 'melancholy',
    caption: 'Raw voice that still hits 30 years on.' },
  { name: 'St Mark\'s Square', city: 'Venice', country: 'Italy', lat: 45.4342, lng: 12.3388,
    query: 'Con te partirò Andrea Bocelli', mood: 'romantic',
    caption: 'A gondola and an aria — cliché and I loved it.' },
  { name: 'Van Gogh Museum', city: 'Amsterdam', country: 'Netherlands', lat: 52.3584, lng: 4.8811,
    query: 'Amsterdam Coldplay', mood: 'melancholy',
    caption: 'The saddest painter, the quietest song.' },
  { name: 'Schönbrunn Palace', city: 'Vienna', country: 'Austria', lat: 48.1846, lng: 16.3120,
    query: 'Vienna Billy Joel', mood: 'nostalgic',
    caption: 'Vienna waits for you.' },
  { name: 'Sydney Opera House', city: 'Sydney', country: 'Australia', lat: -33.8568, lng: 151.2153,
    query: 'Down Under Men at Work', mood: 'energy',
    caption: 'Classic Aussie anthem by the harbour.' },
  { name: 'Gateway of India', city: 'Mumbai', country: 'India', lat: 18.9220, lng: 72.8347,
    query: 'Jai Ho A.R. Rahman', mood: 'energy', caption: 'Monsoon, horns, hope.' },
  { name: 'Grand Palace', city: 'Bangkok', country: 'Thailand', lat: 13.7500, lng: 100.4914,
    query: 'One Night in Bangkok Murray Head', mood: 'chill',
    caption: 'Absurd, brilliant, catchy forever.' },
  { name: 'Hagia Sophia', city: 'Istanbul', country: 'Turkey', lat: 41.0086, lng: 28.9802,
    query: 'Istanbul Not Constantinople They Might Be Giants', mood: 'energy',
    caption: 'Istanbul was Constantinople.' },
  { name: 'Red Square', city: 'Moscow', country: 'Russia', lat: 55.7539, lng: 37.6208,
    query: 'Moskau Dschinghis Khan', mood: 'energy', caption: 'Untranslatable but unforgettable.' },
  { name: 'Gamla Stan', city: 'Stockholm', country: 'Sweden', lat: 59.3253, lng: 18.0712,
    query: 'Waterloo ABBA', mood: 'energy', caption: 'Home of ABBA.' },
  { name: 'Praça do Comércio', city: 'Lisbon', country: 'Portugal', lat: 38.7075, lng: -9.1364,
    query: 'Transparente Mariza', mood: 'melancholy', caption: 'Fado at dusk by the Tagus.' },
  { name: 'Charles Bridge', city: 'Prague', country: 'Czechia', lat: 50.0865, lng: 14.4114,
    query: 'Moon River Audrey Hepburn', mood: 'romantic',
    caption: 'Statues, lanterns, and the softest melody.' },
  { name: 'Acropolis', city: 'Athens', country: 'Greece', lat: 37.9715, lng: 23.7267,
    query: 'Never on Sunday Melina Mercouri', mood: 'chill',
    caption: 'Wine, stars, and a song from 1960.' },
  { name: 'Pyramids of Giza', city: 'Cairo', country: 'Egypt', lat: 29.9792, lng: 31.1342,
    query: 'Walk Like an Egyptian Bangles', mood: 'energy', caption: 'Obviously.' },
  { name: 'Jemaa el-Fnaa', city: 'Marrakech', country: 'Morocco', lat: 31.6258, lng: -7.9891,
    query: 'Marrakesh Express Crosby Stills Nash', mood: 'chill',
    caption: 'Snake charmers and a hippie anthem.' },
  { name: 'Western Wall', city: 'Jerusalem', country: 'Israel', lat: 31.7767, lng: 35.2345,
    query: 'Jerusalem of Gold Ofra Haza', mood: 'nostalgic',
    caption: 'Haunting voice echoing off old stone.' },
  { name: 'The Bund', city: 'Shanghai', country: 'China', lat: 31.2395, lng: 121.4900,
    query: 'Ye Shanghai Zhou Xuan', mood: 'nostalgic', caption: 'Glowing skyline, 1940s ghost.' },
];

async function findTrack(query: string) {
  const res = await fetch(
    `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=10`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  const candidates: any[] = data.data || [];
  // Prefer tracks with preview
  const withPreview = candidates.filter((t) => t.preview);
  const chosen = withPreview[0] ?? candidates[0];
  if (!chosen) return null;
  return {
    spotify_track_id: `deezer-${chosen.id}`,
    title: chosen.title,
    artist: chosen.artist.name,
    album: chosen.album.title,
    album_art_url: chosen.album.cover_medium || chosen.album.cover,
    preview_url: chosen.preview ?? null,
    duration_ms: (chosen.duration ?? 0) * 1000,
  };
}

async function upsertPlace(seed: Seed) {
  const google_place_id = `seed-${seed.city}-${seed.name}`.toLowerCase().replace(/\s+/g, '-');

  const { data: existing } = await supabase
    .from('places').select('*').eq('google_place_id', google_place_id).maybeSingle();
  if (existing) return existing;

  const { data, error } = await supabase.from('places').insert({
    google_place_id,
    name: seed.name,
    lat: seed.lat,
    lng: seed.lng,
    city: seed.city,
    country: seed.country,
  }).select().single();
  if (error || !data) throw new Error(`place insert failed: ${error?.message}`);
  return data;
}

async function upsertTrack(t: {
  spotify_track_id: string; title: string; artist: string; album: string;
  album_art_url: string; preview_url: string | null; duration_ms: number;
}) {
  const { data: existing } = await supabase
    .from('tracks').select('*').eq('spotify_track_id', t.spotify_track_id).maybeSingle();
  if (existing) return existing;

  const { data, error } = await supabase.from('tracks').insert(t).select().single();
  if (error || !data) throw new Error(`track insert failed: ${error?.message}`);
  return data;
}

async function seed() {
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const s of SEEDS) {
    try {
      const track = await findTrack(s.query);
      if (!track) {
        console.log(`  - no track found for "${s.query}"`);
        fail++;
        continue;
      }

      const place = await upsertPlace(s);
      const dbTrack = await upsertTrack(track);

      // If a seed pin already exists for this place+track, skip.
      const { data: existingPin } = await supabase
        .from('pins').select('id')
        .eq('place_id', place.id).eq('track_id', dbTrack.id)
        .is('user_id', null).maybeSingle();
      if (existingPin) {
        console.log(`  ~ skip ${s.name}: pin already exists`);
        skip++;
        continue;
      }

      const { error: pinErr } = await supabase.from('pins').insert({
        place_id: place.id,
        track_id: dbTrack.id,
        user_id: null,
        caption: s.caption,
        mood: s.mood,
      });
      if (pinErr) {
        console.log(`  ! ${s.name} pin failed: ${pinErr.message}`);
        fail++;
        continue;
      }

      // Update pin_count
      const { count } = await supabase
        .from('pins').select('*', { count: 'exact', head: true }).eq('place_id', place.id);
      await supabase.from('places').update({ pin_count: count ?? 1 }).eq('id', place.id);

      console.log(`  ✓ ${s.name} (${s.city}) ← ${track.title} by ${track.artist}`);
      ok++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ! ${s.name} error: ${msg}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} inserted, ${skip} skipped, ${fail} failed.`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
