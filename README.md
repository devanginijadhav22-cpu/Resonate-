# 🎵 Resonate

> **"Your music taste. Your city. Your next experience."**  
> An AI-powered live-event discovery platform that bridges your digital Spotify taste to real-world concerts, club nights, music festivals, stand-up comedy, and open-mic showcases.

---

## 🌟 Overview & Product Differentiation

Resonate is **not** a generic event directory. It is an intelligent experience matching engine built around a single equation:

$$\text{Spotify Taste} + \text{Personal Preferences} + \text{Location Proximity} + \text{Event Intelligence} + \text{Feedback Loop} = \text{Personalized Live Experiences}$$

---

## ✨ Key Features

### 🎧 Advanced 10-Dimension Musical DNA
Instead of simplistic genre tags, Resonate evaluates your listening profile across 10 audio attributes:
- **Energy** (Upbeat drive & tempo)
- **Danceability** (Rhythm, groove & four-on-the-floor)
- **Valence** (Positivity & emotional tone)
- **Acousticness** (Unplugged, acoustic strings & intimate sound)
- **Intensity** (Distortion, heavy beats & rock grit)
- **Mainstream** (Chart affinity & global tour popularity)
- **Discovery** (Underground, emerging indie & deep crate digging)
- **Indie & Alt** (Lo-fi, shoegaze, dream pop, bedroom indie)
- **Electronic** (Modular synth, techno, house, ambient, breakbeat)
- **Live Music Affinity** (Touring jam bands, raw stage presence)

### 🔮 Dynamic Vibe Personas
Dynamically derived from your actual Spotify data without hardcoded labels:
- *Late-Night Indie Explorer*
- *Electronic Night Owl*
- *Mainstream Concert Hunter*
- *Acoustic Soul Seeker*
- *Festival Energy Chaser*
- *Alternative Music Explorer*
- *Weekend Party Seeker*

### 🧠 Explainable Recommendation Engine (`src/lib/recommendation/`)
Transparent scoring based on configurable weights:
- **35%** Music Taste & Audio Vector Alignment
- **20%** Artist & Sub-Genre Direct Similarity
- **15%** Geographic Distance & Proximity Radius
- **10%** Preferred Event Category Affinity
- **10%** Time & Schedule Compatibility
- **5%** Ticket Budget & Popularity
- **5%** Personal Interaction History (Likes / Saves / Dislikes)

Every event clearly explains **why** it was recommended:
- `✓ Matches your #1 artist: Tame Impala`
- `✓ High Psychedelic & Indie Rock affinity (95%)`
- `✓ Only 2.4 km from your preferred radius`
- `✓ Fits your Saturday evening profile`

### 🗺️ Interactive Dark-Mode Map View
- Powered by Leaflet & CartoDB Dark Matter tiles.
- Event markers with custom match percentage indicators.
- Instant detail cards showing distance, venue, and direct ticket links.
- Toggle effortlessly between **List View** and **Map View**.

### 🗓️ Smart "Weekend Mode" (Plan My Weekend)
Generates an automatic personalized 3-day weekend itinerary:
- **Friday Night:** Club / High-Energy Electronic Set
- **Saturday Evening:** Headline Concert / Music Tour
- **Sunday Chill:** Intimate Comedy Special or Acoustic Open Mic

### ✨ Resonate Chat Assistant ("Ask Resonate")
A floating conversational AI widget that converts natural language queries into deterministic filter queries:
- *"Find me something fun this Saturday"*
- *"Show me electronic gigs under ₹2000"*
- *"I want a chill acoustic evening near me"*

### 📊 System Analytics Dashboard (`/admin`)
Real-time tracking of:
- Total & Active Users
- Events Indexed & Saved
- Recommendation CTR (Click-Through Rate)
- Save Rate & Ticket Conversion Rate
- Recharts visualizations for interaction volume and category distribution

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3.4 (App Router, Server Components) |
| **Frontend** | React 19.2, TypeScript 5, Tailwind CSS v4 |
| **Animation & Icons** | Framer Motion, Lucide React |
| **Data Visualization** | Recharts (Radar, Area, and Bar charts) |
| **Maps** | Leaflet with CartoDB Dark Matter tiles |
| **Auth** | NextAuth.js v4 (Spotify OAuth 2.0 Provider) |
| **Database** | Prisma ORM with Supabase PostgreSQL (plus standalone in-memory fallback) |
| **External APIs** | Spotify Web API & Ticketmaster Discovery API v2 |

---

## 📂 Project Architecture

