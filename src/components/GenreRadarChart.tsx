"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from "recharts";
import { VibeProfile } from "../types";
import { Sparkles, Dna, Music, Zap, Flame } from "lucide-react";

interface GenreRadarChartProps {
  vibeProfile: VibeProfile;
  className?: string;
  showToggle?: boolean;
}

export function GenreRadarChart({ vibeProfile, className = "", showToggle = true }: GenreRadarChartProps) {
  const [viewMode, setViewMode] = useState<"genres" | "dimensions">("dimensions");

  // 1. Prepare 8-Point Sonic Dimensions Data (Always available and balanced 0-100)
  const dimensionData = [
    { subject: "Energy", score: vibeProfile.energy || 75, fullMark: 100, desc: "Tempo & drive" },
    { subject: "Danceability", score: vibeProfile.danceability || 70, fullMark: 100, desc: "Rhythm & groove" },
    { subject: "Valence", score: vibeProfile.valence || 65, fullMark: 100, desc: "Emotional optimism" },
    { subject: "Acoustic", score: vibeProfile.acousticness || 30, fullMark: 100, desc: "Organic warmth" },
    { subject: "Intensity", score: vibeProfile.intensity || 78, fullMark: 100, desc: "Loudness & bite" },
    { subject: "Indie / Alt", score: vibeProfile.indie || 82, fullMark: 100, desc: "Underground spirit" },
    { subject: "Electronic", score: vibeProfile.electronic || 74, fullMark: 100, desc: "Synth & club beats" },
    { subject: "Live Affinity", score: vibeProfile.liveMusicAffinity || 88, fullMark: 100, desc: "Gig readiness" }
  ];

  // 2. Prepare Genre Affinity Data (guarantee at least 5 points)
  const defaultGenres = [
    { genre: "Indie Rock", score: 95 },
    { genre: "Electronic / Synth", score: 88 },
    { genre: "Neo-Psychedelia", score: 76 },
    { genre: "Alternative Pop", score: 68 },
    { genre: "Acoustic & Folk", score: 54 }
  ];

  const rawGenres = (vibeProfile.topGenres && vibeProfile.topGenres.length >= 3)
    ? vibeProfile.topGenres
    : defaultGenres;

  const genreData = rawGenres.map(g => ({
    subject: g.genre,
    score: g.score || 70,
    fullMark: 100,
    desc: "Genre affinity rating"
  }));

  const activeData = viewMode === "dimensions" ? dimensionData : genreData;
  const isDimensionView = viewMode === "dimensions";

  return (
    <div
      className={`w-full bg-gradient-to-br from-neutral-900/90 via-neutral-900/60 to-neutral-950 p-6 md:p-7 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col justify-between ${className}`}
    >
      {/* Background ambient neon glow */}
      <div className="absolute top-0 right-1/4 w-56 h-56 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Dna className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">Musical DNA Web</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {isDimensionView
              ? "8-Point Sonic Audio Vector Telemetry"
              : "Genre Affinity & Listening Rotation Structure"}
          </p>
        </div>

        {showToggle && (
          <div className="flex items-center p-1 rounded-xl bg-neutral-950/80 border border-white/10 shadow-inner">
            <button
              onClick={() => setViewMode("dimensions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isDimensionView
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Sonic DNA</span>
            </button>
            <button
              onClick={() => setViewMode("genres")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isDimensionView
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Genre Web</span>
            </button>
          </div>
        )}
      </div>

      {/* Spider/Radar Web Chart Canvas */}
      <div className="w-full h-[290px] md:h-[320px] relative z-10 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={activeData}>
            <PolarGrid stroke="#27272a" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#d4d4d8", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Taste Resonance"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="#10b981"
              fillOpacity={0.4}
              dot={{ r: 4, fill: "#34d399", stroke: "#064e3b", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-neutral-900/95 border border-emerald-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-xs font-bold text-white">{data.subject}</span>
                        <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                          {data.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">{data.desc}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics Highlights */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 z-10">
        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5 text-center">
          <span className="text-[10px] font-semibold text-neutral-400 block uppercase tracking-wider">
            Live Affinity
          </span>
          <span className="text-sm font-black text-emerald-400">
            {vibeProfile.liveMusicAffinity || 88}%
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5 text-center">
          <span className="text-[10px] font-semibold text-neutral-400 block uppercase tracking-wider">
            Indie Spirit
          </span>
          <span className="text-sm font-black text-teal-400">
            {vibeProfile.indie || 82}%
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5 text-center">
          <span className="text-[10px] font-semibold text-neutral-400 block uppercase tracking-wider">
            Energy Quotient
          </span>
          <span className="text-sm font-black text-amber-400">
            {vibeProfile.energy || 75}%
          </span>
        </div>
      </div>
    </div>
  );
}
