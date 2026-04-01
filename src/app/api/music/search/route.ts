import { NextRequest, NextResponse } from 'next/server';
import type { Track } from '@/types';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ tracks: [] });
  }

  try {
    const res = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=10`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({ tracks: [] });
    }

    const data = await res.json();

    const tracks: Track[] = (data.data || []).map((item: any) => ({
      id: `deezer-${item.id}`,
      spotify_track_id: `deezer-${item.id}`,
      title: item.title,
      artist: item.artist.name,
      album: item.album.title,
      album_art_url: item.album.cover_medium || item.album.cover,
      preview_url: item.preview || null,
      duration_ms: item.duration * 1000,
      created_at: new Date().toISOString(),
    }));

    return NextResponse.json({ tracks }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json({ tracks: [] });
  }
}
