import { NextRequest, NextResponse } from 'next/server';
import { addMockPin } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { placeId, trackId, caption } = body as {
    placeId: string;
    trackId: string;
    caption: string;
  };

  if (!placeId || typeof placeId !== 'string') {
    return NextResponse.json({ error: 'Invalid placeId' }, { status: 400 });
  }
  if (!trackId || typeof trackId !== 'string') {
    return NextResponse.json({ error: 'Invalid trackId' }, { status: 400 });
  }

  if (caption && caption.length > 140) {
    return NextResponse.json(
      { error: 'Caption must be 140 characters or fewer' },
      { status: 400 },
    );
  }

  const pin = addMockPin(placeId, trackId, 'user-1', caption ?? '');
  return NextResponse.json(pin, { status: 201 });
}
