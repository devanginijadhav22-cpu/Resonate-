import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/authOptions';
import { fetchLiveEvents } from '../../../../lib/events';
import { getUserTaste, isEventSaved } from '../../../../lib/database';
import { generateEventReasoning } from '../../../../lib/ai/eventReasoning';
import { CURATED_EVENTS } from '../../../../lib/events/curatedEvents';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  // Search curated first, then live events
  let event = CURATED_EVENTS.find(e => e.id === id || e.externalId === id);

  if (!event) {
    const liveEvents = await fetchLiveEvents('Mumbai');
    event = liveEvents.find(e => e.id === id || e.externalId === id);
  }

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const taste = await getUserTaste(userId);
  const reasoning = generateEventReasoning(event, taste);
  const saved = await isEventSaved(userId, event.id);

  // Find similar events (same category or genre)
  const allEvents = await fetchLiveEvents(event.city);
  const similarEvents = allEvents
    .filter(e => e.id !== event!.id && (e.category === event!.category || e.genre === event!.genre))
    .slice(0, 3);

  return NextResponse.json({
    event,
    reasoning,
    saved,
    similarEvents
  });
}
