import { NextRequest, NextResponse } from 'next/server';
import { getTrackPlaces } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await getTrackPlaces(id);

  if (!data) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
