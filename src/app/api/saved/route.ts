import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/authOptions';
import { getSavedEvents, toggleSaveEvent } from '../../../lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || session?.user?.name || 'demo-user';

  const saved = await getSavedEvents(userId);
  return NextResponse.json({ saved });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.name || 'demo-user';
    const body = await req.json();

    const { eventId, eventData } = body;
    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }

    const result = await toggleSaveEvent(userId, eventId, eventData);
    return NextResponse.json({ success: true, saved: result.saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update saved events' }, { status: 500 });
  }
}
