'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Ticket,
  ExternalLink,
  Music2,
  Mic2,
  Laugh,
  Heart,
  ThumbsDown,
  Sparkles,
  Tent,
  BookOpen,
  Palette,
  Disc3,
  Share2
} from 'lucide-react';
import { EventItem } from '../types';
import Link from 'next/link';
import { NotForMeModal } from './events/NotForMeModal';

interface EventGridProps {
  events: EventItem[];
  savedIds?: Set<string>;
  toggleSave?: (id: string) => void;
  onDismissEvent?: (id: string) => void;
}

export function EventGrid({ events, savedIds, toggleSave, onDismissEvent }: EventGridProps) {
  const [internalSavedIds, setInternalSavedIds] = useState<Set<string>>(savedIds || new Set());
  const [dismissModalEvent, setDismissModalEvent] = useState<EventItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getIcon = (category: string) => {
    switch (category) {
      case 'concert': return <Music2 className="w-3.5 h-3.5" />;
      case 'festival': return <Tent className="w-3.5 h-3.5" />;
      case 'club':
      case 'dj': return <Disc3 className="w-3.5 h-3.5" />;
      case 'comedy': return <Laugh className="w-3.5 h-3.5" />;
      case 'open_mic': return <Mic2 className="w-3.5 h-3.5" />;
      case 'poetry': return <BookOpen className="w-3.5 h-3.5" />;
      case 'arts': return <Palette className="w-3.5 h-3.5" />;
      default: return <Ticket className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'concert': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'festival': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'club':
      case 'dj': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'comedy': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'open_mic': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'poetry': return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      default: return 'bg-neutral-800 text-neutral-300 border-white/10';
    }
  };

  const handleToggleSave = async (event: EventItem) => {
    if (toggleSave) {
      toggleSave(event.id);
    }
    const nextSaved = new Set(internalSavedIds);
    const willSave = !nextSaved.has(event.id);
    if (willSave) {
      nextSaved.add(event.id);
    } else {
      nextSaved.delete(event.id);
    }
    setInternalSavedIds(nextSaved);

    try {
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, eventData: event })
      });
    } catch (e) {
      console.error('Error saving event:', e);
    }
  };

  const handleTicketClick = (event: EventItem) => {
    fetch('/api/recommendations/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.id, type: 'TICKET_CLICK' })
    }).catch(() => {});
  };

  const handleShare = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${event.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 rounded-3xl border border-white/10 col-span-full">
        <Ticket className="w-12 h-12 text-neutral-500 mb-4 opacity-40" />
        <h3 className="text-xl font-bold text-white mb-2">No Matching Events Found</h3>
        <p className="text-neutral-400 max-w-md text-sm">
          We couldn&apos;t find any events matching your selected filters in this city. Try expanding your search radius or clearing category filters!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const isSaved = internalSavedIds.has(event.id);
          const displayTitle = event.title || event.name;
          const displayCategory = event.category.replace('_', ' ');

          return (
            <div
              key={event.id}
              className="bg-neutral-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 rounded-2xl transition-all duration-300 flex flex-col group relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1"
            >
              {/* Event Image Banner */}
              <div className="w-full h-44 relative overflow-hidden bg-neutral-800">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                    <Music2 className="w-8 h-8 text-neutral-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

                {/* Top Action Icons (Save & Dismiss) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={(e) => handleShare(event, e)}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white transition-colors"
                    title={copiedId === event.id ? 'Copied Link!' : 'Share Event'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDismissModalEvent(event)}
                    className="p-2 rounded-full bg-black/50 hover:bg-red-500/30 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Not interested"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleSave(event)}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 transition-transform active:scale-90"
                    title={isSaved ? 'Remove from Saved' : 'Save Event'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Match Badge & Category Tag on Image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 font-bold capitalize backdrop-blur-md ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {getIcon(event.category)} {displayCategory}
                  </span>

                  {event.matchScore > 0 && (
                    <span className="text-[11px] font-black text-black bg-emerald-400 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3 fill-black" />
                      {event.matchScore}% Match
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/events/${event.id}`}>
                    <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5 cursor-pointer">
                      {displayTitle}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
                    {event.artist || event.genre}
                  </p>

                  <div className="space-y-1.5 text-xs text-neutral-300 mb-4">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate flex items-center gap-1.5 font-medium text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                        {event.date}
                        <span className="text-neutral-500 font-normal">•</span>
                        <span className="text-neutral-400 font-normal">{event.time || '8:00 PM'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        {event.venue}
                        {event.distanceKm !== undefined ? ` • ${event.distanceKm} km` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Reason Pill */}
                  {event.matchReason && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300 font-medium mb-4 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{event.matchReason}</span>
                    </div>
                  )}
                </div>

                {/* Footer with Price and Ticket CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase tracking-wider font-semibold">
                      Tickets
                    </span>
                    <span className="font-black text-sm text-white">
                      {event.price ? `${event.currency || '₹'}${event.price.toLocaleString()}` : 'Free / RSVP'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      Details
                    </Link>

                    <a
                      href={event.ticketUrl || event.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTicketClick(event)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                    >
                      Tickets <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Not for me" modal */}
      <NotForMeModal
        isOpen={Boolean(dismissModalEvent)}
        event={dismissModalEvent}
        onClose={() => setDismissModalEvent(null)}
        onSubmit={(id) => {
          if (onDismissEvent) onDismissEvent(id);
        }}
      />
    </>
  );
}
