import { NextRequest, NextResponse } from 'next/server';
import { getPlaces, getPlacesByMood } from '@/lib/db';
import type { MapBounds, Mood } from '@/types';

const VALID_MOODS = ['chill', 'energy', 'melancholy', 'romantic', 'nostalgic'];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const moodParam = searchParams.get('mood');
  const mood: Mood | null = moodParam && VALID_MOODS.includes(moodParam) ? (moodParam as Mood) : null;

  const northParam = searchParams.get('north');
  const southParam = searchParams.get('south');
  const eastParam = searchParams.get('east');
  const westParam = searchParams.get('west');

  let bounds: MapBounds | undefined;
  if (northParam && southParam && eastParam && westParam) {
    const north = parseFloat(northParam);
    const south = parseFloat(southParam);
    const east = parseFloat(eastParam);
    const west = parseFloat(westParam);

    if ([north, south, east, west].some((v) => !Number.isFinite(v))) {
      return NextResponse.json({ error: 'Invalid bounds' }, { status: 400 });
    }
    bounds = { north, south, east, west };
  }

  const places = mood ? await getPlacesByMood(mood, bounds) : await getPlaces(bounds);
  return NextResponse.json(places, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
