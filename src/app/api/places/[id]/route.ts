import { NextRequest, NextResponse } from 'next/server';
import { getMockPlaceDetail } from '@/lib/mock-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const place = getMockPlaceDetail(id);

  if (!place) {
    return NextResponse.json({ error: 'Place not found' }, { status: 404 });
  }

  return NextResponse.json(place);
}
