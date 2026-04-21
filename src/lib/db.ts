import { supabase, isMockMode } from './supabase';
import {
  getMockPlaces, getMockPlaceDetail, searchMockTracks,
  getMockUserPins, getMockSavedPlaces, addMockPin,
  toggleMockLike, toggleMockSave, isMockLiked, isMockSaved,
  MOCK_USERS,
} from './mock-data';
import type { Place, Track, Pin, PlaceDetail, MapBounds, Mood } from '@/types';

export async function getPlaces(bounds?: MapBounds): Promise<Place[]> {
  if (isMockMode || !supabase) return getMockPlaces(bounds);

  let query = supabase
    .from('places')
    .select('*')
    .gt('pin_count', 0)
    .order('pin_count', { ascending: false });

  if (bounds) {
    query = query
      .gte('lat', bounds.south).lte('lat', bounds.north)
      .gte('lng', bounds.west).lte('lng', bounds.east);
  }

  const { data, error } = await query;
  if (error || !data) return getMockPlaces(bounds);
  return data as Place[];
}

export async function getPlaceDetail(placeId: string): Promise<PlaceDetail | null> {
  if (isMockMode || !supabase) return getMockPlaceDetail(placeId);

  const { data: place } = await supabase.from('places').select('*').eq('id', placeId).single();
  if (!place) return null;

  const { data: pins } = await supabase
    .from('pins')
    .select('*, track:tracks(*)')
    .eq('place_id', placeId)
    .order('likes_count', { ascending: false });

  return { ...place, pins: pins || [] } as PlaceDetail;
}

export async function createOrGetPlace(placeData: {
  name: string; lat: number; lng: number; city: string; country: string; google_place_id: string;
}): Promise<Place> {
  if (isMockMode || !supabase) {
    return { id: `place-${Date.now()}`, ...placeData, cover_image: null, pin_count: 0, created_at: new Date().toISOString() };
  }

  const { data: existing } = await supabase
    .from('places').select('*').eq('google_place_id', placeData.google_place_id).single();
  if (existing) return existing as Place;

  const { data, error } = await supabase
    .from('places').insert(placeData).select().single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create place');
  return data as Place;
}

export async function createPin(
  placeId: string,
  trackData: Track,
  caption: string,
  mood: Mood | null = null,
  userId: string | null = null,
): Promise<Pin> {
  if (isMockMode || !supabase) {
    return addMockPin(placeId, trackData.id, userId ?? 'user-1', caption, mood);
  }

  const { data: existingTrack } = await supabase
    .from('tracks').select('*').eq('spotify_track_id', trackData.spotify_track_id).single();

  let track = existingTrack;
  if (!track) {
    const { data: newTrack } = await supabase
      .from('tracks').insert({
        spotify_track_id: trackData.spotify_track_id,
        title: trackData.title,
        artist: trackData.artist,
        album: trackData.album,
        album_art_url: trackData.album_art_url,
        preview_url: trackData.preview_url,
        duration_ms: trackData.duration_ms,
      }).select().single();
    track = newTrack;
  }

  if (!track) throw new Error('Failed to create track');

  const { data: pin, error } = await supabase
    .from('pins').insert({
      place_id: placeId,
      track_id: track.id,
      user_id: userId,
      caption,
      mood,
    }).select('*, track:tracks(*)').single();

  if (error || !pin) throw new Error(error?.message ?? 'Failed to create pin');

  // Update pin_count manually (no trigger in DB yet)
  const { count } = await supabase
    .from('pins').select('*', { count: 'exact', head: true }).eq('place_id', placeId);
  await supabase.from('places').update({ pin_count: count ?? 1 }).eq('id', placeId);

  return pin as Pin;
}

export async function toggleLike(pinId: string): Promise<{ liked: boolean; likes_count: number }> {
  if (isMockMode || !supabase) return toggleMockLike(pinId);

  const { data: existing } = await supabase
    .from('pin_likes').select('id').eq('pin_id', pinId).is('user_id', null).single();

  if (existing) {
    await supabase.from('pin_likes').delete().eq('id', existing.id);
    const { data: pin } = await supabase.from('pins').select('likes_count').eq('id', pinId).single();
    return { liked: false, likes_count: pin?.likes_count ?? 0 };
  } else {
    await supabase.from('pin_likes').insert({ pin_id: pinId });
    const { data: pin } = await supabase.from('pins').select('likes_count').eq('id', pinId).single();
    return { liked: true, likes_count: pin?.likes_count ?? 0 };
  }
}

export async function toggleSave(placeId: string): Promise<{ saved: boolean }> {
  if (isMockMode || !supabase) return toggleMockSave(placeId);

  const { data: existing } = await supabase
    .from('saved_places').select('id').eq('place_id', placeId).is('user_id', null).single();

  if (existing) {
    await supabase.from('saved_places').delete().eq('id', existing.id);
    return { saved: false };
  } else {
    await supabase.from('saved_places').insert({ place_id: placeId });
    return { saved: true };
  }
}

