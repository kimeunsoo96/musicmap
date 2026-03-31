import { NextRequest, NextResponse } from 'next/server';
import { getPlaces } from '@/lib/db';
import type { MapBounds } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const northParam = searchParams.get('north');
  const southParam = searchParams.get('south');
  const eastParam = searchParams.get('east');
  const westParam = searchParams.get('west');

  if (northParam && southParam && eastParam && westParam) {
    const north = parseFloat(northParam);
    const south = parseFloat(southParam);
    const east = parseFloat(eastParam);
    const west = parseFloat(westParam);

    if ([north, south, east, west].some((v) => !Number.isFinite(v))) {
      return NextResponse.json({ error: 'Invalid bounds' }, { status: 400 });
    }

    const bounds: MapBounds = { north, south, east, west };
    const places = await getPlaces(bounds);
    return NextResponse.json(places);
  }

  const places = await getPlaces();
  return NextResponse.json(places);
}
