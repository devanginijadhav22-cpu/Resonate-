import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth/authOptions';
import { Navbar } from '../../components/Navbar';
import { ResonateAssistant } from '../../components/ai/ResonateAssistant';
import {
  getUser,
  getUserTaste,
  getUserArtists,
  getUserTracks,
  saveUserTaste,
  saveUserArtists,
  saveUserTracks
} from '../../lib/database';
import { fetchTopArtists, fetchTopTracks } from '../../lib/spotify';
import { calculateMusicalDna } from '../../lib/dna/musicalDna';
import { mockTopArtists, mockVibeProfile } from '../../lib/mockData';
import { PersonalAnalyticsView } from './PersonalAnalyticsView';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  const [userRecord, cachedTaste, cachedArtists, cachedTracks] = await Promise.all([
    getUser(userId),
    getUserTaste(userId),
    getUserArtists(userId),
    getUserTracks(userId)
  ]);

  let topArtists = (cachedArtists && cachedArtists.length > 0) ? cachedArtists : mockTopArtists;
  let topTracks = cachedTracks || [];
  let vibeProfile = cachedTaste || mockVibeProfile;

  const accessToken = (session as any)?.accessToken;
  const isRealSpotifyToken = accessToken && accessToken !== 'demo_access_token';

  if (isRealSpotifyToken) {
    try {
      const [realArtists, realTracks] = await Promise.all([
        fetchTopArtists(accessToken as string, 'medium_term'),
        fetchTopTracks(accessToken as string, 'medium_term')
      ]);

      if (realArtists && realArtists.length > 0) {
        topArtists = realArtists;
        topTracks = realTracks || [];
        vibeProfile = calculateMusicalDna(realArtists, realTracks || []);
        await Promise.all([
          saveUserTaste(userId, vibeProfile),
          saveUserArtists(userId, topArtists),
          saveUserTracks(userId, topTracks)
        ]);
      } else if (realTracks && realTracks.length > 0) {
        topTracks = realTracks;
        const derivedArtists = realTracks.flatMap(t => t.artists || []).filter(Boolean);
        if (derivedArtists.length > 0) {
          topArtists = derivedArtists as any;
          vibeProfile = calculateMusicalDna(topArtists, realTracks);
          await Promise.all([
            saveUserTaste(userId, vibeProfile),
            saveUserArtists(userId, topArtists),
            saveUserTracks(userId, topTracks)
          ]);
        }
      }
    } catch (e) {
      console.warn('Live Spotify taste fetch in /analytics failed, using cached taste:', e);
    }
  }

  const displayName = session?.user?.name || userRecord?.name || 'Alex Rivera (Demo)';
  const displayEmail = session?.user?.email || userRecord?.email || 'alex.demo@resonate.app';
  const displayImage = session?.user?.image || userRecord?.image;
  const city = userRecord?.city || 'Mumbai';

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar initialCity={city} isDemo={!session} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <PersonalAnalyticsView
          user={userRecord}
          vibeProfile={vibeProfile}
          topArtists={topArtists}
          topTracks={topTracks}
          userName={displayName}
          userEmail={displayEmail}
          userImage={displayImage}
          city={city}
        />
      </div>

      <ResonateAssistant />
    </main>
  );
}
