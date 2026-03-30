import { NextRequest, NextResponse } from 'next/server';
import { getMockUserPins, getMockSavedPlaces, MOCK_USERS } from '@/lib/mock-data';

export async function GET(_request: NextRequest) {
  const userId = 'user-1';
  const user = MOCK_USERS.find((u) => u.id === userId) ?? null;
  const pins = getMockUserPins(userId);
  const savedPlaces = getMockSavedPlaces(userId);

  return NextResponse.json({ user, pins, savedPlaces });
}
