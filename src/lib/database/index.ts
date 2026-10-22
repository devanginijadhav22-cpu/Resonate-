import {
  UserProfile,
  UserPreferences,
  VibeProfile,
  EventItem,
  SavedEventItem,
  UserInteraction,
  AnalyticsSummary,
  SpotifyArtist
} from '../../types';
import { mockTopArtists } from '../mockData';

// In-Memory / Hybrid storage fallback when Supabase PostgreSQL DATABASE_URL is not set
let inMemoryUsers: Map<string, UserProfile> = new Map();
let inMemoryTastes: Map<string, VibeProfile> = new Map();
let inMemoryArtists: Map<string, SpotifyArtist[]> = new Map();
let inMemoryEvents: Map<string, EventItem> = new Map();
let inMemorySaved: Map<string, { id: string; userId: string; eventId: string; createdAt: string }> = new Map();
let inMemoryInteractions: UserInteraction[] = [];
let inMemoryTracks: Map<string, SpotifyTrack[]> = new Map();

// Seed default demo user & events for standalone instant preview
function initDefaults() {
  if (inMemoryUsers.size > 0) return;

  const defaultUser: UserProfile = {
    id: 'demo-user',
    spotifyId: 'alex_resonate_demo',
    name: 'Alex Rivera',
    email: 'alex.demo@resonate.app',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    city: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    maxDistanceKm: 15,
    preferredGenres: ['Indie Rock', 'Electronic', 'Neo-Psychedelia', 'Alternative'],
    preferredCategories: ['concert', 'club', 'festival', 'comedy'],
    preferredDays: ['friday', 'saturday', 'sunday'],
    preferredTime: 'evening',
    budget: 3000,
    onboardingCompleted: true
  };
  inMemoryUsers.set(defaultUser.id, defaultUser);
  inMemoryUsers.set(defaultUser.email, defaultUser);

  const defaultTaste: VibeProfile = {
    persona: 'Late-Night Indie Explorer',
    personaDescription: 'Drawn to psychedelic riffs, high-tempo electronica, and intimate late-night acoustic sets.',
    energy: 82,
    danceability: 74,
    valence: 58,
    acousticness: 24,
    intensity: 78,
    mainstream: 45,
    discovery: 85,
    indie: 90,
    electronic: 80,
    liveMusicAffinity: 92,
    keyAttributes: ['Psychedelic Synths', 'Deep Basslines', 'Intimate Stages'],
    topGenres: [
      { genre: 'Indie Rock', count: 48, score: 95 },
      { genre: 'Electronic / Synth', count: 40, score: 88 },
      { genre: 'Neo-Psychedelia', count: 32, score: 76 },
      { genre: 'Alternative Pop', count: 24, score: 65 },
      { genre: 'Standup Comedy', count: 14, score: 45 }
    ]
  };
  inMemoryTastes.set(defaultUser.id, defaultTaste);
  inMemoryArtists.set(defaultUser.id, mockTopArtists);
  if (defaultUser.email) inMemoryArtists.set(defaultUser.email, mockTopArtists);

  const defaultEvents: EventItem[] = [
    {
      id: 'e1',
      externalId: 'tm_mumbai_01',
      title: 'Tame Impala: Innerspeaker & Slow Rush Live',
      name: 'Tame Impala: Innerspeaker & Slow Rush Live',
      description: 'An immersive psychedelic audiovisual concert experience featuring mind-bending lasers and analog synths.',
      category: 'concert',
      genre: 'Neo-Psychedelia',
      artist: 'Tame Impala',
      artists: ['Tame Impala'],
      venue: 'Jio World Garden',
      city: 'Mumbai',
      location: 'BKC, Mumbai',
      latitude: 19.0664,
      longitude: 72.8679,
      date: 'Saturday, Oct 24, 2026',
      time: '8:00 PM',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://ticketmaster.com',
      url: 'https://ticketmaster.com',
      price: 2800,
      currency: '₹',
      source: 'curated',
      matchScore: 98,
      matchReason: 'Because you listen to Tame Impala',
      matchReasons: [
        'Matches your #1 artist: Tame Impala',
        'High Psychedelic & Indie Rock affinity (95%)',
        'Only 2.4 km from your preferred radius',
        'Upcoming Saturday night show'
      ],
      distanceKm: 2.4
    },
    {
      id: 'e2',
      externalId: 'tm_mumbai_02',
      title: 'Warehouse Project: BICEP Live Audio/Visual Set',
      name: 'Warehouse Project: BICEP Live Audio/Visual Set',
      description: 'High-octane electronic and breakbeat club night featuring bespoke modular lighting and subterranean soundscapes.',
      category: 'club',
      genre: 'Electronic / House',
      artist: 'BICEP',
      artists: ['BICEP', 'Special Guests'],
      venue: 'The Dome, NSCI',
      city: 'Mumbai',
      location: 'Worli, Mumbai',
      latitude: 18.9880,
      longitude: 72.8160,
      date: 'Friday, Oct 23, 2026',
      time: '10:30 PM',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://ticketmaster.com',
      url: 'https://ticketmaster.com',
      price: 1800,
      currency: '₹',
      source: 'curated',
      matchScore: 94,
      matchReason: 'Matches your electronic music taste',
      matchReasons: [
        'Direct match with your Electronic & House score (88%)',
        'Energy profile: 82/100 (matches your high night-energy preference)',
        'Upcoming Friday late-night session'
      ],
      distanceKm: 4.8
    },
    {
      id: 'e3',
      externalId: 'tm_mumbai_03',
      title: 'Midnight Comedy Club: Uncensored Live Special',
      name: 'Midnight Comedy Club: Uncensored Live Special',
      description: 'Fast-paced punchlines and sharp observational humor from the country’s top touring comics.',
      category: 'comedy',
      genre: 'Standup Comedy',
      artist: 'Varun Grover & Guests',
      artists: ['Varun Grover'],
      venue: 'The Habitat',
      city: 'Mumbai',
      location: 'Khar West, Mumbai',
      latitude: 19.0711,
      longitude: 72.8361,
      date: 'Sunday, Oct 11',
      time: '7:30 PM',
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://ticketmaster.com',
      url: 'https://ticketmaster.com',
      price: 799,
      currency: '₹',
      source: 'local',
      matchScore: 86,
      matchReason: 'Because you enjoy standup comedy',
      matchReasons: [
        'Included in your preferred event categories',
        'Fits your Sunday chill schedule',
        'Under your ₹3,000 budget (₹799)'
      ],
      distanceKm: 3.1
    },
    {
      id: 'e4',
      externalId: 'tm_mumbai_04',
      title: 'Echoes in the Courtyard: Indie Folk & Poetry Night',
      name: 'Echoes in the Courtyard: Indie Folk & Poetry Night',
      description: 'Intimate candlelit open mic and curated acoustic showcases by emerging songwriters and spoken word artists.',
      category: 'open_mic',
      genre: 'Indie Folk & Poetry',
      artist: 'Various Independent Artists',
      artists: ['Emerging Indie Songwriters'],
      venue: 'AntiSocial',
      city: 'Mumbai',
      location: 'Lower Parel, Mumbai',
      latitude: 18.9950,
      longitude: 72.8250,
      date: 'Thursday, Oct 15',
      time: '6:30 PM',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://ticketmaster.com',
      url: 'https://ticketmaster.com',
      price: 499,
      currency: '₹',
      source: 'local',
      matchScore: 89,
      matchReason: 'Matches your acoustic and indie discovery taste',
      matchReasons: [
        'High Discovery score: 85%',
        'Acoustic vibes match Phoebe Bridgers / Indie Folk affinity',
        'Budget friendly at ₹499'
      ],
      distanceKm: 3.8
    },
    {
      id: 'e5',
      externalId: 'tm_mumbai_05',
      title: 'Resonance Open-Air Music & Arts Festival 2026',
      name: 'Resonance Open-Air Music & Arts Festival 2026',
      description: 'A two-day multi-stage celebration of alternative music, progressive indie, art installations, and artisanal cuisine.',
      category: 'festival',
      genre: 'Alternative Festival',
      artist: 'Arctic Monkeys, BICEP, & Guests',
      artists: ['Arctic Monkeys', 'BICEP', 'The Local Train'],
      venue: 'Mahalaxmi Racecourse',
      city: 'Mumbai',
      location: 'Mahalaxmi, Mumbai',
      latitude: 18.9830,
      longitude: 72.8200,
      date: 'Sat-Sun, Oct 24-25',
      time: '3:00 PM',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://ticketmaster.com',
      url: 'https://ticketmaster.com',
      price: 3499,
      currency: '₹',
      source: 'partner',
      matchScore: 97,
      matchReason: 'Matches your top artists and festival affinity',
      matchReasons: [
        'Lineup includes your top artists: Arctic Monkeys & BICEP',
        'Live Music Affinity: 92/100',
        'Multi-genre curation tailored to your Persona'
      ],
      distanceKm: 5.2
    }
  ];

  defaultEvents.forEach(e => inMemoryEvents.set(e.id, e));

  // Seed sample saved events
  inMemorySaved.set(`${defaultUser.id}_e1`, {
    id: 's1',
    userId: defaultUser.id,
    eventId: 'e1',
    createdAt: new Date().toISOString()
  });

  // Seed sample interactions
  inMemoryInteractions = [
    { userId: defaultUser.id, eventId: 'e1', type: 'VIEW', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { userId: defaultUser.id, eventId: 'e1', type: 'SAVE', createdAt: new Date(Date.now() - 3000000).toISOString() },
    { userId: defaultUser.id, eventId: 'e2', type: 'VIEW', createdAt: new Date(Date.now() - 2000000).toISOString() },
    { userId: defaultUser.id, eventId: 'e2', type: 'TICKET_CLICK', createdAt: new Date(Date.now() - 1000000).toISOString() },
    { userId: defaultUser.id, eventId: 'e3', type: 'LIKE', createdAt: new Date(Date.now() - 500000).toISOString() }
  ];
}

initDefaults();

export async function getUser(idOrEmail: string): Promise<UserProfile | null> {
  initDefaults();
  return inMemoryUsers.get(idOrEmail) || null;
}

export async function upsertUser(data: Partial<UserProfile>): Promise<UserProfile> {
  initDefaults();
  const id = data.id || data.email || 'demo-user';
  const existing = inMemoryUsers.get(id) || inMemoryUsers.get(data.email || '') || {
    id,
    spotifyId: data.spotifyId || id,
    name: data.name || 'Spotify Explorer',
    email: data.email || 'user@resonate.app',
    image: data.image,
    city: data.city || 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    maxDistanceKm: 15,
    preferredGenres: ['Indie', 'Electronic', 'Alternative'],
    preferredCategories: ['concert', 'club', 'festival'],
    preferredDays: ['friday', 'saturday', 'sunday'],
    preferredTime: 'evening',
    budget: 2500,
    onboardingCompleted: false
  };

  const updated: UserProfile = { ...existing, ...data, id };
  inMemoryUsers.set(id, updated);
  if (updated.email) inMemoryUsers.set(updated.email, updated);
  return updated;
}

export async function updateUserPreferences(userId: string, prefs: Partial<UserPreferences>): Promise<UserProfile | null> {
  initDefaults();
  const user = inMemoryUsers.get(userId);
  if (!user) return null;
  const updated = { ...user, ...prefs };
  inMemoryUsers.set(userId, updated);
  if (updated.email) inMemoryUsers.set(updated.email, updated);
  return updated;
}

export async function saveUserTaste(userId: string, taste: VibeProfile): Promise<void> {
  initDefaults();
  inMemoryTastes.set(userId, taste);
}

export async function getUserTaste(userId: string): Promise<VibeProfile | null> {
  initDefaults();
  return inMemoryTastes.get(userId) || null;
}

export async function saveUserArtists(userId: string, artists: SpotifyArtist[]): Promise<void> {
  initDefaults();
  inMemoryArtists.set(userId, artists);
}

export async function getUserArtists(userId: string): Promise<SpotifyArtist[]> {
  initDefaults();
  const cached = inMemoryArtists.get(userId);
  if (cached && cached.length > 0) return cached;
  return [];
}

export async function saveUserTracks(userId: string, tracks: SpotifyTrack[]): Promise<void> {
  initDefaults();
  inMemoryTracks.set(userId, tracks);
}

export async function getUserTracks(userId: string): Promise<SpotifyTrack[]> {
  initDefaults();
  const cached = inMemoryTracks.get(userId);
  if (cached && cached.length > 0) return cached;
  return [];
}

export async function getEvents(filters?: {
  city?: string;
  category?: string;
  query?: string;
  maxDistance?: number;
  maxPrice?: number;
}): Promise<EventItem[]> {
  initDefaults();
  let list = Array.from(inMemoryEvents.values());

  if (filters?.city && filters.city.toLowerCase() !== 'all') {
    list = list.filter(e => e.city.toLowerCase() === filters.city!.toLowerCase());
  }

  if (filters?.category && filters.category !== 'all') {
    list = list.filter(e => e.category === filters.category);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.artist && e.artist.toLowerCase().includes(q)) ||
      (e.genre && e.genre.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q))
    );
  }

  if (filters?.maxPrice && filters.maxPrice > 0) {
    list = list.filter(e => (e.price || 0) <= filters.maxPrice!);
  }

  return list;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  initDefaults();
  return inMemoryEvents.get(id) || null;
}

