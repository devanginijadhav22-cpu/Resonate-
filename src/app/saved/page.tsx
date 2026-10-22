import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth/authOptions';
import { Navbar } from '../../components/Navbar';
import { ResonateAssistant } from '../../components/ai/ResonateAssistant';
import { getSavedEvents } from '../../lib/database';
import { EventGrid } from '../../components/EventGrid';
import { Bookmark, Sparkles, Compass } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  const savedList = await getSavedEvents(userId);
  const events = savedList.map(s => s.event);
  const savedIds = new Set(events.map(e => e.id));

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar isDemo={!session} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
        <section className="py-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-3">
            <Bookmark className="w-3.5 h-3.5" /> Bookmarked Experiences
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Your Saved Live Events
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mt-2">
            Keep track of upcoming tours, club nights, and stand-up specials you plan on attending.
          </p>
        </section>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-neutral-900/40 rounded-3xl border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-500">
              <Bookmark className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-xl font-bold text-white">No Saved Experiences Yet</h3>
            <p className="text-sm text-neutral-400 max-w-md">
              Whenever an event catches your attention, tap the heart icon on its card to keep it saved right here.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-xl shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" /> Explore Events
            </Link>
          </div>
        ) : (
          <EventGrid events={events} savedIds={savedIds} />
        )}
      </div>

      <ResonateAssistant />
    </main>
  );
}
