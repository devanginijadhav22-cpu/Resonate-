'use client';

import React from 'react';
import { Sparkles, Zap, Activity, Radio, Compass, Disc3, Flame, HeartHandshake } from 'lucide-react';
import { VibeProfile } from '../types';

interface MusicPersonaCardProps {
  vibeProfile: VibeProfile;
}

export function MusicPersonaCard({ vibeProfile }: MusicPersonaCardProps) {
  const dimensions = [
    { label: 'Energy', value: vibeProfile.energy || 75, icon: Zap, color: 'bg-amber-400', textColor: 'text-amber-400' },
    { label: 'Danceability', value: vibeProfile.danceability || 70, icon: Activity, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
    { label: 'Live Affinity', value: vibeProfile.liveMusicAffinity || 85, icon: Flame, color: 'bg-rose-400', textColor: 'text-rose-400' },
    { label: 'Discovery', value: vibeProfile.discovery || 80, icon: Compass, color: 'bg-purple-400', textColor: 'text-purple-400' },
    { label: 'Indie & Alt', value: vibeProfile.indie || 75, icon: Radio, color: 'bg-blue-400', textColor: 'text-blue-400' },
    { label: 'Electronic', value: vibeProfile.electronic || 65, icon: Disc3, color: 'bg-teal-400', textColor: 'text-teal-400' }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-neutral-900/90 via-neutral-900/60 to-neutral-950 p-6 md:p-7 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Musical DNA Persona
        </span>
        <span className="text-[11px] font-bold text-neutral-400">10-Vector Profile</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1 mb-2">
        {vibeProfile.persona}
      </h2>

      {vibeProfile.personaDescription && (
        <p className="text-xs text-neutral-300 leading-relaxed mb-4">
          {vibeProfile.personaDescription}
        </p>
      )}

      {/* Key Attribute Badges */}
      {vibeProfile.keyAttributes && vibeProfile.keyAttributes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {vibeProfile.keyAttributes.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-white/10 text-neutral-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Dimension Sliders */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        {dimensions.map(dim => {
          const Icon = dim.icon;
          return (
            <div key={dim.label} className="group">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-neutral-400 flex items-center gap-1.5 font-medium group-hover:text-white transition-colors">
                  <Icon className={`w-3.5 h-3.5 ${dim.textColor}`} />
                  {dim.label}
                </span>
                <span className="font-extrabold text-white text-[11px]">{dim.value}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`${dim.color} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${dim.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
