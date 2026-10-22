import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth/authOptions';
import { fetchTopArtists, fetchTopTracks } from '../lib/spotify';
import { fetchLiveEvents } from '../lib/events';
import { calculateMusicalDna } from '../lib/dna/musicalDna';
import { rankEvents } from '../lib/recommendation/recommendationEngine';
import { getUser, getUserTaste, saveUserTaste, getUserInteractions, saveUserArtists, getUserArtists, saveUserTracks } from '../lib/database';
import { Navbar } from '../components/Navbar';
import { GenreRadarChart } from '../components/GenreRadarChart';
import { MusicPersonaCard } from '../components/MusicPersonaCard';
import { DashboardTabs } from '../components/DashboardTabs';
import ClientLoginButton from '../components/ClientLoginButton';
import { ResonateAssistant } from '../components/ai/ResonateAssistant';
import { mockTopArtists, mockVibeProfile, mockEvents } from '../lib/mockData';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Music,
  MapPin,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Radio,
  Sliders,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ city?: string; demo?: string }>
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const isDemo = params.demo === 'true';

  // If user is not logged in and not in demo mode, show elevated landing page
  if (!session && !isDemo) {
    return (
      <main className="min-h-screen bg-neutral-950 text-foreground relative overflow-hidden selection:bg-emerald-500 selection:text-black">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] -z-10 animate-pulse pointer-events-none" />

        {/* Minimal Landing Navbar */}
        <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Music className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Resonate</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/?demo=true"
              className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              Demo Preview
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-24 text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Live Concert & Nightlife Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Your music taste knows <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400">
              what you&apos;ll love next.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Resonate turns your Spotify listening rotation into real-world experiences. Analyze your Musical DNA, unlock your Vibe Persona, and match with live concerts, club nights, and stand-up shows in your city.
          </p>

          <div className="pt-2 flex justify-center">
            <ClientLoginButton />
          </div>

          {/* Product Differentiation Formula */}
          <div className="pt-12">
            <div className="p-4 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-neutral-300 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto font-mono">
              <span className="text-emerald-400 font-bold">Spotify Taste</span>
              <span className="text-neutral-500">+</span>
              <span className="text-purple-400 font-bold">Preferences</span>
              <span className="text-neutral-500">+</span>
              <span className="text-blue-400 font-bold">Location</span>
              <span className="text-neutral-500">+</span>
              <span className="text-amber-400 font-bold">Event Intelligence</span>
              <span className="text-neutral-500">=</span>
              <span className="text-white font-extrabold bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                Personalized Live Experiences
              </span>
            </div>
          </div>

          {/* Interactive Recommendation Preview Card */}
          <div className="pt-10 max-w-xl mx-auto text-left">
            <div className="bg-neutral-900/80 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-black text-black bg-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-black" /> 98% Match
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2.5 py-0.5 rounded-md">
                  Concert
                </span>
              </div>

              <h3 className="font-bold text-lg text-white mb-1">Tame Impala: Slow Rush World Tour</h3>
              <p className="text-xs text-neutral-400 mb-3">Jio World Garden, Mumbai • This Saturday, 8:00 PM</p>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 space-y-1">
                <p className="font-bold">Why you&apos;ll love this:</p>
                <p className="text-[11px] text-neutral-300">✓ Matches your #1 artist: Tame Impala</p>
                <p className="text-[11px] text-neutral-300">✓ High Psychedelic & Indie Rock affinity (95%)</p>
                <p className="text-[11px] text-neutral-300">✓ Only 2.4 km from your preferred radius</p>
              </div>
            </div>
          </div>

          {/* 4-Step Architecture Journey */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[
              {
                step: '01',
                title: 'Musical DNA',
                desc: 'Deep multi-vector analysis across energy, danceability, acousticness, and obscure indie discovery.'
              },
              {
                step: '02',
                title: 'Vibe Persona',
                desc: 'Dynamically generated persona label capturing your unique music identity.'
              },
              {
                step: '03',
                title: 'Smart Matching',
                desc: 'Multi-factor ranking factoring distance, category affinity, timing, and ticket budget.'
              },
              {
                step: '04',
                title: 'Live Experiences',
                desc: 'Transparent recommendations explaining exactly why each event was picked for you.'
              }
            ].map(item => (
              <div
                key={item.step}
                className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 space-y-2 hover:border-emerald-500/30 transition-colors"
              >
                <span className="text-xs font-mono font-black text-emerald-400 block">{item.step}</span>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // User is logged in OR testing demo mode
  const userId = session?.user?.email || session?.user?.name || 'demo-user';
  const userRecord = await getUser(userId);
  const city = params.city || userRecord?.city || 'Mumbai';

  // Gather Musical DNA (check cache first)
  const [cachedTaste, cachedArtists] = await Promise.all([
    getUserTaste(userId),
    getUserArtists(userId)
  ]);

  let topArtists = (cachedArtists && cachedArtists.length > 0) ? cachedArtists : mockTopArtists;
  let vibeProfile = cachedTaste || mockVibeProfile;

  const accessToken = (session as any)?.accessToken;
  const isRealSpotifyToken = accessToken && accessToken !== 'demo_access_token';

  if (isRealSpotifyToken) {
    try {
      const realArtists = await fetchTopArtists(accessToken as string, 'medium_term');
      const realTracks = await fetchTopTracks(accessToken as string, 'medium_term');

      if (realArtists && realArtists.length > 0) {
        topArtists = realArtists as any;
        vibeProfile = calculateMusicalDna(realArtists, realTracks);
        await Promise.all([
          saveUserTaste(userId, vibeProfile),
          saveUserArtists(userId, topArtists as any),
          saveUserTracks(userId, realTracks || [])
        ]);
      } else if (realTracks && realTracks.length > 0) {
        const derivedArtists = realTracks.flatMap(t => t.artists || []).filter(Boolean);
        if (derivedArtists.length > 0) {
          topArtists = derivedArtists as any;
          vibeProfile = calculateMusicalDna(topArtists as any, realTracks);
          await Promise.all([
            saveUserTaste(userId, vibeProfile),
            saveUserArtists(userId, topArtists as any),
            saveUserTracks(userId, realTracks || [])
          ]);
        }
      }
    } catch (e) {
      console.warn('Live Spotify fetch failed, using cached taste:', e);
    }
  }

  // Fetch live events and interactions
  const [liveEvents, interactions] = await Promise.all([
    fetchLiveEvents(city),
    getUserInteractions(userId)
  ]);

  // Rank events through recommendation engine
  const rankedEvents = rankEvents(
    liveEvents,
    vibeProfile,
    topArtists as any,
    userRecord || undefined,
    interactions
  );

  const displayName = session?.user?.name?.split(' ')[0] || userRecord?.name?.split(' ')[0] || 'Alex';

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar initialCity={city} isDemo={isDemo && !session} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
        {/* Welcome Header */}
        <section className="py-4 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Taste DNA Active</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{displayName}</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 mt-1">
              Your Spotify rotation has been analyzed across 10 audio dimensions. Here are your live experiences in {city}!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/discover"
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Discover Feed
            </Link>
          </div>
        </section>

        {/* Musical DNA & Persona Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <MusicPersonaCard vibeProfile={vibeProfile} />

            {/* Top Influencing Artists */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                Live Matching Influencers
              </h3>
              <div className="space-y-3">
                {topArtists.slice(0, 5).map(artist => (
                  <div key={artist.id} className="flex items-center gap-3">
                    {artist.images?.[0]?.url && (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/10"
                      />
                    )}
                    <div className="truncate">
                      <p className="font-bold text-xs text-white truncate">{artist.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                        {artist.genres?.slice(0, 2).join(', ') || 'Eclectic'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <GenreRadarChart vibeProfile={vibeProfile} />
          </div>
        </div>

        {/* Filterable Live Event Grid & Map */}
        <DashboardTabs
          personalizedEvents={rankedEvents}
          allEvents={liveEvents}
          initialCity={city}
          vibeProfile={vibeProfile}
        />
      </div>

      {/* Floating AI Concierge */}
      <ResonateAssistant />
    </main>
  );
}
