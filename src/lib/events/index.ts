import { EventItem } from '../../types';
import { CURATED_EVENTS } from './curatedEvents';
import { normalizeTicketmasterEvent } from './normalize';
import { ensureFutureEvent, isEventInFuture } from './dateHelper';

// In-memory cache for external event API calls
const cache: Map<string, { data: EventItem[]; timestamp: number }> = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchLiveEvents(city: string = 'Mumbai', keyword?: string): Promise<EventItem[]> {
  const cacheKey = `${city.toLowerCase()}_${(keyword || 'all').toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;
  let ticketmasterEvents: EventItem[] = [];

  if (apiKey && apiKey !== 'your_ticketmaster_api_key_here') {
    try {
      const isAll = !keyword || keyword === 'all';
      const nowIso = new Date().toISOString().split('.')[0] + 'Z';

      const musicUrl = isAll
        ? `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${encodeURIComponent(city)}&startDateTime=${nowIso}&sort=date,asc&size=16`
        : `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${encodeURIComponent(city)}&classificationName=Music&startDateTime=${nowIso}&sort=date,asc&keyword=${encodeURIComponent(keyword)}`;

      const comedyUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${encodeURIComponent(city)}&classificationName=Comedy&startDateTime=${nowIso}&sort=date,asc&size=6`;

      const [musicRes, comedyRes] = await Promise.all([
        fetch(musicUrl, { next: { revalidate: 600 } }).then(r => r.json()).catch(() => ({})),
        fetch(comedyUrl, { next: { revalidate: 600 } }).then(r => r.json()).catch(() => ({}))
      ]);

      const rawMusic = musicRes._embedded?.events || [];
      const rawComedy = comedyRes._embedded?.events || [];
      const combinedRaw = [...rawMusic, ...rawComedy];

      ticketmasterEvents = combinedRaw.map((e: any) => normalizeTicketmasterEvent(e, city, keyword));
    } catch (err) {
      console.warn('Ticketmaster API fetch warning, falling back to curated cache:', err);
    }
  }

  // Filter curated events for the requested city or fallback to all curated
  const cityCurated = CURATED_EVENTS.filter(e => e.city.toLowerCase() === city.toLowerCase());
  const fallbackCurated = cityCurated.length > 0 ? cityCurated : CURATED_EVENTS;

  // Merge unique by title / externalId and strictly ensure all events are in the future
  const seen = new Set<string>();
  const combined: EventItem[] = [];

  [...ticketmasterEvents, ...fallbackCurated].forEach((item, idx) => {
    const key = (item.externalId || item.title).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      // Guarantee the event is strictly in the future
      const futureItem = ensureFutureEvent(item, idx);
      if (isEventInFuture(futureItem.date)) {
        combined.push(futureItem);
      }
    }
  });

  cache.set(cacheKey, { data: combined, timestamp: Date.now() });
  return combined;
}

// Backwards compatibility export
export async function fetchTicketmasterEvents(city: string, keyword?: string): Promise<EventItem[]> {
  return fetchLiveEvents(city, keyword);
}