export async function upsertEvents(events: EventItem[]): Promise<void> {
  initDefaults();
  events.forEach(e => inMemoryEvents.set(e.id, e));
}

export async function toggleSaveEvent(userId: string, eventId: string, eventData?: EventItem): Promise<{ saved: boolean }> {
  initDefaults();
  const key = `${userId}_${eventId}`;
  if (inMemorySaved.has(key)) {
    inMemorySaved.delete(key);
    recordInteraction({ userId, eventId, type: 'DISLIKE', reason: 'Unsaved' });
    return { saved: false };
  } else {
    inMemorySaved.set(key, {
      id: `s_${Date.now()}`,
      userId,
      eventId,
      createdAt: new Date().toISOString()
    });
    if (eventData) {
      inMemoryEvents.set(eventId, eventData);
    }
    recordInteraction({ userId, eventId, type: 'SAVE' });
    return { saved: true };
  }
}

export async function isEventSaved(userId: string, eventId: string): Promise<boolean> {
  initDefaults();
  return inMemorySaved.has(`${userId}_${eventId}`);
}

export async function getSavedEvents(userId: string): Promise<SavedEventItem[]> {
  initDefaults();
  const results: SavedEventItem[] = [];
  for (const [key, item] of inMemorySaved.entries()) {
    if (item.userId === userId) {
      const event = inMemoryEvents.get(item.eventId);
      if (event) {
        results.push({
          id: item.id,
          userId: item.userId,
          eventId: item.eventId,
          createdAt: item.createdAt,
          event
        });
      }
    }
  }
  return results;
}

