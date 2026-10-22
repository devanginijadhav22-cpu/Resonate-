import { EventItem, EventCategory, UserPreferences } from '../../types';

export interface EventTypeScoreResult {
  score: number;
  reason?: string;
}

export function calculateEventTypeScore(event: EventItem, prefs?: Partial<UserPreferences>): EventTypeScoreResult {
  const preferred = prefs?.preferredCategories || ['concert', 'club', 'festival'];

  if (preferred.includes(event.category)) {
    const formattedCat = event.category.replace('_', ' ');
    return {
      score: 100,
      reason: `Matches your preferred experience: ${formattedCat.charAt(0).toUpperCase() + formattedCat.slice(1)}`
    };
  }

  // Related categories
  if (
    (event.category === 'dj' && preferred.includes('club')) ||
    (event.category === 'poetry' && preferred.includes('open_mic'))
  ) {
    return {
      score: 85,
      reason: `Related to your preferred event categories`
    };
  }

  return { score: 60 };
}
