import { NextRequest, NextResponse } from 'next/server';
import { toggleMockSave } from '@/lib/mock-data';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = toggleMockSave(id);
  return NextResponse.json(result);
}