```text
Resonate-main/
├── prisma/
│   ├── schema.prisma              # Database models (User, Taste, Event, Interaction, Saved)
│   └── seed.ts                    # Database seed script for local test data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/route.ts       # Telemetry & conversion metrics
│   │   │   ├── assistant/route.ts       # Resonate Chat Assistant parser
│   │   │   ├── auth/[...nextauth]/      # Spotify OAuth route handlers
│   │   │   ├── events/route.ts          # Multi-criteria event filtering
│   │   │   ├── events/[id]/route.ts     # Event details & AI reasoning
│   │   │   ├── profile/route.ts         # User preferences CRUD
│   │   │   ├── profile/taste/route.ts   # Musical DNA telemetry
│   │   │   ├── recommendations/route.ts # Master ranked recommendations
│   │   │   ├── recommendations/feedback/# Like/Dislike/Reason feedback
│   │   │   ├── saved/route.ts           # Saved events store
│   │   │   └── search/route.ts          # Global multi-entity search
│   │   ├── admin/page.tsx               # Analytics dashboard
│   │   ├── discover/page.tsx            # Horizontal discovery carousels
│   │   ├── events/[id]/page.tsx         # Dedicated Event Details & venue map
│   │   ├── profile/page.tsx             # Musical DNA & Settings
│   │   ├── saved/page.tsx               # Saved experiences queue
│   │   ├── page.tsx                     # Landing page & authenticated dashboard
│   │   ├── layout.tsx                   # Root layout
│   │   └── globals.css                  # Global Tailwind styling
│   ├── components/
│   │   ├── ai/ResonateAssistant.tsx     # Floating assistant widget
│   │   ├── events/NotForMeModal.tsx     # Feedback & re-ranking modal
│   │   ├── events/WeekendPlannerModal.tsx# Plan My Weekend itinerary modal
│   │   ├── map/MapView.tsx              # Interactive Leaflet map component
│   │   ├── profile/OnboardingModal.tsx  # "Complete Your Profile" modal
│   │   ├── ClientLoginButton.tsx        # Spotify login & Live Demo explore
│   │   ├── DashboardTabs.tsx            # Filterable events with List/Map toggle
│   │   ├── EventGrid.tsx                # Event cards with match dial & actions
│   │   ├── GenreRadarChart.tsx          # Recharts Spider Radar visualizer
│   │   ├── MusicPersonaCard.tsx         # 10-dimension Persona card
│   │   └── Navbar.tsx                   # Top bar with global search & city selector
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── assistantEngine.ts       # Natural language intent engine
│   │   │   ├── eventReasoning.ts        # Explainable recommendation text
│   │   │   └── personaEngine.ts         # Dynamic Vibe Persona generator
│   │   ├── auth/
│   │   │   └── authOptions.ts           # NextAuth configuration
│   │   ├── database/
│   │   │   └── index.ts                 # Unified Supabase / In-Memory service
│   │   ├── dna/
│   │   │   └── musicalDna.ts            # 10-vector Musical DNA calculator
│   │   ├── events/
│   │   │   ├── curatedEvents.ts         # Multi-city verified curated events
│   │   │   ├── normalize.ts             # Ticketmaster data normalizer
│   │   │   └── index.ts                 # Unified cached event fetcher
│   │   ├── recommendation/
│   │   │   ├── artistScore.ts           # Direct & partial artist similarity
│   │   │   ├── distanceScore.ts         # Haversine proximity calculator
│   │   │   ├── eventTypeScore.ts        # Category affinity scoring
│   │   │   ├── genreScore.ts            # Semantic cross-genre scoring
│   │   │   ├── popularityScore.ts       # Budget fit & feedback weighting
│   │   │   ├── tasteScore.ts            # Audio vector alignment
│   │   │   ├── weekendPlanner.ts        # 3-day curated itinerary planner
│   │   │   └── recommendationEngine.ts  # Master rankEvents engine
│   │   ├── spotify.ts                   # Spotify Web API calls
│   │   └── mockData.ts                  # High-fidelity fallback dataset
│   └── types/
│       └── index.ts                     # Core TypeScript interfaces
└── test/
    └── recommendation.test.ts           # Business logic test suite
```

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone <repo_url>
cd Resonate-main
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:

```env
# Spotify Developer API Keys (https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Ticketmaster Discovery API Key (https://developer.ticketmaster.com/)
TICKETMASTER_API_KEY=your_ticketmaster_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_32_character_secret_key
NEXTAUTH_URL=http://localhost:3000

# Supabase PostgreSQL Database (Optional for persistence)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

### 3. Demo Mode (Zero Credentials Required!)

If you do not have Spotify or Ticketmaster API keys, **Resonate runs out of the box in Demo Mode**:
- On the landing page, click **"Explore Live Demo"** or visit `http://localhost:3000/?demo=true`.
- Simulates an authentic Spotify session (Alex Rivera - Late-Night Indie Explorer) with complete Musical DNA, Ticketmaster fallbacks, map coordinates, and full database persistence.

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Business Logic Tests

```bash
npm test
```

Runs tests validating Haversine distance, artist scoring, genre similarity, dynamic persona generation, recommendation ranking, and natural language intent parsing.

### 6. Building for Production

```bash
npm run build
```

---

## 🔒 Security Best Practices

- All client secrets (`SPOTIFY_CLIENT_SECRET`, `TICKETMASTER_API_KEY`, `DATABASE_URL`) are isolated to server-side API routes and Server Components.
- Input validation on all query parameters and API bodies.
- Protection against SSR window access for map rendering using dynamic imports.
- Zero secrets committed to version control.

---

## 🔮 Future Roadmap

- [ ] Collaborative group event voting ("Group Vibe Match")
- [ ] Spotify playlist sync for upcoming festival lineups
- [ ] In-app ticket booking & wallet pass generation
- [ ] Push notifications for newly announced tours from top artists
