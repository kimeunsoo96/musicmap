import { NextRequest, NextResponse } from 'next/server';
import { toggleLike } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { userId?: string } = {};
  try {
    body = await request.json();
  } catch {
    // ignore empty bodies
  }
  const userId = body.userId ?? null;

  try {
    const result = await toggleLike(id, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to toggle like';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
