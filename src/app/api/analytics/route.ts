import { NextResponse } from 'next/server';
import { getAnalytics } from '../../../lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getAnalytics();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
