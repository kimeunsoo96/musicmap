import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PLACES } from '@/lib/mock-data';
import type { Place } from '@/types';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, lat, lng, city, country, google_place_id } = body as {
    name: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
    google_place_id: string;
  };

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }
  if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    return NextResponse.json({ error: 'Invalid lat' }, { status: 400 });
  }
  if (typeof lng !== 'number' || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid lng' }, { status: 400 });
  }

  const existing = MOCK_PLACES.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );

  if (existing) {
    return NextResponse.json(existing);
  }

  const newPlace: Place = {
    id: `place-${Date.now()}`,
    google_place_id: google_place_id ?? '',
    name,
    lat,
    lng,
    city: city ?? '',
    country: country ?? '',
    cover_image: null,
    pin_count: 0,
    created_at: new Date().toISOString(),
  };

  MOCK_PLACES.push(newPlace);

  return NextResponse.json(newPlace);
}
