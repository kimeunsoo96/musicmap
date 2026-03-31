import { NextRequest, NextResponse } from 'next/server';
import { createPin } from '@/lib/db';
import type { Track } from '@/types';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { placeId, track, caption } = body as {
    placeId: string;
    track: Track;
    caption: string;
  };

  if (!placeId || typeof placeId !== 'string') {
    return NextResponse.json({ error: 'Invalid placeId' }, { status: 400 });
  }
  if (!track || typeof track !== 'object' || !track.id) {
    return NextResponse.json({ error: 'Invalid track' }, { status: 400 });
  }

  if (caption && caption.length > 140) {
    return NextResponse.json(
      { error: 'Caption must be 140 characters or fewer' },
      { status: 400 },
    );
  }

  try {
    const pin = await createPin(placeId, track, caption ?? '');
    return NextResponse.json(pin, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create pin' }, { status: 500 });
  }
}
