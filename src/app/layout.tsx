import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { MapProvider } from '@/contexts/map-context';

export const metadata: Metadata = {
  title: 'MusicMap — Pin your music to the world',
  description: 'A map where travelers pin places and share the songs that define their moments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <MapProvider>
            {children}
          </MapProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
