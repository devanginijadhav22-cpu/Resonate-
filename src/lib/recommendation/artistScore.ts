import { EventItem, SpotifyArtist } from '../../types';

export interface ArtistScoreResult {
  score: number;
  matchedArtist?: string;
  reason?: string;
}

export function calculateArtistScore(event: EventItem, topArtists: SpotifyArtist[] = []): ArtistScoreResult {
  if (!topArtists || topArtists.length === 0) {
    return { score: 70 };
  }

  const eventText = `${event.title} ${event.artist || ''} ${(event.artists || []).join(' ')}`.toLowerCase();

  for (const artist of topArtists) {
    const artistName = artist.name.toLowerCase();
    if (eventText.includes(artistName)) {
      return {
        score: 100,
        matchedArtist: artist.name,
        reason: `Direct match: You listen to ${artist.name}`
      };
    }
  }

  // Partial or word overlap match
  for (const artist of topArtists) {
    const parts = artist.name.toLowerCase().split(' ').filter(p => p.length > 3);
    for (const part of parts) {
      if (eventText.includes(part)) {
        return {
          score: 85,
          matchedArtist: artist.name,
          reason: `Similar style to ${artist.name}`
        };
      }
    }
  }

  return { score: 50 };
}
