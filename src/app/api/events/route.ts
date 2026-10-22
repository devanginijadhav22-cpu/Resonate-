import { NextResponse } from 'next/server';
import { fetchLiveEvents } from '../../../lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || 'Mumbai';
  const category = searchParams.get('category') || 'all';
  const query = searchParams.get('query') || '';
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined;

  try {
    let events = await fetchLiveEvents(city, query || undefined);

    if (category && category !== 'all') {
      events = events.filter(e => e.category === category);
    }

    if (query) {
      const q = query.toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.artist && e.artist.toLowerCase().includes(q)) ||
        (e.genre && e.genre.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q))
      );
    }

    if (maxPrice && maxPrice > 0) {
      events = events.filter(e => (e.price || 0) <= maxPrice);
    }

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events', events: [] }, { status: 500 });
  }
}
