import { EventItem, UserPreferences } from '../../types';

export interface TimeScoreResult {
  score: number;
  reason?: string;
}

export function calculateTimeScore(event: EventItem, prefs?: Partial<UserPreferences>): TimeScoreResult {
  const preferredDays = (prefs?.preferredDays || ['friday', 'saturday', 'sunday']).map(d => d.toLowerCase());
  const dateStr = (event.date || '').toLowerCase();

  const isWeekendEvent =
    dateStr.includes('friday') ||
    dateStr.includes('saturday') ||
    dateStr.includes('sunday') ||
    dateStr.includes('weekend');

  if (isWeekendEvent) {
    return {
      score: 95,
      reason: 'Fits your preferred weekend schedule'
    };
  }

  return {
    score: 75,
    reason: 'Fits your weekly routine'
  };
}
