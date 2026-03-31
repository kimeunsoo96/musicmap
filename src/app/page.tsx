'use client';

import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import MapDynamic from '@/components/MapDynamic';
import PlacePanel from '@/components/PlacePanel';

export default function HomePage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header hasSearch>
        <SearchBar />
      </Header>
      <main className="flex-1 relative">
        <MapDynamic />
        <PlacePanel />
      </main>
    </div>
  );
}
