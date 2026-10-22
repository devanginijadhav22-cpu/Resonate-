import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/authOptions';
import { fetchLiveEvents } from '../../../lib/events';
import { getUserTaste, getUser } from '../../../lib/database';
import { processAssistantQuery } from '../../../lib/ai/assistantEngine';
import { CURATED_EVENTS } from '../../../lib/events/curatedEvents';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.name || 'demo-user';
    const body = await req.json();
    const query = body.query || '';

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const [user, taste] = await Promise.all([
      getUser(userId),
      getUserTaste(userId)
    ]);

    const city = user?.city || 'Mumbai';
    const live = await fetchLiveEvents(city);
    const allEvents = [...CURATED_EVENTS, ...live];

    const response = processAssistantQuery(query, allEvents, taste);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Assistant error details:', error);
    return NextResponse.json({ error: 'Failed to process query' }, { status: 500 });
  }
}
