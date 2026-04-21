import { NextRequest, NextResponse } from 'next/server';
import { createPin } from '@/lib/db';
import type { Track, Mood } from '@/types';

const VALID_MOODS = ['chill', 'energy', 'melancholy', 'romantic', 'nostalgic'];

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { placeId, track, caption, mood, userId } = body as {
    placeId: string;
    track: Track;
    caption: string;
    mood?: Mood | null;
    userId?: string | null;
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
  const safeMood: Mood | null = mood && VALID_MOODS.includes(mood) ? mood : null;

  try {
    const pin = await createPin(placeId, track, caption ?? '', safeMood, userId ?? null);
    return NextResponse.json(pin, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create pin';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
