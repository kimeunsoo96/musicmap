import { NextRequest, NextResponse } from 'next/server';
import { getPinsInRegion } from '@/lib/db';
import type { Mood } from '@/types';

const VALID_MOODS = ['chill', 'energy', 'melancholy', 'romantic', 'nostalgic'];

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const north = Number(p.get('north'));
  const south = Number(p.get('south'));
  const east = Number(p.get('east'));
  const west = Number(p.get('west'));
  const moodParam = p.get('mood');
  const mood: Mood | null = moodParam && VALID_MOODS.includes(moodParam) ? (moodParam as Mood) : null;

  if ([north, south, east, west].some((n) => !Number.isFinite(n))) {
    return NextResponse.json({ error: 'Invalid bounds' }, { status: 400 });
  }

  const pins = await getPinsInRegion({ north, south, east, west }, mood);
  return NextResponse.json({ pins }, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
  });
}
