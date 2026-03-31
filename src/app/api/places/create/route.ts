import { NextRequest, NextResponse } from 'next/server';
import { createOrGetPlace } from '@/lib/db';

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

  try {
    const place = await createOrGetPlace({
      name: name.trim(),
      lat,
      lng,
      city: city ?? '',
      country: country ?? '',
      google_place_id: google_place_id ?? '',
    });
    return NextResponse.json(place);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create place' }, { status: 500 });
  }
}
