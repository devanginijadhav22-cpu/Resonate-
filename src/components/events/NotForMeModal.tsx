'use client';

import React, { useState } from 'react';
import { X, ThumbsDown, Check } from 'lucide-react';
import { EventItem } from '../../types';

interface NotForMeModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onSubmit: (eventId: string, reason: string) => void;
}

const REASONS = [
  'Not my genre / music taste',
  'Too far from my location',
  'Too expensive for my budget',
  'Wrong date or timing',
  'Already seen this artist',
  'Just not interested'
];

export function NotForMeModal({ isOpen, event, onClose, onSubmit }: NotForMeModalProps) {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/recommendations/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          type: 'DISLIKE',
          reason: selectedReason
        })
      });

      onSubmit(event.id, selectedReason);
      onClose();
    } catch (e) {
      console.error('Error submitting feedback:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-foreground">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ThumbsDown className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Help Us Tune Your Taste</h3>
              <p className="text-xs text-neutral-400">Why isn&apos;t this event right for you?</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-semibold text-neutral-300 mb-3 bg-neutral-800/60 p-2.5 rounded-lg border border-white/5 truncate">
          &ldquo;{event.title}&rdquo;
        </p>

        <div className="space-y-2 mb-6">
          {REASONS.map(reason => (
            <button
              key={reason}
              type="button"
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                selectedReason === reason
                  ? 'bg-red-500/15 border-red-500/50 text-white'
                  : 'bg-neutral-800/40 border-white/5 text-neutral-300 hover:border-white/20'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-transform active:scale-95 flex items-center gap-1.5"
          >
            {loading ? 'Submitting...' : 'Improve Recommendations'}
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
