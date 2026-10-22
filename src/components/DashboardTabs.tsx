'use client';

import React, { useState, useEffect } from 'react';
import { EventItem, EventCategory } from '../types';
import { EventGrid } from './EventGrid';
import { MapView } from './map/MapView';
import { WeekendPlannerModal } from './events/WeekendPlannerModal';
import { generateWeekendPlan } from '../lib/recommendation/weekendPlanner';
import {
  Sparkles,
  Heart,
  Globe,
  Map as MapIcon,
  List,
  Flame,
  Music2,
  Tent,
  Disc3,
  Laugh,
  Mic2,
  BookOpen,
  Filter
} from 'lucide-react';

interface DashboardTabsProps {
  personalizedEvents: EventItem[];
  allEvents: EventItem[];
  initialCity?: string;
  vibeProfile?: any;
}

const CATEGORY_CHIPS: { id: EventCategory; label: string }[] = [
  { id: 'all', label: 'All Experiences' },
  { id: 'concert', label: 'Concerts' },
  { id: 'festival', label: 'Festivals' },
  { id: 'club', label: 'Club Nights' },
  { id: 'dj', label: 'DJ Sets' },
  { id: 'comedy', label: 'Stand-up' },
  { id: 'open_mic', label: 'Open Mic' },
  { id: 'poetry', label: 'Poetry & Arts' }
];

export function DashboardTabs({ personalizedEvents, allEvents, initialCity = 'Mumbai', vibeProfile }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'for-you' | 'saved' | 'all'>('for-you');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isWeekendModalOpen, setIsWeekendModalOpen] = useState(false);

  // Load saved from database API or localStorage
  useEffect(() => {
    fetch('/api/saved')
      .then(res => res.json())
      .then(data => {
        if (data.saved) {
          setSavedIds(new Set(data.saved.map((s: any) => s.eventId)));
        }
      })
      .catch(() => {
        const local = localStorage.getItem('savedEvents');
        if (local) setSavedIds(new Set(JSON.parse(local)));
      });
  }, []);

  const toggleSave = (eventId: string) => {
    const next = new Set(savedIds);
    if (next.has(eventId)) next.delete(eventId);
    else next.add(eventId);
    setSavedIds(next);
    localStorage.setItem('savedEvents', JSON.stringify(Array.from(next)));
  };

  const handleDismiss = (eventId: string) => {
    setDismissedIds(prev => new Set(prev).add(eventId));
  };

  // Combine and deduplicate
  const allUniqueMap = new Map<string, EventItem>();
  [...personalizedEvents, ...allEvents].forEach(e => allUniqueMap.set(e.id, e));
  const uniquePool = Array.from(allUniqueMap.values());

  const getSavedEvents = () => {
    return uniquePool.filter(e => savedIds.has(e.id));
  };

  let baseEvents = activeTab === 'for-you'
    ? personalizedEvents
    : activeTab === 'saved'
      ? getSavedEvents()
      : allEvents;

  // Filter out dismissed events
  baseEvents = baseEvents.filter(e => !dismissedIds.has(e.id));

  // Filter by category chip
  if (selectedCategory !== 'all') {
    baseEvents = baseEvents.filter(e => {
      if (selectedCategory === 'poetry') return e.category === 'poetry' || e.category === 'arts';
      return e.category === selectedCategory;
    });
  }

  const weekendItinerary = generateWeekendPlan(personalizedEvents, vibeProfile);

  return (
    <section className="pt-8 border-t border-white/10 mt-8">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Upcoming Future Shows
            </span>
            <span className="text-xs font-bold text-neutral-400 font-mono px-2 py-0.5 rounded-full bg-neutral-800">
              {baseEvents.length} events
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Curated Experiences Near {initialCity}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Strictly upcoming future events matched to your Spotify listening history and location radius
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Plan My Weekend Trigger Button */}
          <button
            onClick={() => setIsWeekendModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            Plan My Weekend
          </button>

          {/* List vs Map Toggle */}
          <div className="flex items-center bg-neutral-900 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'list'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'map'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs: For You / Saved / Around Me */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('for-you')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'for-you'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> For You
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" /> Saved ({savedIds.size})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Around Me
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATEGORY_CHIPS.map(chip => {
          const active = selectedCategory === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                active
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-neutral-900/60 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* View Rendering */}
      {viewMode === 'map' ? (
        <MapView events={baseEvents} centerCity={initialCity} />
      ) : activeTab === 'saved' && baseEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 rounded-3xl border border-white/10">
          <Heart className="w-12 h-12 text-neutral-500 mb-3 opacity-30" />
          <h3 className="text-lg font-bold text-white mb-1">No Saved Experiences Yet</h3>
          <p className="text-neutral-400 text-xs max-w-sm">
            Tap the heart icon on any concert, club night, or comedy show to store it in your personal saved queue.
          </p>
        </div>
      ) : (
        <EventGrid
          events={baseEvents}
          savedIds={savedIds}
          toggleSave={toggleSave}
          onDismissEvent={handleDismiss}
        />
      )}

      {/* Weekend Planner Modal */}
      <WeekendPlannerModal
        isOpen={isWeekendModalOpen}
        onClose={() => setIsWeekendModalOpen(false)}
        itinerary={weekendItinerary}
      />
    </section>
  );
}
