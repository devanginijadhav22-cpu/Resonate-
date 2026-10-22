import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/authOptions';
import { getUser, upsertUser, updateUserPreferences } from '../../../lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  const identifier = session?.user?.email || session?.user?.name || 'demo-user';

  let user = await getUser(identifier);
  if (!user && session?.user) {
    user = await upsertUser({
      id: identifier,
      email: session.user.email || 'user@resonate.app',
      name: session.user.name || 'Spotify Explorer',
      image: session.user.image || undefined,
      city: 'Mumbai',
      onboardingCompleted: true
    });
  }

  if (!user) {
    user = await getUser('demo-user');
  }

  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const identifier = session?.user?.email || session?.user?.name || 'demo-user';
    const body = await req.json();

    const updated = await updateUserPreferences(identifier, body);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
