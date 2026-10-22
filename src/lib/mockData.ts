import { SpotifyUser, SpotifyArtist, VibeProfile, EventItem } from '../types';

export const mockUser: SpotifyUser = {
  id: "demo-user",
  display_name: "Alex Rivera (Indie/Electro Fan)",
  email: "alex.demo@resonate.app",
  images: [{ url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", height: 640, width: 640 }]
};

export const mockTopArtists: SpotifyArtist[] = [
  {
    id: "1",
    name: "Tame Impala",
    genres: ["australian psych", "indie pop", "neo-psychedelic"],
    images: [{ url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", height: 640, width: 640 }],
    external_urls: { spotify: "https://open.spotify.com" },
    popularity: 88
  },
  {
    id: "2",
    name: "BICEP",
    genres: ["electronic", "house", "techno", "breakbeat"],
    images: [{ url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400", height: 640, width: 640 }],
    external_urls: { spotify: "https://open.spotify.com" },
    popularity: 76
  },
  {
    id: "3",
    name: "Arctic Monkeys",
    genres: ["garage rock", "indie rock", "sheffield indie"],
    images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400", height: 640, width: 640 }],
    external_urls: { spotify: "https://open.spotify.com" },
    popularity: 90
  },
  {
    id: "4",
    name: "Fred again..",
    genres: ["uk dance", "electronic", "house"],
    images: [{ url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400", height: 640, width: 640 }],
    external_urls: { spotify: "https://open.spotify.com" },
    popularity: 85
  },
  {
    id: "5",
    name: "Phoebe Bridgers",
    genres: ["indie folk", "alt-pop", "bedroom pop"],
    images: [{ url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400", height: 640, width: 640 }],
    external_urls: { spotify: "https://open.spotify.com" },
    popularity: 82
  }
];

export const mockVibeProfile: VibeProfile = {
  persona: "Late-Night Indie Explorer",
  personaDescription: "Drawn to psychedelic riffs, high-tempo electronica, and intimate late-night acoustic sets.",
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
  keyAttributes: ["Psychedelic Synths", "Deep Basslines", "Intimate Stages"],
  topGenres: [
    { genre: "Indie Rock", count: 48, score: 95 },
    { genre: "Electronic / Synth", count: 40, score: 88 },
    { genre: "Neo-Psychedelia", count: 32, score: 76 },
    { genre: "Alternative Pop", count: 24, score: 65 },
    { genre: "Standup Comedy", count: 14, score: 45 }
  ]
};

export const mockEvents: EventItem[] = [
  {
    id: "e1",
    title: "Tame Impala - Slow Rush Tour",
    name: "Tame Impala - Slow Rush Tour",
    date: "Saturday, Oct 24, 2026",
    venue: "Jio World Garden",
    city: "Mumbai",
    location: "BKC, Mumbai",
    category: "concert",
    url: "https://ticketmaster.com",
    ticketUrl: "https://ticketmaster.com",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    price: 2800,
    currency: "₹",
    source: "curated",
    matchScore: 98,
    matchReason: "Because you listen to Tame Impala",
    matchReasons: [
      "Matches your #1 artist: Tame Impala",
      "High Psychedelic & Indie Rock affinity (95%)",
      "Upcoming Saturday night show"
    ],
    distanceKm: 2.4
  },
  {
    id: "e2",
    title: "Warehouse Project: BICEP Live Audio/Visual Set",
    name: "Warehouse Project: BICEP Live Audio/Visual Set",
    date: "Friday, Oct 23, 2026",
    venue: "The Dome, NSCI",
    city: "Mumbai",
    location: "Worli, Mumbai",
    category: "club",
    url: "https://ticketmaster.com",
    ticketUrl: "https://ticketmaster.com",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    price: 1800,
    currency: "₹",
    source: "curated",
    matchScore: 94,
    matchReason: "Matches your electronic music taste",
    matchReasons: [
      "Direct match with your Electronic & House score (88%)",
      "Upcoming Friday late-night session"
    ],
    distanceKm: 4.8
  },
  {
    id: "e3",
    title: "Echoes in the Courtyard: Indie Folk & Poetry Night",
    name: "Echoes in the Courtyard: Indie Folk & Poetry Night",
    date: "Friday, Oct 16, 2026",
    venue: "AntiSocial",
    city: "Mumbai",
    location: "Lower Parel, Mumbai",
    category: "open_mic",
    url: "https://ticketmaster.com",
    ticketUrl: "https://ticketmaster.com",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    price: 499,
    currency: "₹",
    source: "curated",
    matchScore: 89,
    matchReason: "Matches your acoustic and indie discovery taste",
    matchReasons: [
      "High Discovery score: 85%",
      "Acoustic vibes match Phoebe Bridgers / Indie Folk affinity"
    ],
    distanceKm: 3.8
  },
  {
    id: "e4",
    title: "Midnight Comedy Club: Uncensored Live Special",
    name: "Midnight Comedy Club: Uncensored Live Special",
    date: "Sunday, Oct 18, 2026",
    venue: "The Habitat",
    city: "Mumbai",
    location: "Khar West, Mumbai",
    category: "comedy",
    url: "https://ticketmaster.com",
    ticketUrl: "https://ticketmaster.com",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
    price: 799,
    currency: "₹",
    source: "curated",
    matchScore: 86,
    matchReason: "Because you enjoy standup comedy",
    matchReasons: [
      "Fits your Sunday chill schedule",
      "Under your budget (₹799)"
    ],
    distanceKm: 3.1
  }
];
