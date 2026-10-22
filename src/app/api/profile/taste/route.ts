import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/authOptions';
import { getUserTaste, saveUserTaste, saveUserArtists, getUserArtists } from '../../../../lib/database';
import { fetchTopArtists, fetchTopTracks } from '../../../../lib/spotify';
import { calculateMusicalDna } from '../../../../lib/dna/musicalDna';
import { mockTopArtists, mockVibeProfile } from '../../../../lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  // Check persisted taste in database
  let taste = await getUserTaste(userId);

  // If user is authenticated with Spotify and has accessToken, refresh taste from Spotify
  const accessToken = (session as any)?.accessToken;
  if (accessToken && accessToken !== 'demo_access_token') {
    try {
      const [artists, tracks] = await Promise.all([
        fetchTopArtists(accessToken as string, 'medium_term'),
        fetchTopTracks(accessToken as string, 'medium_term')
      ]);

      if (artists && artists.length > 0) {
        taste = calculateMusicalDna(artists, tracks);
        await Promise.all([
          saveUserTaste(userId, taste),
          saveUserArtists(userId, artists)
        ]);
      }
    } catch (e) {
      console.warn('Error fetching live Spotify taste, using cached/demo:', e);
    }
  }

  // Fallback to default demo taste if empty
  if (!taste) {
    taste = calculateMusicalDna(mockTopArtists as any, []);
  }

  return NextResponse.json({ taste });
}
