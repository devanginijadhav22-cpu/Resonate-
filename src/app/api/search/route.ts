import { NextResponse } from 'next/server';
import { fetchLiveEvents } from '../../../lib/events';
import { CURATED_EVENTS } from '../../../lib/events/curatedEvents';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ results: { events: [], artists: [], venues: [], genres: [] } });
  }

  const allEvents = [...CURATED_EVENTS, ...(await fetchLiveEvents('Mumbai'))];
  const seenEvents = new Set<string>();
  const events = allEvents.filter(e => {
    if (seenEvents.has(e.id)) return false;
    const match =
      e.title.toLowerCase().includes(q) ||
      (e.artist && e.artist.toLowerCase().includes(q)) ||
      (e.genre && e.genre.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q)) ||
      (e.city && e.city.toLowerCase().includes(q));
    if (match) seenEvents.add(e.id);
    return match;
  });

  // Extract unique matched artists
  const artists = Array.from(
    new Set(
      allEvents
        .flatMap(e => [e.artist, ...(e.artists || [])])
        .filter((a): a is string => Boolean(a && a.toLowerCase().includes(q)))
    )
  ).slice(0, 5);

  // Extract unique matched venues
  const venues = Array.from(
    new Set(
      allEvents
        .map(e => e.venue)
        .filter((v): v is string => Boolean(v && v.toLowerCase().includes(q)))
    )
  ).slice(0, 5);

  // Extract unique matched genres
  const genres = Array.from(
    new Set(
      allEvents
        .map(e => e.genre)
        .filter((g): g is string => Boolean(g && g.toLowerCase().includes(q)))
    )
  ).slice(0, 5);

  return NextResponse.json({
    results: {
      events: events.slice(0, 8),
      artists,
      venues,
      genres
    }
  });
}
