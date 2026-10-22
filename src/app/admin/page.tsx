import React from 'react';
import { Navbar } from '../../components/Navbar';
import { getAnalytics } from '../../lib/database';
import {
  Users,
  Calendar,
  Heart,
  Ticket,
  TrendingUp,
  Percent,
  Sparkles,
  MapPin,
  Flame,
  BarChart3
} from 'lucide-react';
import { AdminCharts } from './AdminCharts';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const stats = await getAnalytics();

  const metricCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    { label: 'Active Users (30d)', value: stats.activeUsers.toLocaleString(), icon: Flame, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
    { label: 'Events Indexed', value: stats.eventsIndexed.toLocaleString(), icon: Calendar, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    { label: 'Events Saved', value: stats.eventsSaved.toLocaleString(), icon: Heart, color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
    { label: 'Ticket Link Clicks', value: stats.ticketClicks.toLocaleString(), icon: Ticket, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    { label: 'Avg Match Score', value: `${stats.averageMatchScore}%`, icon: Sparkles, color: 'text-teal-400 bg-teal-500/15 border-teal-500/30' }
  ];

  const conversionMetrics = [
    { label: 'Recommendation CTR', value: `${stats.ctr}%`, desc: 'Percentage of recommended events clicked' },
    { label: 'Save Rate', value: `${stats.saveRate}%`, desc: 'Ratio of viewed events saved by users' },
    { label: 'Ticket Conversion', value: `${stats.ticketConversionRate}%`, desc: 'Saved events converted to ticket links' }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-foreground pb-24 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
        {/* Banner pointing to Personal Taste Analytics */}
        <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Looking for your Personal Music Taste & DNA?</p>
              <p className="text-xs text-neutral-400">View your 8-point sonic radar web, genre affinities, and live event compatibility.</p>
            </div>
          </div>
          <a
            href="/analytics"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 shadow-lg shadow-emerald-500/20"
          >
            <span>Personal Taste Analytics</span>
            <Sparkles className="w-3.5 h-3.5" />
          </a>
        </div>

        <section className="py-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-3">
            <BarChart3 className="w-3.5 h-3.5" /> System Analytics & Performance
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Resonate Recommendation Intelligence
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mt-2">
            Real-time telemetry on user engagement, event matching efficiency, and recommendation conversions across all registered accounts.
          </p>
        </section>

        {/* Metric Cards Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 space-y-2 shadow-lg"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">{card.label}</span>
                  <span className="text-xl font-black text-white">{card.value}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Conversion Performance Banner */}
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-900/60 to-neutral-950 border border-white/10 rounded-3xl p-6 md:p-8">
          <h3 className="text-base font-bold text-white mb-4">Recommendation Funnel Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {conversionMetrics.map(m => (
              <div key={m.label} className="p-4 rounded-2xl bg-neutral-800/40 border border-white/5 space-y-1">
                <span className="text-xs text-neutral-400 font-semibold">{m.label}</span>
                <p className="text-3xl font-black text-emerald-400">{m.value}</p>
                <p className="text-[11px] text-neutral-500">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recharts Analytics Component */}
        <AdminCharts stats={stats} />
      </div>
    </main>
  );
}
