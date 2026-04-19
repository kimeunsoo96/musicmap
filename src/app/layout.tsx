import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { MapProvider } from '@/contexts/map-context';
import { AudioPlayerProvider } from '@/contexts/audio-player-context';
import PlayerBar from '@/components/PlayerBar';

export const metadata: Metadata = {
  title: 'MusicMap — Pin your music to the world',
  description: 'Discover the soundtrack of every destination. A map where travelers pin places and share the songs that define their moments.',
  keywords: ['music', 'travel', 'map', 'playlist', 'destination', 'songs', 'discover'],
  authors: [{ name: 'MusicMap' }],
  openGraph: {
    title: 'MusicMap — Pin your music to the world',
    description: 'Discover the soundtrack of every destination, curated by travelers worldwide.',
    type: 'website',
    locale: 'en_US',
    siteName: 'MusicMap',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MusicMap — Pin your music to the world',
    description: 'Discover the soundtrack of every destination, curated by travelers worldwide.',
  },
  icons: {
    icon: '/favicon.svg',
  },
  other: {
    'theme-color': '#1DB954',
  },
};

export const viewport: Viewport = {
  themeColor: '#1DB954',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <MapProvider>
            <AudioPlayerProvider>
              {children}
              <PlayerBar />
            </AudioPlayerProvider>
          </MapProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
