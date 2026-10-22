import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/authOptions';
import { recordInteraction } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.name || 'demo-user';
    const body = await req.json();

    const { eventId, type, reason } = body;
    if (!eventId || !type) {
      return NextResponse.json({ error: 'Missing eventId or type' }, { status: 400 });
    }

    await recordInteraction({
      userId,
      eventId,
      type,
      reason
    });

    return NextResponse.json({ success: true, message: 'Feedback recorded' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}
