'use client';

import React from 'react';
import { Calendar, Sparkles, MapPin, ExternalLink, X, Flame, Clock } from 'lucide-react';
import { WeekendItinerary } from '../../lib/recommendation/weekendPlanner';
import Link from 'next/link';

interface WeekendPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: WeekendItinerary | null;
}

export function WeekendPlannerModal({ isOpen, onClose, itinerary }: WeekendPlannerModalProps) {
  if (!isOpen || !itinerary) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-foreground max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-36 bg-purple-500/20 blur-[90px] pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/40">
              <Flame className="w-5 h-5 text-purple-400" />
            </span>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-1">
                <Sparkles className="w-3 h-3" />
                {itinerary.totalMatchScore}% Itinerary Match
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">Your Personalized Weekend</h2>
              <p className="text-xs text-neutral-400">{itinerary.headline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline of Days */}
        <div className="space-y-4 mb-6">
          {itinerary.days.map((item, index) => {
            const colors = [
              'border-purple-500/40 bg-purple-500/10 text-purple-400',
              'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
              'border-blue-500/40 bg-blue-500/10 text-blue-400'
            ];

            return (
              <div
                key={item.day}
                className="bg-neutral-800/60 border border-white/10 rounded-2xl p-4 md:p-5 relative group hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${colors[index % colors.length]}`}>
                      {item.day}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">{item.theme}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {item.event.matchScore}% Match
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-3">
                  {item.event.image && (
                    <img
                      src={item.event.image}
                      alt={item.event.title}
                      className="w-full sm:w-28 h-20 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    />
                  )}

                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm line-clamp-1 mb-1">{item.event.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-1 mb-2">
                      {item.event.artist || item.event.genre}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {item.dateLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {item.event.venue} ({item.event.distanceKm || 3.2} km)
                      </span>
                      <span className="font-semibold text-white">
                        {item.event.currency || '₹'}{item.event.price || 999}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-end gap-2 flex-shrink-0">
                    <Link
                      href={`/events/${item.event.id}`}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-700/80 hover:bg-neutral-600 text-white transition-colors w-full text-center"
                    >
                      Details
                    </Link>
                    <a
                      href={item.event.ticketUrl || item.event.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-1 transition-transform active:scale-95 w-full"
                    >
                      Tickets
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <p className="text-[11px] text-neutral-400">
            Itinerary calculated using your Spotify taste, location proximity, and category affinities.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
