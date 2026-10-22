import { EventItem, GenreData } from '../../types';

export interface GenreScoreResult {
  score: number;
  matchedGenre?: string;
  reason?: string;
}

export function calculateGenreScore(event: EventItem, topGenres: GenreData[] = []): GenreScoreResult {
  if (!topGenres || topGenres.length === 0) {
    return { score: 65 };
  }

  const eventGenre = (event.genre || '').toLowerCase();
  const eventDesc = `${event.title} ${event.description || ''} ${event.category}`.toLowerCase();

  for (const g of topGenres) {
    const genreName = g.genre.toLowerCase();
    if (eventGenre.includes(genreName) || eventDesc.includes(genreName)) {
      return {
        score: Math.min(100, Math.max(75, g.score)),
        matchedGenre: g.genre,
        reason: `Matches your top genre: ${g.genre}`
      };
    }
  }

  // Cross-genre semantic groupings
  const electronicKeywords = ['electronic', 'techno', 'house', 'edm', 'club', 'dj'];
  const indieKeywords = ['indie', 'alternative', 'alt-rock', 'shoegaze', 'folk'];
  const comedyKeywords = ['comedy', 'stand-up', 'standup', 'humor', 'open mic'];

  for (const g of topGenres) {
    const gl = g.genre.toLowerCase();
    if (electronicKeywords.some(k => gl.includes(k)) && electronicKeywords.some(k => eventDesc.includes(k) || eventGenre.includes(k))) {
      return { score: 85, matchedGenre: g.genre, reason: `Matches your electronic music taste` };
    }
    if (indieKeywords.some(k => gl.includes(k)) && indieKeywords.some(k => eventDesc.includes(k) || eventGenre.includes(k))) {
      return { score: 85, matchedGenre: g.genre, reason: `Matches your indie and alternative sound` };
    }
    if (comedyKeywords.some(k => gl.includes(k)) && (event.category === 'comedy' || comedyKeywords.some(k => eventDesc.includes(k)))) {
      return { score: 80, matchedGenre: 'Standup Comedy', reason: `Because you enjoy comedy and live sets` };
    }
  }

  return { score: 55 };
}
