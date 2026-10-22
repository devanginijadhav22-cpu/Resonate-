'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Compass, Calendar, DollarSign, Check, X } from 'lucide-react';
import { EventCategory, UserPreferences } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (prefs: Partial<UserPreferences>) => void;
  initialCity?: string;
}

const CATEGORY_OPTIONS: { id: EventCategory; label: string; icon: string }[] = [
  { id: 'concert', label: 'Concerts & Live Gigs', icon: '🎸' },
  { id: 'club', label: 'Club Nights & Electronic', icon: '🪩' },
  { id: 'festival', label: 'Music Festivals', icon: '🎪' },
  { id: 'comedy', label: 'Stand-up Comedy', icon: '🎙️' },
  { id: 'open_mic', label: 'Open Mic Showcases', icon: '🎤' },
  { id: 'poetry', label: 'Poetry & Spoken Word', icon: '📖' },
  { id: 'arts', label: 'Arts & Cultural Gigs', icon: '🎨' }
];

const DISTANCE_OPTIONS = [2, 5, 10, 25];

export function OnboardingModal({ isOpen, onClose, onSaved, initialCity = 'Mumbai' }: OnboardingModalProps) {
  const [city, setCity] = useState(initialCity);
  const [maxDistance, setMaxDistance] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(['concert', 'club', 'festival']);
  const [budget, setBudget] = useState(2500);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: EventCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const prefs: Partial<UserPreferences> = {
        city,
        maxDistanceKm: maxDistance,
        preferredCategories: selectedCategories,
        budget
      };

      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prefs, onboardingCompleted: true })
      });

      onSaved(prefs);
      onClose();
    } catch (e) {
      console.error('Error saving profile preferences:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-white/15 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-foreground">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-emerald-500/20 blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">Complete Your Resonate Profile</h2>
              <p className="text-xs text-neutral-400">Tailor live events to where and how you go out</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* City Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              Where do you usually go out?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-neutral-800/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Mumbai">Mumbai, India</option>
                <option value="Bengaluru">Bengaluru, India</option>
                <option value="Delhi NCR">Delhi NCR, India</option>
                <option value="New York">New York, USA</option>
                <option value="London">London, UK</option>
                <option value="Los Angeles">Los Angeles, USA</option>
              </select>
            </div>
          </div>

          {/* Distance Slider / Radius */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              How far are you willing to travel?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DISTANCE_OPTIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setMaxDistance(d)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    maxDistance === d
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-neutral-800/60 border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  {d} km
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Event Types */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              What do you enjoy experiencing?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map(opt => {
                const active = selectedCategories.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleCategory(opt.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      active
                        ? 'bg-purple-500/20 border-purple-500/60 text-white'
                        : 'bg-neutral-800/40 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Typical Event Budget (per ticket)
              </label>
              <span className="text-xs font-extrabold text-emerald-400">₹{budget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={budget}
              onChange={e => setBudget(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>₹500 (Open Mics)</span>
              <span>₹2,500 (Club / Gigs)</span>
              <span>₹10,000+ (Festivals)</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
