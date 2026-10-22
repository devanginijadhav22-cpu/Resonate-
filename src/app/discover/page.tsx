import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth/authOptions';
import { Navbar } from '../../components/Navbar';
import { ResonateAssistant } from '../../components/ai/ResonateAssistant';
import { fetchLiveEvents } from '../../lib/events';
import { getUser, getUserTaste, getUserInteractions, getUserArtists } from '../../lib/database';
import { rankEvents } from '../../lib/recommendation/recommendationEngine';
import { mockTopArtists } from '../../lib/mockData';
import { EventItem } from '../../types';
import Link from 'next/link';
import { Sparkles, MapPin, Calendar, ExternalLink, ArrowRight, Compass, Flame, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

function CarouselSection({ title, subtitle, events }: { title: string; subtitle: string; events: EventItem[] }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="space-y-3.5">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            {title}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {events.map(evt => (
          <div
            key={evt.id}
            className="flex-shrink-0 w-72 bg-neutral-900/70 border border-white/10 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="h-36 w-full relative overflow-hidden bg-neutral-800">
              {evt.image ? (
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

              <div className="absolute top-2.5 right-2.5">
                <span className="text-[10px] font-black text-black bg-emerald-400 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles className="w-2.5 h-2.5 fill-black" />
                  {evt.matchScore}%
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                  {evt.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/events/${evt.id}`}>
                  <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1 mb-1">
                    {evt.title}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
                  {evt.artist || evt.genre}
                </p>

                <div className="space-y-1 text-xs text-neutral-400 mb-3">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{evt.venue} {evt.distanceKm ? `(${evt.distanceKm} km)` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">
                  {evt.price ? `${evt.currency || '₹'}${evt.price.toLocaleString()}` : 'Free / RSVP'}
                </span>
                <Link
                  href={`/events/${evt.id}`}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  View Event <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ city?: string; query?: string }> }) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  const [user, taste, interactions, userArtists] = await Promise.all([
    getUser(userId),
    getUserTaste(userId),
    getUserInteractions(userId),
    getUserArtists(userId)
  ]);

  const city = params.city || user?.city || 'Mumbai';
  const rawEvents = await fetchLiveEvents(city, params.query);

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

  // Group into curated discovery shelves
  const topPicks = ranked.slice(0, 6);
  const artistNames = artistsToUse.map(a => a.name.toLowerCase());
  const becauseYouListenTo = ranked.filter(e => {
    const art = (e.artist || '').toLowerCase();
    const gnr = (e.genre || '').toLowerCase();
    return artistNames.some(name => art.includes(name) || name.includes(art)) ||
      (fallbackTaste.topGenres || []).some(tg => gnr.includes(tg.genre.toLowerCase()));
  });
  const nearYou = ranked.filter(e => (e.distanceKm || 10) <= 5);
  const thisWeekend = ranked.filter(e => e.date.toLowerCase().includes('saturday') || e.date.toLowerCase().includes('friday') || e.date.toLowerCase().includes('weekend'));
  const hiddenGems = ranked.filter(e => e.category === 'open_mic' || e.category === 'poetry' || (e.price && e.price <= 800));

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar initialCity={city} isDemo={!session} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-12">
        {/* Header Hero */}
        <section className="py-6 border-b border-white/10 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3">
            <Compass className="w-3.5 h-3.5" /> Discovery Feed
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Explore <span className="text-emerald-400">{city}</span> Live Experiences
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mt-2">
            Curated exploration streams powered by your Spotify taste, venue proximity, and live sound affinities.
          </p>
        </section>

        {/* Discovery Shelves */}
        <div className="space-y-12">
          <CarouselSection
            title="Recommended For You"
            subtitle="Top live events matched to your personal Musical DNA"
            events={topPicks}
          />

          <CarouselSection
            title="Because You Listen To..."
            subtitle="Concerts & club nights tied directly to your top Spotify artists & genres"
            events={becauseYouListenTo.length > 0 ? becauseYouListenTo : topPicks.slice(1, 5)}
          />

          <CarouselSection
            title="Near You"
            subtitle="Live sound happening within 5 km of your neighborhood"
            events={nearYou.length > 0 ? nearYou : topPicks}
          />

          <CarouselSection
            title="This Weekend"
            subtitle="The best Friday, Saturday & Sunday sets to catch live"
            events={thisWeekend.length > 0 ? thisWeekend : topPicks}
          />

          <CarouselSection
            title="Hidden Gems & Acoustic Showcases"
            subtitle="Intimate listening rooms, open mics, and emerging independent talents"
            events={hiddenGems.length > 0 ? hiddenGems : topPicks.slice(2, 6)}
          />
        </div>
      </div>

      <ResonateAssistant />
    </main>
  );
}
