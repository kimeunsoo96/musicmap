import { NextRequest, NextResponse } from 'next/server';
import { toggleSave } from '@/lib/db';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await toggleSave(id);
  return NextResponse.json(result);
}
