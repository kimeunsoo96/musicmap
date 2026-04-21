import { NextRequest, NextResponse } from 'next/server';
import { getUserPins } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pins = await getUserPins(id);
  console.log(`[api/users/${id}/pins] returning ${pins.length} pins:`, pins.map((p) => p.id));
  return NextResponse.json(
    { pins, _debug: { userId: id, count: pins.length, ts: Date.now() } },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } },
  );
}
