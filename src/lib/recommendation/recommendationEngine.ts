import {
  EventItem,
  VibeProfile,
  SpotifyArtist,
  UserPreferences,
  UserInteraction
} from '../../types';
import { calculateTasteScore } from './tasteScore';
import { calculateGenreScore } from './genreScore';
import { calculateArtistScore } from './artistScore';
import { calculateDistanceScore } from './distanceScore';
import { calculateEventTypeScore } from './eventTypeScore';
import { calculateTimeScore } from './timeScore';
import { calculatePopularityScore, calculateInteractionBonus } from './popularityScore';

export interface RecommendationWeights {
  taste: number;        // default: 0.35
  artistGenre: number;  // default: 0.20
  distance: number;     // default: 0.15
  eventType: number;    // default: 0.10
  time: number;         // default: 0.10
  popularity: number;   // default: 0.05
  personalHistory: number; // default: 0.05
}

export const DEFAULT_WEIGHTS: RecommendationWeights = {
  taste: 0.35,
  artistGenre: 0.20,
  distance: 0.15,
  eventType: 0.10,
  time: 0.10,
  popularity: 0.05,
  personalHistory: 0.05
};

export interface ScoredEventResult {
  event: EventItem;
  breakdown: {
    taste: number;
    artistGenre: number;
    distance: number;
    eventType: number;
    time: number;
    popularity: number;
    historyBonus: number;
    finalScore: number;
  };
}

export function rankEvent(
  event: EventItem,
  vibe: VibeProfile,
  topArtists: SpotifyArtist[] = [],
  prefs?: Partial<UserPreferences>,
  interactions: UserInteraction[] = [],
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): EventItem {
  const taste = calculateTasteScore(event, vibe);
  const artist = calculateArtistScore(event, topArtists);
  const genre = calculateGenreScore(event, vibe.topGenres || []);
  const distance = calculateDistanceScore(event, prefs);
  const eventType = calculateEventTypeScore(event, prefs);
  const time = calculateTimeScore(event, prefs);
  const popularity = calculatePopularityScore(event, prefs);
  const historyBonus = calculateInteractionBonus(event, interactions);

  const artistGenreScore = Math.max(artist.score, genre.score);

  const rawScore =
    taste.score * weights.taste +
    artistGenreScore * weights.artistGenre +
    distance.score * weights.distance +
    eventType.score * weights.eventType +
    time.score * weights.time +
    popularity.score * weights.popularity +
    historyBonus;

  const finalScore = Math.min(99, Math.max(50, Math.round(rawScore)));

  // Collect transparent, genuine match reasons (never fake)
  const reasons: string[] = [];
  if (artist.reason) reasons.push(artist.reason);
  else if (genre.reason) reasons.push(genre.reason);

  if (distance.reason) reasons.push(distance.reason);
  if (taste.reason && reasons.length < 3) reasons.push(taste.reason);
  if (time.reason && reasons.length < 3) reasons.push(time.reason);
  if (popularity.reason && reasons.length < 3) reasons.push(popularity.reason);

  const primaryReason = reasons[0] || `Matches your ${vibe.persona} profile`;

  return {
    ...event,
    matchScore: finalScore,
    matchReason: primaryReason,
    matchReasons: reasons.slice(0, 4),
    distanceKm: distance.distanceKm
  };
}

export function rankEvents(
  events: EventItem[],
  vibe: VibeProfile,
  topArtists: SpotifyArtist[] = [],
  prefs?: Partial<UserPreferences>,
  interactions: UserInteraction[] = [],
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): EventItem[] {
  return events
    .map(e => rankEvent(e, vibe, topArtists, prefs, interactions, weights))
    .sort((a, b) => b.matchScore - a.matchScore);
}
