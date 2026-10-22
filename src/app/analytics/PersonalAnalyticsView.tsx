'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Activity,
  Flame,
  Compass,
  Radio,
  Disc3,
  Heart,
  Volume2,
  TrendingUp,
  Music2,
  Calendar,
  Layers,
  Sliders,
  ExternalLink,
  ChevronRight,
  Headphones,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { VibeProfile, SpotifyArtist, SpotifyTrack, UserProfile } from '../../types';
import { GenreRadarChart } from '../../components/GenreRadarChart';
import { MusicPersonaCard } from '../../components/MusicPersonaCard';

interface PersonalAnalyticsViewProps {
  user: UserProfile | null;
  vibeProfile: VibeProfile;
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  userName: string;
  userEmail: string;
  userImage?: string;
  city: string;
}

export function PersonalAnalyticsView({
  user,
  vibeProfile,
  topArtists,
  topTracks,
  userName,
  userEmail,
  userImage,
  city
}: PersonalAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'genres' | 'influencers'>('overview');

  // 10 Detailed Dimensions
  const dimensionDetails = [
    {
      key: 'energy',
      name: 'Energy',
      value: vibeProfile.energy || 75,
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/15 border-amber-500/30',
      desc: 'Tempo, loudness, and physical perceived activity level.'
    },
    {
      key: 'danceability',
      name: 'Danceability',
      value: vibeProfile.danceability || 70,
      icon: Activity,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15 border-emerald-500/30',
      desc: 'Rhythm regularity, beat strength, and groove suitability.'
    },
    {
      key: 'liveMusicAffinity',
      name: 'Live Gig Affinity',
      value: vibeProfile.liveMusicAffinity || 88,
      icon: Flame,
      color: 'from-rose-500 to-pink-500',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/15 border-rose-500/30',
      desc: 'Readiness and sonic compatibility with in-person concerts and clubs.'
    },
    {
      key: 'valence',
      name: 'Valence (Mood)',
      value: vibeProfile.valence || 65,
      icon: Heart,
      color: 'from-yellow-400 to-amber-500',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/15 border-yellow-500/30',
      desc: 'Musical positiveness, optimism, and emotional brightness.'
    },
    {
      key: 'intensity',
      name: 'Sonic Intensity',
      value: vibeProfile.intensity || 78,
      icon: Volume2,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/15 border-purple-500/30',
      desc: 'Dynamic distortion, instrumentation density, and acoustic power.'
    },
    {
      key: 'indie',
      name: 'Indie & Alternative',
      value: vibeProfile.indie || 82,
      icon: Radio,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/15 border-blue-500/30',
      desc: 'Affinity for independent record labels, DIY aesthetics, and niche acts.'
    },
    {
      key: 'electronic',
      name: 'Electronic Density',
      value: vibeProfile.electronic || 74,
      icon: Disc3,
      color: 'from-teal-400 to-emerald-500',
      textColor: 'text-teal-400',
      bgColor: 'bg-teal-500/15 border-teal-500/30',
      desc: 'Synthetic timbres, drum machine programming, and club beats.'
    },
    {
      key: 'acousticness',
      name: 'Acoustic Warmth',
      value: vibeProfile.acousticness || 30,
      icon: Music2,
      color: 'from-orange-400 to-amber-600',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/15 border-orange-500/30',
      desc: 'Organic instrumentation, unplugged sets, and natural room resonance.'
    },
    {
      key: 'discovery',
      name: 'Discovery Quotient',
      value: vibeProfile.discovery || 84,
      icon: Compass,
      color: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-400',
      bgColor: 'bg-violet-500/15 border-violet-500/30',
      desc: 'Propensity to listen to emerging acts outside the Billboard Top 40.'
    },
    {
      key: 'mainstream',
      name: 'Mainstream Index',
      value: vibeProfile.mainstream || 46,
      icon: TrendingUp,
      color: 'from-sky-400 to-blue-600',
      textColor: 'text-sky-400',
      bgColor: 'bg-sky-500/15 border-sky-500/30',
      desc: 'Proportion of global chart hits in your overall listening rotation.'
    }
  ];

  // Genre Chart Data
  const defaultGenres = [
    { genre: 'Indie Rock', score: 95 },
    { genre: 'Electronic / Synth', score: 88 },
    { genre: 'Neo-Psychedelia', score: 76 },
    { genre: 'Alternative Pop', score: 68 },
    { genre: 'Acoustic & Folk', score: 54 },
    { genre: 'Club & Techno', score: 46 }
  ];
  const genresList = (vibeProfile.topGenres && vibeProfile.topGenres.length > 0)
    ? vibeProfile.topGenres
    : defaultGenres;

  const genreChartData = genresList.map(g => ({
    name: g.genre,
    affinity: g.score || 75
  }));

  // Live Stage Match Compatibility
  const stageResonances = [
    {
      stage: 'Arena & Large Concerts',
      matchScore: Math.round(((vibeProfile.energy + vibeProfile.mainstream + vibeProfile.liveMusicAffinity) / 3)),
      category: 'concert',
      desc: 'Massive production, anthemic choruses, and laser visuals'
    },
    {
      stage: 'Underground Club & Warehouse Nights',
      matchScore: Math.round(((vibeProfile.electronic + vibeProfile.danceability + vibeProfile.intensity) / 3)),
      category: 'club',
      desc: 'Extended DJ sets, pounding sub-bass, and late-night rave vibes'
    },
    {
      stage: 'Intimate Acoustic & Listening Cafes',
      matchScore: Math.round(((vibeProfile.acousticness * 1.5 + vibeProfile.indie * 0.8) / 2)),
      category: 'concert',
      desc: 'Unplugged singer-songwriters, close-proximity stages, and storytelling'
    },
    {
      stage: 'Indie & Alt Festival Stages',
      matchScore: Math.round(((vibeProfile.indie + vibeProfile.discovery + vibeProfile.liveMusicAffinity) / 3)),
      category: 'festival',
      desc: 'Multi-stage discovery, psych-rock jams, and open-air energy'
    },
    {
      stage: 'Late-Night Comedy & Variety',
      matchScore: Math.round(vibeProfile.valence * 0.5 + (vibeProfile.liveMusicAffinity || 70) * 0.5),
      category: 'comedy',
      desc: 'Stand-up routines, cultural open mics, and relaxed nightlife'
    }
  ];

  const BAR_COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7'];

  return (
    <div className="space-y-10">
      {/* User Header / DNA Telemetry Banner */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-900/80 to-neutral-950 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl">
            {userImage ? (
              <img src={userImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <Headphones className="w-10 h-10 text-emerald-400" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white">{userName}</h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Live Spotify DNA Active
              </span>
            </div>
            <p className="text-xs text-neutral-400">{userEmail}</p>
            <p className="text-xs text-neutral-300 flex items-center gap-1.5 pt-1">
              <span>Home City: <strong className="text-white">{city}</strong></span>
              <span className="text-neutral-500">•</span>
              <span>Analyzed: <strong className="text-white">{topArtists.length} Artists & {topTracks.length || 20} Tracks</strong></span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <Link
            href="/discover"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            Match Live Events
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-300 font-bold text-xs transition-colors flex items-center gap-1.5"
            title="View Platform & System Metrics"
          >
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">System Telemetry</span>
          </Link>
        </div>
      </section>

      {/* Hero Visualizer Row: Radar Web & Persona Card */}
      <section className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sonic Telemetry</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Your Personal Musical DNA & Web Structure
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time multi-dimensional radar representation of your Spotify rotation, timbre distribution, and listening taste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MusicPersonaCard vibeProfile={vibeProfile} />
          </div>

          <div className="lg:col-span-2">
            <GenreRadarChart vibeProfile={vibeProfile} showToggle={true} />
          </div>
        </div>
      </section>

      {/* 10 Audio Dimensions Deep-Dive */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              10-Vector Audio Attributes
            </h2>
            <p className="text-xs text-neutral-400">
              Granular audio telemetry extracted from your acoustic rotation
            </p>
          </div>
          <span className="text-xs text-neutral-500 font-mono hidden sm:inline">10 Dimensions Analyzed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dimensionDetails.map(dim => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.key}
                className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${dim.bgColor}`}>
                      <Icon className={`w-4 h-4 ${dim.textColor}`} />
                    </div>
                    <span className="text-lg font-black text-white">{dim.value}%</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{dim.name}</h4>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-1">{dim.desc}</p>
                  </div>
                </div>

                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${dim.color} h-1.5 rounded-full transition-all duration-1000`}
                    style={{ width: `${dim.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Genre Distribution & Affinity Spectrum */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Ranking Horizontal Bar Chart */}
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 md:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Top Genre Resonance Spectrum</h3>
              <p className="text-xs text-neutral-400">Calculated affinity scores based on artist catalog depth</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Acoustic Hierarchy
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={genreChartData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#d4d4d8" fontSize={11} tickLine={false} width={110} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-neutral-900 border border-emerald-500/30 rounded-xl p-2.5 shadow-xl">
                          <p className="text-xs font-bold text-white">{data.name}</p>
                          <p className="text-xs font-black text-emerald-400">{data.affinity}% Resonance</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="affinity" radius={[0, 6, 6, 0]}>
                  {genreChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Stage Compatibility Matrix */}
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 md:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Live Gig & Stage Resonance</h3>
              <p className="text-xs text-neutral-400">How your DNA translates to real-world stage experiences</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Stage Matching
            </span>
          </div>

          <div className="space-y-3">
            {stageResonances.map(stage => (
              <div
                key={stage.stage}
                className="p-3.5 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{stage.stage}</h4>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">{stage.desc}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400">{stage.matchScore}%</span>
                    <span className="text-[10px] text-neutral-500 block">Match</span>
                  </div>
                  <Link
                    href={`/discover?category=${stage.category}`}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-emerald-500 hover:text-black text-neutral-300 transition-colors"
                    title="Find events in this category"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Influencing Artists Section */}
      <section className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Music2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Your Top Musical DNA Influencers</h3>
              <p className="text-xs text-neutral-400">The primary artists in your rotation defining your vibe persona</p>
            </div>
          </div>
          <span className="text-xs text-neutral-400 font-medium">
            {topArtists.length} Artists Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topArtists.slice(0, 8).map((artist, idx) => (
            <div
              key={artist.id || idx}
              className="p-4 rounded-2xl bg-neutral-800/40 border border-white/5 hover:border-emerald-500/30 transition-all space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-neutral-500 w-4 group-hover:text-emerald-400 transition-colors">
                  #{idx + 1}
                </span>
                {artist.images?.[0]?.url ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover shadow-md border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 border border-white/10">
                    {artist.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <h4 className="font-bold text-xs text-white truncate group-hover:text-emerald-400 transition-colors">
                    {artist.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                    {artist.genres?.slice(0, 2).join(', ') || 'Eclectic'}
                  </p>
                </div>
              </div>

              {/* Popularity bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                  <span>Spotify Popularity</span>
                  <span className="text-white font-bold">{artist.popularity ?? 75}%</span>
                </div>
                <div className="w-full bg-neutral-700/60 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-1 rounded-full"
                    style={{ width: `${artist.popularity ?? 75}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rotation Tracks if available */}
      {topTracks && topTracks.length > 0 && (
        <section className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
                <Headphones className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Top Tracks Fueling Your Audio Dimensions</h3>
                <p className="text-xs text-neutral-400">High-rotation tracks contributing to your tempo and valence</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400 font-medium">{topTracks.length} Tracks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topTracks.slice(0, 6).map((track, idx) => (
              <div
                key={track.id || idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-white/5 hover:border-white/15 transition-all gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-black text-neutral-500 w-4">#{idx + 1}</span>
                  {track.album?.images?.[0]?.url && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                  )}
                  <div className="truncate">
                    <p className="font-bold text-xs text-white truncate">{track.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {track.artists?.map(a => a.name).join(', ')}
                    </p>
                  </div>
                </div>

                {track.external_urls?.spotify && (
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors flex-shrink-0"
                    title="Open on Spotify"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
