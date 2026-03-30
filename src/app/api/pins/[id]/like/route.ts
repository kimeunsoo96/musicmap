import { NextRequest, NextResponse } from 'next/server';
import { toggleMockLike } from '@/lib/mock-data';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = toggleMockLike(id);
  return NextResponse.json(result);
}
