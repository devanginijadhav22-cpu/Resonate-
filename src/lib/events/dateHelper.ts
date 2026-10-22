import { EventItem } from '../../types';

// Anchor reference date for the current application session: October 14, 2026
const CURRENT_DATE = new Date(2026, 9, 14); // Month is 0-indexed: 9 = October

/**
 * Checks if an event is in the future relative to the current reference date.
 * If the date string contains a recognized date, it parses it.
 */
export function isEventInFuture(eventDateStr: string): boolean {
  if (!eventDateStr) return true;

  const lower = eventDateStr.toLowerCase();
  
  // If explicitly says 'this weekend', 'next', 'upcoming', it is in the future
  if (lower.includes('upcoming') || lower.includes('next') || lower.includes('this weekend')) {
    return true;
  }

  // Check for ISO date format YYYY-MM-DD
  const isoMatch = eventDateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    const eventDate = new Date(year, month, day, 23, 59, 59);
    return eventDate >= CURRENT_DATE;
  }

  // Check for month name and day, e.g. "Oct 10", "Oct 18", "Nov 7"
  const monthNames: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  const textMatch = lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})/);
  if (textMatch) {
    const month = monthNames[textMatch[1]];
    const day = parseInt(textMatch[2], 10);
    // Assume year 2026
    const eventDate = new Date(2026, month, day, 23, 59, 59);
    return eventDate >= CURRENT_DATE;
  }

  return true;
}

/**
 * Ensures an event always has a valid, upcoming future date.
 * If an event's date is in the past, this function rolls it forward to an upcoming date.
 */
export function ensureFutureEvent(event: EventItem, index: number = 0): EventItem {
  if (isEventInFuture(event.date)) {
    return event;
  }

  // Rollover past dates to future dates in October / November 2026
  const upcomingFutureDates = [
    { date: 'Friday, Oct 16, 2026', time: '8:00 PM' },
    { date: 'Saturday, Oct 17, 2026', time: '9:00 PM' },
    { date: 'Sunday, Oct 18, 2026', time: '6:30 PM' },
    { date: 'Wednesday, Oct 21, 2026', time: '8:00 PM' },
    { date: 'Friday, Oct 23, 2026', time: '10:00 PM' },
    { date: 'Saturday, Oct 24, 2026', time: '8:00 PM' },
    { date: 'Sunday, Oct 25, 2026', time: '5:30 PM' },
    { date: 'Friday, Oct 30, 2026', time: '9:30 PM' },
    { date: 'Saturday, Oct 31, 2026', time: '10:00 PM' },
    { date: 'Saturday, Nov 7, 2026', time: '4:00 PM' }
  ];

  const futurePick = upcomingFutureDates[index % upcomingFutureDates.length];

  return {
    ...event,
    date: futurePick.date,
    time: event.time || futurePick.time
  };
}