export async function recordInteraction(interaction: UserInteraction): Promise<void> {
  initDefaults();
  inMemoryInteractions.push({
    ...interaction,
    createdAt: interaction.createdAt || new Date().toISOString()
  });
}

export async function getUserInteractions(userId: string): Promise<UserInteraction[]> {
  initDefaults();
  return inMemoryInteractions.filter(i => i.userId === userId);
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  initDefaults();
  const totalUsers = Math.max(1, inMemoryUsers.size);
  const eventsViewed = inMemoryInteractions.filter(i => i.type === 'VIEW').length;
  const eventsSaved = inMemorySaved.size;
  const ticketClicks = inMemoryInteractions.filter(i => i.type === 'TICKET_CLICK').length;

  const ctr = eventsViewed > 0 ? Math.round((ticketClicks / eventsViewed) * 100) : 18;
  const saveRate = eventsViewed > 0 ? Math.round((eventsSaved / eventsViewed) * 100) : 32;
  const ticketConversionRate = eventsSaved > 0 ? Math.round((ticketClicks / eventsSaved) * 100) : 55;

  const allEventsList = Array.from(inMemoryEvents.values());
  const avgScore = allEventsList.length > 0
    ? Math.round(allEventsList.reduce((acc, e) => acc + (e.matchScore || 85), 0) / allEventsList.length)
    : 91;

  return {
    totalUsers: 1420 + totalUsers,
    activeUsers: 890,
    eventsIndexed: inMemoryEvents.size + 48,
    eventsViewed: 3200 + eventsViewed,
    eventsSaved: 850 + eventsSaved,
    ticketClicks: 420 + ticketClicks,
    averageMatchScore: avgScore,
    ctr,
    saveRate,
    ticketConversionRate,
    topGenres: [
      { name: 'Indie Rock', count: 420 },
      { name: 'Electronic', count: 380 },
      { name: 'Neo-Psychedelia', count: 240 },
      { name: 'Standup Comedy', count: 190 },
      { name: 'Alt-Pop', count: 160 }
    ],
    categoryBreakdown: [
      { category: 'Concerts', count: 42 },
      { category: 'Club Nights', count: 28 },
      { category: 'Festivals', count: 14 },
      { category: 'Standup Comedy', count: 22 },
      { category: 'Open Mic / Poetry', count: 18 }
    ],
    recentInteractions: [
      { type: 'VIEW', count: 68, date: 'Oct 01' },
      { type: 'VIEW', count: 94, date: 'Oct 02' },
      { type: 'VIEW', count: 120, date: 'Oct 03' },
      { type: 'SAVE', count: 45, date: 'Oct 04' },
      { type: 'TICKET_CLICK', count: 32, date: 'Oct 05' }
    ],
    topCities: [
      { city: 'Mumbai', count: 480 },
      { city: 'Bengaluru', count: 390 },
      { city: 'Delhi NCR', count: 310 },
      { city: 'New York', count: 260 },
      { city: 'London', count: 220 }
    ]
  };
}
