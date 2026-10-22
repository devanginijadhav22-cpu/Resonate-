import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth/authOptions';
import { Navbar } from '../../components/Navbar';
import { ResonateAssistant } from '../../components/ai/ResonateAssistant';
import { MusicPersonaCard } from '../../components/MusicPersonaCard';
import { GenreRadarChart } from '../../components/GenreRadarChart';
import { getUser, getUserTaste, getUserInteractions, getUserArtists } from '../../lib/database';
import { mockTopArtists } from '../../lib/mockData';
import {
  User,
  SlidersHorizontal,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Music2,
  Bookmark,
  DollarSign
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  const [user, taste, interactions, userArtists] = await Promise.all([
    getUser(userId),
    getUserTaste(userId),
    getUserInteractions(userId),
    getUserArtists(userId)
  ]);

  const fallbackTaste = taste || {
    persona: 'Late-Night Indie Explorer',
    personaDescription: 'Drawn to psychedelic riffs, high-tempo electronica, and intimate late-night acoustic sets.',
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
      { genre: 'Electronic / Synth', count: 40, score: 88 },
      { genre: 'Neo-Psychedelia', count: 32, score: 76 },
      { genre: 'Alternative Pop', count: 24, score: 65 },
      { genre: 'Standup Comedy', count: 14, score: 45 }
    ]
  };

  const displayName = session?.user?.name || user?.name || 'Alex Rivera (Demo)';
  const displayEmail = session?.user?.email || user?.email || 'alex.demo@resonate.app';
  const displayImage = session?.user?.image || user?.image;

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar isDemo={!session} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-10">
        {/* User Profile Header Card */}
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-900/80 to-neutral-950 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl">
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-emerald-400" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white">{displayName}</h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Spotify Linked
              </span>
            </div>
            <p className="text-xs text-neutral-400">{displayEmail}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Default City: <strong className="text-white">{user?.city || 'Mumbai'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                Radius: <strong className="text-white">{user?.maxDistanceKm || 15} km</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                Budget: <strong className="text-white">₹{(user?.budget || 2500).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Musical DNA & Persona Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Your Musical DNA & Vibe</h2>
            <p className="text-xs text-neutral-400">
              Derived from your Spotify listening rotation and audio attribute vectors
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <MusicPersonaCard vibeProfile={fallbackTaste} />
            </div>

            <div className="lg:col-span-2">
              <GenreRadarChart vibeProfile={fallbackTaste} />
            </div>
          </div>
        </section>

        {/* Listening Stats & Top Artists */}
        <section className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Music2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Your Live Concert Influencers</h3>
              <p className="text-xs text-neutral-400">The artists guiding your personalized gig matching</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {((userArtists && userArtists.length > 0) ? userArtists : mockTopArtists).slice(0, 6).map((artist, idx) => (
              <div
                key={artist.id}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-800/40 border border-white/5 hover:border-white/20 transition-all"
              >
                <span className="text-xs font-black text-neutral-500 w-4">#{idx + 1}</span>
                {artist.images?.[0]?.url && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-11 h-11 rounded-full object-cover shadow-md"
                  />
                )}
                <div className="truncate">
                  <h4 className="font-bold text-xs text-white truncate">{artist.name}</h4>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {artist.genres?.slice(0, 2).join(', ') || 'Alternative'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ResonateAssistant />
    </main>
  );
}
