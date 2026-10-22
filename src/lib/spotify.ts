import { SpotifyUser, SpotifyArtist, SpotifyTrack } from "../types";

const SPOTIFY_API = "https://api.spotify.com/v1";

export async function fetchProfile(accessToken: string): Promise<SpotifyUser | null> {
  try {
    const res = await fetch(`${SPOTIFY_API}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

async function enrichArtistsWithGenres(accessToken: string, artists: SpotifyArtist[]): Promise<SpotifyArtist[]> {
  const needsEnrichment = artists.filter(a => (!a.genres || a.genres.length === 0) && a.id && !a.id.startsWith('art_'));
  if (needsEnrichment.length === 0) return artists;

  const idsToFetch = Array.from(new Set(needsEnrichment.map(a => a.id))).slice(0, 50);
  try {
    const res = await fetch(`${SPOTIFY_API}/artists?ids=${idsToFetch.join(',')}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      const enrichedMap = new Map<string, SpotifyArtist>();
      (data.artists || []).forEach((ea: any) => {
        if (ea && ea.id) {
          enrichedMap.set(ea.id, ea);
        }
      });
      return artists.map(a => {
        const enriched = enrichedMap.get(a.id);
        if (enriched) {
          return {
            ...a,
            genres: (enriched.genres && enriched.genres.length > 0) ? enriched.genres : a.genres,
            images: (enriched.images && enriched.images.length > 0) ? enriched.images : a.images,
            popularity: enriched.popularity ?? a.popularity
          };
        }
        return a;
      });
    }
  } catch (err) {
    console.warn('[Spotify API] Failed enriching artists with genres:', err);
  }
  return artists;
}

export async function fetchTopArtists(accessToken: string, timeRange: string = "medium_term"): Promise<SpotifyArtist[]> {
  if (!accessToken || accessToken === 'demo_access_token') return [];

  const timeRanges = [timeRange, 'short_term', 'long_term'].filter((v, i, a) => a.indexOf(v) === i);

  for (const tr of timeRanges) {
    try {
      const res = await fetch(`${SPOTIFY_API}/me/top/artists?time_range=${tr}&limit=20`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        console.warn(`[Spotify API] /me/top/artists (${tr}) status: ${res.status} ${res.statusText}`);
        continue;
      }
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        console.info(`[Spotify API] Successfully fetched ${data.items.length} top artists (${tr})`);
        return await enrichArtistsWithGenres(accessToken, data.items);
      }
    } catch (error) {
      console.warn(`[Spotify API] Failed fetching top artists (${tr}):`, error);
    }
  }

  // Fallback: extract artists from recently played tracks or saved tracks
  try {
    const res = await fetch(`${SPOTIFY_API}/me/player/recently-played?limit=30`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      const rawArtists = (data.items || []).flatMap((item: any) => item.track?.artists || []);
      const uniqueArtistsMap = new Map<string, SpotifyArtist>();
      rawArtists.forEach((a: any) => {
        if (a && a.name && !uniqueArtistsMap.has(a.name.toLowerCase())) {
          uniqueArtistsMap.set(a.name.toLowerCase(), {
            id: a.id || `art_${Math.random()}`,
            name: a.name,
            genres: [],
            images: []
          });
        }
      });
      if (uniqueArtistsMap.size > 0) {
        console.info(`[Spotify API] Extracted ${uniqueArtistsMap.size} artists from recently played`);
        const extracted = Array.from(uniqueArtistsMap.values()).slice(0, 20);
        return await enrichArtistsWithGenres(accessToken, extracted);
      }
    }
  } catch (error) {
    console.warn('[Spotify API] Fallback to recently-played artists failed:', error);
  }

  return [];
}

export async function fetchTopTracks(accessToken: string, timeRange: string = "medium_term"): Promise<SpotifyTrack[]> {
  if (!accessToken || accessToken === 'demo_access_token') return [];

  const timeRanges = [timeRange, 'short_term', 'long_term'].filter((v, i, a) => a.indexOf(v) === i);

  for (const tr of timeRanges) {
    try {
      const res = await fetch(`${SPOTIFY_API}/me/top/tracks?time_range=${tr}&limit=20`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        console.warn(`[Spotify API] /me/top/tracks (${tr}) status: ${res.status} ${res.statusText}`);
        continue;
      }
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        console.info(`[Spotify API] Successfully fetched ${data.items.length} top tracks (${tr})`);
        return data.items;
      }
    } catch (error) {
      console.warn(`[Spotify API] Failed fetching top tracks (${tr}):`, error);
    }
  }

  // Fallback to recently-played
  try {
    const res = await fetch(`${SPOTIFY_API}/me/player/recently-played?limit=20`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      const tracks = (data.items || []).map((item: any) => item.track).filter(Boolean);
      if (tracks.length > 0) {
        console.info(`[Spotify API] Extracted ${tracks.length} tracks from recently played`);
        return tracks;
      }
    }
  } catch (error) {
    console.warn('[Spotify API] Fallback to recently-played tracks failed:', error);
  }

  return [];
}
