import assert from 'node:assert';
import { calculateHaversineDistance } from '../src/lib/recommendation/distanceScore';
import { calculateArtistScore } from '../src/lib/recommendation/artistScore';
import { calculateGenreScore } from '../src/lib/recommendation/genreScore';
import { calculateMusicalDna } from '../src/lib/dna/musicalDna';
import { generatePersona } from '../src/lib/ai/personaEngine';
import { rankEvent } from '../src/lib/recommendation/recommendationEngine';
import { normalizeTicketmasterEvent } from '../src/lib/events/normalize';
import { processAssistantQuery } from '../src/lib/ai/assistantEngine';
import { EventItem, VibeProfile } from '../src/types';

console.log('--- Running Resonate Business Logic Tests ---\n');

// 1. Distance Calculation Test
{
  // Mumbai BKC to Worli ~ 9.5 km
  const dist = calculateHaversineDistance(19.0664, 72.8679, 18.9880, 72.8160);
  assert(dist > 5 && dist < 15, `Expected distance between 5 and 15 km, got ${dist}`);
  console.log('✓ Distance calculation (Haversine) verified:', dist, 'km');
}

// 2. Artist Scoring Test
{
  const mockEvent: EventItem = {
    id: 'e1',
    title: 'Tame Impala Live Tour',
    artist: 'Tame Impala',
    venue: 'Arena',
    city: 'Mumbai',
    category: 'concert',
    date: '2026-10-10',
    source: 'test',
    matchScore: 0
  };
  const topArtists = [{ id: 'a1', name: 'Tame Impala', genres: ['neo-psychedelic'], images: [] }];
  const result = calculateArtistScore(mockEvent, topArtists as any);
  assert.strictEqual(result.score, 100);
  assert(result.reason?.includes('Tame Impala'));
  console.log('✓ Artist direct match scoring verified: 100%');
}

// 3. Genre Similarity Test
{
  const mockEvent: EventItem = {
    id: 'e2',
    title: 'Subterranean Techno & Acid Night',
    category: 'club',
    genre: 'Electronic Techno',
    venue: 'Underground',
    city: 'Mumbai',
    date: '2026-10-11',
    source: 'test',
    matchScore: 0
  };
  const topGenres = [{ genre: 'Electronic / Synth', count: 40, score: 88 }];
  const result = calculateGenreScore(mockEvent, topGenres);
  assert(result.score >= 80, `Expected genre score >= 80, got ${result.score}`);
  console.log('✓ Genre similarity scoring verified:', result.score, '%');
}

// 4. Dynamic Persona Generation Test
{
  const dims = {
    energy: 85,
    danceability: 75,
    valence: 60,
    acousticness: 20,
    intensity: 80,
    mainstream: 40,
    discovery: 85,
    indie: 90,
    electronic: 80,
    liveMusicAffinity: 95
  };
  const persona = generatePersona(dims, [{ genre: 'Indie Rock', count: 40, score: 90 }], []);
  assert(persona.persona.length > 0);
  assert(persona.keyAttributes.length > 0);
  console.log('✓ Dynamic persona generated:', persona.persona);
}

// 5. Overall Recommendation Ranking Test
{
  const mockEvent: EventItem = {
    id: 'e3',
    title: 'BICEP Live at NSCI',
    artist: 'BICEP',
    category: 'club',
    genre: 'Electronic / House',
    venue: 'The Dome',
    city: 'Mumbai',
    date: 'Friday, Oct 9',
    source: 'test',
    matchScore: 0,
    distanceKm: 3.5,
    price: 1800
  };
  const vibe: VibeProfile = {
    persona: 'Electronic Night Owl',
    energy: 85,
    danceability: 80,
    valence: 60,
    acousticness: 20,
    intensity: 75,
    mainstream: 50,
    discovery: 80,
    indie: 60,
    electronic: 90,
    liveMusicAffinity: 85,
    topGenres: [{ genre: 'Electronic', count: 50, score: 90 }]
  };
  const ranked = rankEvent(mockEvent, vibe, [{ id: 'a2', name: 'BICEP', genres: ['electronic'], images: [] }] as any);
  assert(ranked.matchScore >= 85, `Expected score >= 85, got ${ranked.matchScore}`);
  assert(ranked.matchReasons && ranked.matchReasons.length > 0);
  console.log('✓ Recommendation ranked event:', ranked.title, 'Score:', ranked.matchScore, '% Reasons:', ranked.matchReasons);
}

// 6. Natural Language Assistant Query Parsing Test
{
  const sampleEvents: EventItem[] = [
    { id: '1', title: 'Friday Rave', category: 'club', genre: 'Electronic', venue: 'V1', city: 'Mumbai', date: 'This Friday', source: 'test', matchScore: 90, price: 800 },
    { id: '2', title: 'Sunday Acoustic', category: 'open_mic', genre: 'Acoustic', venue: 'V2', city: 'Mumbai', date: 'This Sunday', source: 'test', matchScore: 85, price: 400 }
  ];
  const queryRes = processAssistantQuery('Show me electronic events under 1000', sampleEvents);
  assert.strictEqual(queryRes.matchedEvents.length, 1);
  assert.strictEqual(queryRes.matchedEvents[0].id, '1');
  console.log('✓ Assistant intent extraction verified: Matched event', queryRes.matchedEvents[0].title);
}

console.log('\n--- All Resonate Unit Tests Passed Successfully! ---');
