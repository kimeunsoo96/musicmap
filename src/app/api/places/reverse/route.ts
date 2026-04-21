import { NextRequest, NextResponse } from 'next/server';
import type { Place } from '@/types';

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat/lng required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en&zoom=14`,
      {
        headers: { 'User-Agent': 'MusicMap/0.1 (development)' },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'reverse failed' }, { status: 502 });
    }

    const item = await res.json();
    if (item.error) {
      return NextResponse.json({ error: item.error }, { status: 404 });
    }
    const addr = item.address || {};
    const city =
      addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || addr.county || '';
    const country = addr.country || '';
    const displayFirst = item.display_name ? item.display_name.split(',')[0].trim() : '';
    const name =
      addr.attraction ||
      addr.tourism ||
      addr.leisure ||
      addr.amenity ||
      addr.building ||
      addr.road ||
      addr.pedestrian ||
      addr.neighbourhood ||
      addr.suburb ||
      displayFirst ||
      city ||
      country ||
      `${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)}`;

    const place: Place = {
      id: `nominatim-${item.place_id}`,
      google_place_id: `osm-${item.osm_id ?? `${lat}-${lng}`}`,
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city,
      country,
      cover_image: null,
      pin_count: 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(place);
  } catch {
    return NextResponse.json({ error: 'reverse failed' }, { status: 502 });
  }
}
