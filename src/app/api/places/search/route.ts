import { NextRequest, NextResponse } from 'next/server';
import type { Place } from '@/types';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ places: [] });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1&accept-language=en`,
      {
        headers: { 'User-Agent': 'MusicMap/0.1 (development)' },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ places: [] });
    }

    const data = await res.json();

    const places: Place[] = data.map((item: any) => {
      const addr = item.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || item.name || '';
      const country = addr.country || '';

      return {
        id: `nominatim-${item.place_id}`,
        google_place_id: `osm-${item.osm_id}`,
        name: item.display_name.split(',')[0].trim(),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        city,
        country,
        cover_image: null,
        pin_count: 0,
        created_at: new Date().toISOString(),
      };
    });

    return NextResponse.json({ places }, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
    });
  } catch {
    return NextResponse.json({ places: [] });
  }
}
