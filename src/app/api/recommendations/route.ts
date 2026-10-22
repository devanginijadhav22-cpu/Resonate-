import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/authOptions';
import { getUser, getUserTaste, getUserInteractions, getUserArtists } from '../../../lib/database';
import { fetchLiveEvents } from '../../../lib/events';
import { rankEvents } from '../../../lib/recommendation/recommendationEngine';
import { generateWeekendPlan } from '../../../lib/recommendation/weekendPlanner';
import { mockTopArtists } from '../../../lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  const [user, taste, interactions, userArtists] = await Promise.all([
    getUser(userId),
    getUserTaste(userId),
    getUserInteractions(userId),
    getUserArtists(userId)
  ]);

  const targetCity = city || user?.city || 'Mumbai';
  const rawEvents = await fetchLiveEvents(targetCity);

  const fallbackTaste = taste || {
    persona: 'Late-Night Indie Explorer',
    energy: 82,
    danceability: 74,
    valence: 58,
    acousticness: 24,
    intensity: 78,
    mainstream: 45,
    discovery: 85,
    indie: 90,
    electronic: 80,
    liveMusicAffinity: 92,
    topGenres: [
      { genre: 'Indie Rock', count: 48, score: 95 },
      { genre: 'Electronic', count: 40, score: 88 },
      { genre: 'Neo-Psychedelia', count: 32, score: 76 }
    ]
  };

  const artistsToUse = (userArtists && userArtists.length > 0) ? userArtists : mockTopArtists;
  const ranked = rankEvents(rawEvents, fallbackTaste, artistsToUse as any, user || undefined, interactions);
  const weekendPlan = generateWeekendPlan(ranked, fallbackTaste);

  return NextResponse.json({
    recommendations: ranked,
    weekendPlan,
    vibeProfile: fallbackTaste,
    user
  });
}
