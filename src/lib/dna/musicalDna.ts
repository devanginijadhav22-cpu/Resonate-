import { SpotifyArtist, SpotifyTrack, VibeProfile, MusicalDimensions, GenreData } from '../../types';
import { generatePersona } from '../ai/personaEngine';

export function calculateMusicalDna(artists: SpotifyArtist[], tracks: SpotifyTrack[] = []): VibeProfile {
  if (!artists || artists.length === 0) {
    return {
      persona: 'Music Explorer',
      personaDescription: 'Eager to discover new live sounds and concerts in your city.',
      energy: 55,
      danceability: 55,
      valence: 50,
      acousticness: 35,
      intensity: 60,
      mainstream: 50,
      discovery: 60,
      indie: 50,
      electronic: 40,
      liveMusicAffinity: 75,
      topGenres: [
        { genre: 'Indie Rock', count: 10, score: 75 },
        { genre: 'Alternative', count: 8, score: 65 },
        { genre: 'Electronic', count: 6, score: 50 }
      ],
      keyAttributes: ['Live Concerts', 'Eclectic Beats']
    };
  }

  // 1. Extract and score genres
  const allGenres = artists.flatMap(a => a.genres || []);
  const genreCounts: Record<string, number> = {};
  allGenres.forEach(g => {
    const cleanG = g.trim();
    if (cleanG) {
      genreCounts[cleanG] = (genreCounts[cleanG] || 0) + 1;
    }
  });

  // If few genres found directly on artists, extract or infer from artist/track names
  if (Object.keys(genreCounts).length < 5) {
    const combinedNames = [
      ...artists.map(a => a.name),
      ...tracks.map(t => t.name)
    ].join(' ').toLowerCase();

    if (combinedNames.includes('rock') || combinedNames.includes('arctic') || combinedNames.includes('strokes') || combinedNames.includes('radiohead')) {
      genreCounts['Indie Rock'] = (genreCounts['Indie Rock'] || 0) + 3;
    }
    if (combinedNames.includes('synth') || combinedNames.includes('techno') || combinedNames.includes('house') || combinedNames.includes('fred') || combinedNames.includes('bicep')) {
      genreCounts['Electronic / Synth'] = (genreCounts['Electronic / Synth'] || 0) + 3;
    }
    if (combinedNames.includes('pop') || combinedNames.includes('taylor') || combinedNames.includes('dua') || combinedNames.includes('billie')) {
      genreCounts['Alternative Pop'] = (genreCounts['Alternative Pop'] || 0) + 3;
    }
    if (combinedNames.includes('psychedelic') || combinedNames.includes('tame') || combinedNames.includes('pink') || combinedNames.includes('impala')) {
      genreCounts['Neo-Psychedelia'] = (genreCounts['Neo-Psychedelia'] || 0) + 3;
    }
    if (combinedNames.includes('hip') || combinedNames.includes('hop') || combinedNames.includes('rap') || combinedNames.includes('drake') || combinedNames.includes('kendrick')) {
      genreCounts['Hip Hop & R&B'] = (genreCounts['Hip Hop & R&B'] || 0) + 3;
    }
    if (combinedNames.includes('acoustic') || combinedNames.includes('folk') || combinedNames.includes('phoebe') || combinedNames.includes('sheeran')) {
      genreCounts['Acoustic & Folk'] = (genreCounts['Acoustic & Folk'] || 0) + 3;
    }

    // Default aesthetic anchors if still under 5 genres
    const defaultFallbacks = [
      { name: 'Indie Rock', count: 4 },
      { name: 'Electronic / Synth', count: 3 },
      { name: 'Neo-Psychedelia', count: 3 },
      { name: 'Alternative Pop', count: 2 },
      { name: 'Acoustic & Folk', count: 2 }
    ];

    for (const fb of defaultFallbacks) {
      if (Object.keys(genreCounts).length >= 5) break;
      if (!genreCounts[fb.name]) {
        genreCounts[fb.name] = fb.count;
      }
    }
  }

  const baseScores = [95, 88, 76, 68, 58, 48];
  const sortedRaw = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, sortedRaw[0]?.[1] || 1);

  const sortedGenres: GenreData[] = sortedRaw
    .slice(0, 6)
    .map(([genre, count], idx) => {
      const base = baseScores[idx] ?? Math.max(40, 50 - idx * 5);
      const relativeBoost = Math.round((count / maxCount) * 6);
      return {
        genre: genre.charAt(0).toUpperCase() + genre.slice(1),
        count,
        score: Math.min(98, Math.max(40, base + relativeBoost))
      };
    });

  const genreKeywords = allGenres.join(' ').toLowerCase();

  // 2. Compute 10 Rich Dimensions
  let indieCount = 0;
  let electroCount = 0;
  let acousticCount = 0;
  let rockIntensityCount = 0;
  let danceCount = 0;

  allGenres.forEach(g => {
    const gl = g.toLowerCase();
    if (gl.includes('indie') || gl.includes('folk') || gl.includes('alt') || gl.includes('bedroom') || gl.includes('shoegaze') || gl.includes('lo-fi')) indieCount++;
    if (gl.includes('electronic') || gl.includes('house') || gl.includes('techno') || gl.includes('synth') || gl.includes('edm') || gl.includes('trance') || gl.includes('club')) electroCount++;
    if (gl.includes('acoustic') || gl.includes('folk') || gl.includes('singer-songwriter') || gl.includes('unplugged') || gl.includes('classical')) acousticCount++;
    if (gl.includes('metal') || gl.includes('punk') || gl.includes('hard') || gl.includes('garage') || gl.includes('grunge') || gl.includes('psychedelic')) rockIntensityCount++;
    if (gl.includes('dance') || gl.includes('disco') || gl.includes('funk') || gl.includes('pop') || gl.includes('r&b') || gl.includes('hip hop')) danceCount++;
  });

  const totalTags = Math.max(1, allGenres.length);
  const indie = Math.min(95, Math.max(25, Math.round((indieCount / totalTags) * 220) + 20));
  const electronic = Math.min(95, Math.max(20, Math.round((electroCount / totalTags) * 220) + 15));
  const acousticness = Math.min(90, Math.max(15, Math.round((acousticCount / totalTags) * 200) + 10));
  const danceability = Math.min(95, Math.max(30, Math.round((danceCount / totalTags) * 190) + 25));
  const intensity = Math.min(95, Math.max(25, Math.round((rockIntensityCount / totalTags) * 200) + (electronic > 60 ? 25 : 15)));

  // Popularity & Mainstream vs Discovery
  const avgPopularity = artists.reduce((acc, a) => acc + (a.popularity ?? 50), 0) / artists.length;
  const mainstream = Math.round(Math.min(95, Math.max(15, avgPopularity)));
  const discovery = Math.round(Math.min(95, Math.max(15, 100 - mainstream + 15)));

  // Energy & Valence
  const energy = Math.round(Math.min(95, Math.max(35, (intensity * 0.5) + (danceability * 0.3) + (electronic * 0.2))));
  const valence = Math.round(Math.min(95, Math.max(30, (danceability * 0.6) + (mainstream * 0.2) + 10)));
  const liveMusicAffinity = Math.round(Math.min(98, Math.max(45, (indie * 0.3) + (intensity * 0.3) + (energy * 0.3) + 15)));

  const dimensions: MusicalDimensions = {
    energy,
    danceability,
    valence,
    acousticness,
    intensity,
    mainstream,
    discovery,
    indie,
    electronic,
    liveMusicAffinity
  };

  const personaMeta = generatePersona(dimensions, sortedGenres, artists);

  return {
    ...dimensions,
    persona: personaMeta.persona,
    personaDescription: personaMeta.personaDescription,
    keyAttributes: personaMeta.keyAttributes,
    topGenres: sortedGenres
  };
}
