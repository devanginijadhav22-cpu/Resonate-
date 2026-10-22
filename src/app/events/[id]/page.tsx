import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/authOptions';
import { Navbar } from '../../../components/Navbar';
import { ResonateAssistant } from '../../../components/ai/ResonateAssistant';
import { fetchLiveEvents } from '../../../lib/events';
import { CURATED_EVENTS } from '../../../lib/events/curatedEvents';
import { getUserTaste, isEventSaved } from '../../../lib/database';
import { generateEventReasoning } from '../../../lib/ai/eventReasoning';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Heart,
  Share2,
  ArrowLeft,
  Music2,
  Users,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { MapView } from '../../../components/map/MapView';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  // Find event
  let event = CURATED_EVENTS.find(e => e.id === id || e.externalId === id);
  if (!event) {
    const live = await fetchLiveEvents('Mumbai');
    event = live.find(e => e.id === id || e.externalId === id);
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-neutral-950 text-foreground flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-black text-white">Event Not Found</h2>
          <p className="text-sm text-neutral-400">
            This live event may have concluded or is no longer listed.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </main>
    );
  }

  const [taste, saved] = await Promise.all([
    getUserTaste(userId),
    isEventSaved(userId, event.id)
  ]);

  const reasoning = generateEventReasoning(event, taste);

  // Similar events in the same city
  const allCityEvents = await fetchLiveEvents(event.city);
  const similarEvents = allCityEvents
    .filter(e => e.id !== event!.id && (e.category === event!.category || e.genre === event!.genre))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar initialCity={event.city} isDemo={!session} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-10">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
          <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-500">
            {event.city} • {event.category.replace('_', ' ')}
          </span>
        </div>

        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/60 shadow-2xl">
          {/* Background Blurred Cover */}
          <div className="h-72 md:h-96 w-full relative overflow-hidden bg-neutral-900">
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
          </div>

          <div className="p-6 md:p-10 -mt-24 relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {event.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-white/10">
                  {event.genre}
                </span>
              </div>

              {/* Match Dial */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-black font-black text-sm shadow-xl shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 fill-black" />
                {event.matchScore}% Taste Match
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {event.title}
              </h1>
              {event.artist && (
                <p className="text-base md:text-lg text-emerald-400 font-semibold mt-1">
                  Headliner: {event.artist}
                </p>
              )}
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/10 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-bold text-white">{event.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Time</span>
                  <span className="font-bold text-white">{event.time || '8:00 PM'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Venue & Proximity</span>
                  <span className="font-bold text-white truncate max-w-[140px] block">
                    {event.venue} {event.distanceKm ? `(${event.distanceKm} km)` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 text-blue-400 font-black flex items-center justify-center shrink-0">
                  {event.currency || '₹'}
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Tickets From</span>
                  <span className="font-bold text-white">
                    {event.price ? `${event.currency || '₹'}${event.price.toLocaleString()}` : 'Free / RSVP'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <a
                  href={event.ticketUrl || event.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  Buy Official Tickets <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-neutral-400">
                Verified through {event.source === 'ticketmaster' ? 'Ticketmaster Discovery' : 'Resonate Local Partner Network'}
              </span>
            </div>
          </div>
        </section>

        {/* AI Recommendation Reasoning */}
        <section className="bg-gradient-to-br from-emerald-950/20 via-neutral-900/60 to-neutral-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-black text-white">Why This Event Matches You</h3>
              <p className="text-xs text-neutral-400">Explainable signals derived from your Spotify listening history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasoning.whyThisMatchesYou.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-900/60 border border-white/10 text-xs text-neutral-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/5 space-y-2 text-xs">
            <p className="font-semibold text-neutral-300">
              <span className="text-emerald-400">Crowd & Atmosphere: </span>
              {reasoning.crowdVibe}
            </p>
            <p className="text-neutral-400 leading-relaxed">
              {reasoning.musicalFitDescription}
            </p>
          </div>
        </section>

        {/* Description & Overview */}
        {event.description && (
          <section className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6 md:p-8 space-y-3">
            <h3 className="text-lg font-bold text-white">About the Experience</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">{event.description}</p>
          </section>
        )}

        {/* Venue Location Map */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Venue Location</h3>
            <p className="text-xs text-neutral-400">{event.venue}, {event.city}</p>
          </div>
          <MapView events={[event]} centerCity={event.city} />
        </section>

        {/* Similar Events */}
        {similarEvents.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-white/10">
            <div>
              <h3 className="text-xl font-black text-white">Similar Experiences in {event.city}</h3>
              <p className="text-xs text-neutral-400">More concerts and nights you might enjoy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarEvents.map(sim => (
                <Link
                  key={sim.id}
                  href={`/events/${sim.id}`}
                  className="bg-neutral-900/60 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-300 group block"
                >
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {sim.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{sim.venue} • {sim.date}</p>
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <span className="font-semibold text-emerald-400">{sim.matchScore}% Match</span>
                    <span className="text-white font-bold">{sim.currency || '₹'}{sim.price || 999}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <ResonateAssistant />
    </main>
  );
}
