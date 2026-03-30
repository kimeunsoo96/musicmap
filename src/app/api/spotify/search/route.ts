import { NextRequest, NextResponse } from 'next/server';
import { searchMockTracks } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ tracks: [] });
  }

  const tracks = searchMockTracks(q);
  return NextResponse.json({ tracks });
}
