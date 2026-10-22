'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, X, Send, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';
import Link from 'next/link';

export function ResonateAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; events?: EventItem[] }>>([
    {
      sender: 'assistant',
      text: "Hey! I'm Resonate AI. Ask me anything like \"Find me something fun this Saturday\" or \"Electronic gigs under ₹2000\"."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'What should I do this Saturday?',
    'Show me electronic events',
    'Find something under ₹1000',
    'Chill acoustic vibes'
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    const userMessage = { sender: 'user' as const, text: q };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.reply || "Here's what I found based on your music taste:",
          events: data.matchedEvents
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I had a hiccup analyzing live events. Try asking about a specific day or genre!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9000] flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm shadow-2xl shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-4 h-4 fill-black" />
        <span>Ask Resonate</span>
      </button>

      {/* Assistant Modal / Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-[9001] w-[calc(100vw-32px)] sm:w-[420px] max-h-[580px] bg-neutral-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-foreground animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Resonate AI Assistant</h3>
                <p className="text-[10px] text-neutral-400">Live taste-matching concierges</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[380px] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-black font-semibold rounded-tr-sm'
                      : 'bg-neutral-800 text-neutral-200 border border-white/10 rounded-tl-sm'
                  }`}
                >
                  {m.text}
                </div>

                {/* Event Cards recommendation attachment */}
                {m.events && m.events.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full">
                    {m.events.map(evt => (
                      <div
                        key={evt.id}
                        className="bg-neutral-800/90 border border-white/10 rounded-xl p-2.5 hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-white text-xs line-clamp-1">{evt.title}</h5>
                          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {evt.matchScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                          <span className="truncate">{evt.venue}</span>
                          <span>•</span>
                          <span>{evt.currency || '₹'}{evt.price || 999}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${evt.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-bold text-neutral-300 hover:text-white flex items-center gap-1"
                          >
                            Details <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Resonate is analyzing local events...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-neutral-900/90 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[10px] font-medium px-2.5 py-1 rounded-full bg-neutral-800 border border-white/10 text-neutral-300 hover:border-emerald-500/50 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-white/10 bg-neutral-800/60 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about events, dates, or vibes..."
              className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