export async function isLiked(pinId: string): Promise<boolean> {
  if (isMockMode || !supabase) return isMockLiked(pinId);
  const { data } = await supabase.from('pin_likes').select('id').eq('pin_id', pinId).is('user_id', null).single();
  return !!data;
}

export async function isSaved(placeId: string): Promise<boolean> {
  if (isMockMode || !supabase) return isMockSaved(placeId);
  const { data } = await supabase.from('saved_places').select('id').eq('place_id', placeId).is('user_id', null).single();
  return !!data;
}

export async function deletePin(pinId: string, userId: string): Promise<void> {
  if (isMockMode || !supabase) {
    return;
  }
  // Check ownership first
  const { data: pin, error: selectError } = await supabase
    .from('pins').select('id, user_id, place_id').eq('id', pinId).maybeSingle();
  if (selectError) throw new Error(`Select failed: ${selectError.message}`);
  if (!pin) throw new Error(`Pin not found (id=${pinId})`);
  if (pin.user_id !== userId) {
    throw new Error(`Not authorized: pin owner=${pin.user_id} vs requester=${userId}`);
  }

  const { error: deleteError } = await supabase.from('pins').delete().eq('id', pinId);
  if (deleteError) throw new Error(`Delete failed: ${deleteError.message}`);

  // Decrement pin_count manually
  const { count } = await supabase
    .from('pins').select('*', { count: 'exact', head: true }).eq('place_id', pin.place_id);
  await supabase.from('places').update({ pin_count: count ?? 0 }).eq('id', pin.place_id);
}

export async function getUserPins(userId: string): Promise<Pin[]> {
  if (isMockMode || !supabase) {
    const { getMockUserPins } = await import('./mock-data');
    return getMockUserPins(userId);
  }
  const { data } = await supabase
    .from('pins')
    .select('*, track:tracks(*), place:places(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data as Pin[]) || [];
}

export async function getPlacesByMood(mood: Mood, bounds?: MapBounds): Promise<Place[]> {
  if (isMockMode || !supabase) {
    const { getMockPlacesByMood } = await import('./mock-data');
    return getMockPlacesByMood(mood, bounds);
  }

  // Find pins with this mood, collect unique place ids
  const { data: pins } = await supabase
    .from('pins')
    .select('place_id')
    .eq('mood', mood);

  if (!pins || pins.length === 0) return [];

  const placeIds = Array.from(new Set(pins.map((p) => p.place_id)));
  let query = supabase.from('places').select('*').in('id', placeIds);
  if (bounds) {
    query = query
      .gte('lat', bounds.south).lte('lat', bounds.north)
      .gte('lng', bounds.west).lte('lng', bounds.east);
  }
  const { data: places } = await query;
  return (places as Place[]) || [];
}

export async function getPinsInRegion(
  bounds: MapBounds,
  mood: Mood | null = null,
): Promise<(Pin & { place: Place })[]> {
  if (isMockMode || !supabase) {
    const { getMockPinsInRegion } = await import('./mock-data');
    return getMockPinsInRegion(bounds, mood);
  }

  const { data: places } = await supabase
    .from('places')
    .select('id')
    .gte('lat', bounds.south).lte('lat', bounds.north)
    .gte('lng', bounds.west).lte('lng', bounds.east);

  if (!places || places.length === 0) return [];

  let query = supabase
    .from('pins')
    .select('*, track:tracks(*), place:places(*)')
    .in('place_id', places.map((p) => p.id))
    .order('likes_count', { ascending: false })
    .limit(100);
  if (mood) query = query.eq('mood', mood);

  const { data: pins } = await query;
  return (pins as (Pin & { place: Place })[]) || [];
}

export interface TrackWithPlaces {
  track: Track;
  pins: (Pin & { place: Place })[];
}

export async function getTrackPlaces(trackId: string): Promise<TrackWithPlaces | null> {
  if (isMockMode || !supabase) {
    const { getMockTrackPlaces } = await import('./mock-data');
    return getMockTrackPlaces(trackId);
  }

  const { data: track } = await supabase.from('tracks').select('*').eq('id', trackId).single();
  if (!track) return null;

  const { data: pins } = await supabase
    .from('pins')
    .select('*, place:places(*), track:tracks(*)')
    .eq('track_id', trackId)
    .order('likes_count', { ascending: false });

  return { track: track as Track, pins: (pins as (Pin & { place: Place })[]) || [] };
}

// Re-export mock helpers for profile route (no auth yet)
export { getMockUserPins, getMockSavedPlaces, MOCK_USERS, searchMockTracks };
