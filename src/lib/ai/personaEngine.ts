import { MusicalDimensions, GenreData, SpotifyArtist } from '../../types';

export interface GeneratedPersona {
  persona: string;
  personaDescription: string;
  keyAttributes: string[];
}

export function generatePersona(
  dims: MusicalDimensions,
  topGenres: GenreData[],
  topArtists: SpotifyArtist[]
): GeneratedPersona {
  const { energy, danceability, valence, acousticness, intensity, mainstream, discovery, indie, electronic, liveMusicAffinity } = dims;

  // Evaluate dominant traits
  if (electronic >= 75 && energy >= 70) {
    return {
      persona: 'Electronic Night Owl',
      personaDescription: 'Fueled by subterranean basslines, modular synths, and relentless four-on-the-floor rhythms. Thrives in warehouse club sets and sunrise dancefloors.',
      keyAttributes: ['Modular Synths', 'Deep Club Sets', 'Underground Raves']
    };
  }

  if (indie >= 70 && discovery >= 65) {
    return {
      persona: 'Late-Night Indie Explorer',
      personaDescription: 'Gravitates toward dreamy reverb, introspective songwriting, and underground indie acts before they hit festival mainstages.',
      keyAttributes: ['Shoegaze & Alt-Rock', 'Intimate Venues', 'Crate Digging']
    };
  }

  if (liveMusicAffinity >= 85 && intensity >= 70) {
    return {
      persona: 'Festival Energy Chaser',
      personaDescription: 'Lives for the raw rush of front-row festival crowds, blistering guitar solos, and unforgettable stadium encores.',
      keyAttributes: ['Multi-Stage Festivals', 'Mosh & Momentum', 'Headlining Encores']
    };
  }

  if (acousticness >= 65 && valence >= 55) {
    return {
      persona: 'Acoustic Soul Seeker',
      personaDescription: 'Cherishes organic acoustic strings, warm vocal harmonies, and intimate open-mic sessions in cozy listening rooms.',
      keyAttributes: ['Warm Harmonies', 'Unplugged Sets', 'Candlelit Open Mics']
    };
  }

  if (mainstream >= 75 && energy >= 65) {
    return {
      persona: 'Mainstream Concert Hunter',
      personaDescription: 'Always has tickets to the biggest world tours, chart-topping pop anthems, and spectacular stadium productions.',
      keyAttributes: ['Arena World Tours', 'Chart-Toppers', 'High Production Shows']
    };
  }

  if (danceability >= 75 && valence >= 65) {
    return {
      persona: 'Weekend Party Seeker',
      personaDescription: 'Brings infectious rhythm and positive vibes wherever they go. First to hit the dancefloor for funk, disco, and uplifting house.',
      keyAttributes: ['Groovy Basslines', 'Uplifting Disco', 'Weekend Socials']
    };
  }

  if (discovery >= 75 && indie >= 60) {
    return {
      persona: 'Alternative Music Explorer',
      personaDescription: 'Constantly seeking genre-defying sonic experiments, avant-garde collectives, and hidden gems beyond algorithmic playlists.',
      keyAttributes: ['Avant-Garde Rhythms', 'B-Sides & Demos', 'Art-Rock Collectives']
    };
  }

  // Fallback dynamic persona based on top genre
  const primaryGenre = topGenres[0]?.genre || (topArtists[0]?.genres?.[0]) || 'Eclectic';
  const cleanGenre = primaryGenre.split(' ')[0].replace(/[^a-zA-Z]/g, '');

  return {
    persona: `${cleanGenre} Aficionado`,
    personaDescription: `Passionate about the sonic nuances of ${primaryGenre} and authentic live performances that echo their Spotify listening rotation.`,
    keyAttributes: [`${cleanGenre} Live`, 'Curated Sets', 'Signature Sound']
  };
}
