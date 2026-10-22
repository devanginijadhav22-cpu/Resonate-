import { EventItem, UserPreferences, UserInteraction } from '../../types';

export interface PopularityScoreResult {
  score: number;
  reason?: string;
}

export function calculatePopularityScore(event: EventItem, prefs?: Partial<UserPreferences>): PopularityScoreResult {
  // Budget alignment
  const userBudget = prefs?.budget || 3000;
  const eventPrice = event.price || 1500;

  if (eventPrice <= userBudget) {
    return {
      score: 90,
      reason: `Fits within your ${event.currency || '₹'}${userBudget} budget`
    };
  }

  return {
    score: 65
  };
}

export function calculateInteractionBonus(event: EventItem, interactions: UserInteraction[] = []): number {
  if (!interactions || interactions.length === 0) return 0;

  let bonus = 0;
  for (const inter of interactions) {
    if (inter.eventId === event.id) {
      if (inter.type === 'SAVE' || inter.type === 'LIKE') bonus += 15;
      if (inter.type === 'DISLIKE') bonus -= 35;
    }
  }

  // Cross-category feedback: if user repeatedly likes 'club', boost other club events
  const likedCategories = interactions.filter(i => i.type === 'LIKE' || i.type === 'SAVE');
  if (likedCategories.length > 2 && event.category === 'club') {
    bonus += 5;
  }

  return Math.max(-30, Math.min(20, bonus));
}
