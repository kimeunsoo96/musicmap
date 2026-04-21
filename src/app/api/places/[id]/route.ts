import { NextRequest, NextResponse } from 'next/server';
import { getPlaceDetail } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const place = await getPlaceDetail(id);

  if (!place) {
    return NextResponse.json({ error: 'Place not found' }, { status: 404 });
  }

  return NextResponse.json(place, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
