import { NextRequest, NextResponse } from 'next/server';
import { getUserPins } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pins = await getUserPins(id);
  return NextResponse.json({ pins }, { headers: { 'Cache-Control': 'no-store' } });
}
