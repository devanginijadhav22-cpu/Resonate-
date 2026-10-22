'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { AnalyticsSummary } from '../../types';

export function AdminCharts({ stats }: { stats: AnalyticsSummary }) {
  const chartData = stats.recentInteractions || [
    { date: 'Oct 01', count: 68 },
    { date: 'Oct 02', count: 94 },
    { date: 'Oct 03', count: 120 },
    { date: 'Oct 04', count: 145 },
    { date: 'Oct 05', count: 180 }
  ];

  const categoryData = stats.categoryBreakdown || [
    { category: 'Concerts', count: 42 },
    { category: 'Club Nights', count: 28 },
    { category: 'Festivals', count: 14 },
    { category: 'Standup', count: 22 },
    { category: 'Open Mic', count: 18 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Interaction Trends Area Chart */}
      <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white">Daily Live Interaction Volume</h3>
          <p className="text-xs text-neutral-400">Total views, saves, and ticket clicks across all regions</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} />
              <YAxis stroke="#737373" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#emeraldGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white">Events by Category</h3>
          <p className="text-xs text-neutral-400">Active distribution of concerts, club sets, and cultural shows</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="category" stroke="#737373" fontSize={11} tickLine={false} />
              <YAxis stroke="#737373" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
