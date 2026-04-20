'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import MapDynamic from '@/components/MapDynamic';
import PlacePanel from '@/components/PlacePanel';
import PlayTripButton from '@/components/PlayTripButton';
import VibeFilterBar from '@/components/VibeFilterBar';

const WelcomeOverlay = dynamic(() => import('@/components/WelcomeOverlay'), { ssr: false });

export default function HomePage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header hasSearch>
        <SearchBar />
      </Header>
      <main className="flex-1 relative">
        <MapDynamic />
        <VibeFilterBar />
        <PlacePanel />
        <PlayTripButton />
      </main>
      <WelcomeOverlay />
    </div>
  );
}
