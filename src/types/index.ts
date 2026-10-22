export type EventCategory =
  | 'all'
  | 'concert'
  | 'festival'
  | 'club'
  | 'dj'
  | 'comedy'
  | 'open_mic'
  | 'poetry'
  | 'arts'
  | 'karaoke';

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; height: number; width: number }[];
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  external_urls?: { spotify: string };
  popularity?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    images: { url: string; height: number; width: number }[];
  };
  external_urls?: { spotify: string };
  preview_url: string | null;
  popularity?: number;
}

export interface GenreData {
  genre: string;
  count: number;
  score: number;
}

export interface MusicalDimensions {
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  intensity: number;
  mainstream: number;
  discovery: number;
  indie: number;
  electronic: number;
  liveMusicAffinity: number;
}

export interface VibeProfile extends MusicalDimensions {
  persona: string;
  personaDescription?: string;
  topGenres: GenreData[];
  keyAttributes?: string[];
}

export interface EventItem {
  id: string;
  externalId?: string;
  title: string;
  name?: string; // backwards compatibility with legacy UI
  description?: string;
  category: EventCategory;
  genre?: string;
  artists?: string[];
  artist?: string;
  venue: string;
  city: string;
  location?: string; // backwards compatibility
  latitude?: number;
  longitude?: number;
  date: string;
  time?: string;
  url?: string; // backwards compatibility
  ticketUrl?: string;
  image?: string;
  price?: number;
  currency?: string;
  source: string;
  matchScore: number;
  matchReason?: string; // backwards compatibility
  matchReasons?: string[];
  distanceKm?: number;
}

export interface UserPreferences {
  city: string;
  latitude?: number;
  longitude?: number;
  maxDistanceKm: number;
  preferredGenres: string[];
  preferredCategories: EventCategory[];
  preferredDays: string[];
  preferredTime: string; // 'afternoon' | 'evening' | 'late_night' | 'any'
  budget: number;
}

export interface UserProfile extends UserPreferences {
  id: string;
  spotifyId?: string;
  name: string;
  email: string;
  image?: string;
  onboardingCompleted: boolean;
  createdAt?: string;
}

export type InteractionType =
  | 'VIEW'
  | 'LIKE'
  | 'DISLIKE'
  | 'SAVE'
  | 'SHARE'
  | 'TICKET_CLICK';

export interface UserInteraction {
  id?: string;
  userId: string;
  eventId: string;
  type: InteractionType;
  reason?: string;
  createdAt?: string;
}

export interface SavedEventItem {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  event: EventItem;
}

export interface AnalyticsSummary {
  totalUsers: number;
  activeUsers: number;
  eventsIndexed: number;
  eventsViewed: number;
  eventsSaved: number;
  ticketClicks: number;
  averageMatchScore: number;
  ctr: number;
  saveRate: number;
  ticketConversionRate: number;
  topGenres: { name: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  recentInteractions: { type: string; count: number; date: string }[];
  topCities: { city: string; count: number }[];
}
