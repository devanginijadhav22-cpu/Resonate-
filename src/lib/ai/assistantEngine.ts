import { EventItem, VibeProfile } from '../../types';

export interface AssistantQueryResponse {
  reply: string;
  matchedEvents: EventItem[];
  appliedFilters: {
    category?: string;
    budget?: number;
    day?: string;
    nearOnly?: boolean;
  };
}

export function processAssistantQuery(
  query: string,
  events: EventItem[],
  vibe?: VibeProfile | null
): AssistantQueryResponse {
  const q = query.toLowerCase().trim();
  const filters: AssistantQueryResponse['appliedFilters'] = {};
  let filtered = [...events];

  // 1. Detect Category intent
  if (q.includes('electronic') || q.includes('club') || q.includes('rave') || q.includes('dj') || q.includes('techno') || q.includes('house')) {
    filters.category = 'club';
    filtered = filtered.filter(e => e.category === 'club' || e.category === 'dj' || (e.genre || '').toLowerCase().includes('electronic'));
  } else if (q.includes('comedy') || q.includes('laugh') || q.includes('standup') || q.includes('stand-up') || q.includes('comic')) {
    filters.category = 'comedy';
    filtered = filtered.filter(e => e.category === 'comedy');
  } else if (q.includes('acoustic') || q.includes('chill') || q.includes('poetry') || q.includes('open mic') || q.includes('unplugged')) {
    filters.category = 'open_mic';
    filtered = filtered.filter(e => e.category === 'open_mic' || e.category === 'poetry' || (e.genre || '').toLowerCase().includes('acoustic'));
  } else if (q.includes('concert') || q.includes('gig') || q.includes('band') || q.includes('live')) {
    filters.category = 'concert';
    filtered = filtered.filter(e => e.category === 'concert' || e.category === 'festival');
  }

  // 2. Detect Budget intent
  const budgetMatch = q.match(/(?:under|below|less than|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) || q.match(/(\d+)\s*(?:₹|rs|inr)/i);
  if (budgetMatch && budgetMatch[1]) {
    const maxBudget = parseInt(budgetMatch[1], 10);
    filters.budget = maxBudget;
    filtered = filtered.filter(e => (e.price || 0) <= maxBudget);
  }

  // 3. Detect Timing intent (Saturday, Weekend, Friday, etc.)
  if (q.includes('saturday')) {
    filters.day = 'Saturday';
    filtered = filtered.filter(e => e.date.toLowerCase().includes('saturday') || e.date.toLowerCase().includes('oct 10') || e.date.toLowerCase().includes('weekend'));
  } else if (q.includes('friday')) {
    filters.day = 'Friday';
    filtered = filtered.filter(e => e.date.toLowerCase().includes('friday') || e.date.toLowerCase().includes('oct 9') || e.date.toLowerCase().includes('weekend'));
  } else if (q.includes('weekend')) {
    filters.day = 'Weekend';
    filtered = filtered.filter(e => e.date.toLowerCase().includes('weekend') || e.date.toLowerCase().includes('saturday') || e.date.toLowerCase().includes('friday') || e.date.toLowerCase().includes('sunday'));
  }

  // 4. Proximity / Near me
  if (q.includes('near') || q.includes('close')) {
    filters.nearOnly = true;
    filtered = filtered.filter(e => (e.distanceKm || 10) <= 5);
  }

  // Sort by match score
  filtered.sort((a, b) => b.matchScore - a.matchScore);
  const topEvents = filtered.slice(0, 3);

  if (topEvents.length === 0) {
    return {
      reply: `I couldn't find any upcoming live events matching those specific filters. Try expanding your radius or browsing all events in your city!`,
      matchedEvents: events.slice(0, 2),
      appliedFilters: filters
    };
  }

  const topPick = topEvents[0];
  let replyText = `I found ${filtered.length} event${filtered.length > 1 ? 's' : ''} tailored to you! My top recommendation is "${topPick.title}" at ${topPick.venue} (${topPick.matchScore}% Match).`;
  if (topPick.distanceKm) {
    replyText += ` It's only ${topPick.distanceKm} km away and fits your ${vibe?.persona || 'musical'} taste profile.`;
  }

  return {
    reply: replyText,
    matchedEvents: topEvents,
    appliedFilters: filters
  };
}
