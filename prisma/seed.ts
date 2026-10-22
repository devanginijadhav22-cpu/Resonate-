// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Resonate production demo database...");

  // Seed sample user
  const user = await prisma.user.upsert({
    where: { email: "alex.demo@resonate.app" },
    update: {},
    create: {
      spotifyId: "alex_resonate_demo",
      name: "Alex Rivera",
      email: "alex.demo@resonate.app",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      city: "Mumbai",
      latitude: 19.0760,
      longitude: 72.8777,
      maxDistanceKm: 15,
      preferredGenres: JSON.stringify(["Indie Rock", "Electronic", "Psychedelic Pop", "Alternative"]),
      preferredCategories: JSON.stringify(["concert", "club", "festival", "comedy"]),
      preferredDays: JSON.stringify(["friday", "saturday", "sunday"]),
      preferredTime: "evening",
      budget: 3000,
      onboardingCompleted: true,
      taste: {
        create: {
          topGenres: JSON.stringify([
            { genre: "Indie Rock", count: 48, score: 95 },
            { genre: "Electronic / Synth", count: 40, score: 88 },
            { genre: "Neo-Psychedelia", count: 32, score: 76 },
            { genre: "Alternative Pop", count: 24, score: 65 },
            { genre: "Standup Comedy", count: 14, score: 45 }
          ]),
          topArtists: JSON.stringify([
            { id: "a1", name: "Tame Impala", genres: ["neo-psychedelic", "indie pop"], image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400" },
            { id: "a2", name: "BICEP", genres: ["electronic", "house", "breakbeat"], image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400" },
            { id: "a3", name: "Arctic Monkeys", genres: ["indie rock", "garage rock"], image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" },
            { id: "a4", name: "Fred again..", genres: ["uk dance", "electronic"], image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400" },
            { id: "a5", name: "Phoebe Bridgers", genres: ["indie folk", "alt-pop"], image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400" }
          ]),
          topTracks: JSON.stringify([]),
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
          persona: "Late-Night Indie Explorer",
          personaDescription: "Drawn to psychedelic riffs, high-tempo electronica, and intimate late-night acoustic sets."
        }
      }
    }
  });

  const demoEvents = [
    {
      externalId: "tm_mumbai_01",
      title: "Tame Impala: Innerspeaker & Slow Rush Live",
      description: "An immersive psychedelic audiovisual concert experience featuring mind-bending lasers and analog synths.",
      category: "concert",
      genre: "Neo-Psychedelia",
      artist: "Tame Impala",
      venue: "Jio World Garden",
      city: "Mumbai",
      latitude: 19.0664,
      longitude: 72.8679,
      date: "2026-10-10",
      time: "8:00 PM",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      ticketUrl: "https://ticketmaster.com",
      price: 2800,
      currency: "₹",
      source: "ticketmaster"
    },
    {
      externalId: "tm_mumbai_02",
      title: "Warehouse Project: BICEP Live Audio/Visual Set",
      description: "High-octane electronic and breakbeat club night featuring bespoke modular lighting and subterranean soundscapes.",
      category: "club",
      genre: "Electronic / House",
      artist: "BICEP",
      venue: "The Dome, NSCI",
      city: "Mumbai",
      latitude: 18.9880,
      longitude: 72.8160,
      date: "2026-10-11",
      time: "10:30 PM",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      ticketUrl: "https://ticketmaster.com",
      price: 1800,
      currency: "₹",
      source: "ticketmaster"
    },
    {
      externalId: "tm_mumbai_03",
      title: "Midnight Comedy Club: Uncensored Live Special",
      description: "Fast-paced punchlines and sharp observational humor from the country's most celebrated stand-up headliners.",
      category: "comedy",
      genre: "Standup Comedy",
      artist: "Varun & Friends",
      venue: "The Habitat, Khar",
      city: "Mumbai",
      latitude: 19.0711,
      longitude: 72.8361,
      date: "2026-10-12",
      time: "7:30 PM",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80",
      ticketUrl: "https://ticketmaster.com",
      price: 799,
      currency: "₹",
      source: "local"
    },
    {
      externalId: "tm_mumbai_04",
      title: "Echoes in the Courtyard: Indie Folk & Poetry Night",
      description: "Intimate candlelit open mic and curated acoustic showcases by emerging songwriters and spoken word artists.",
      category: "open_mic",
      genre: "Indie Folk & Poetry",
      artist: "Various Independent Artists",
      venue: "AntiSocial, Lower Parel",
      city: "Mumbai",
      latitude: 18.9950,
      longitude: 72.8250,
      date: "2026-10-12",
      time: "6:00 PM",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
      ticketUrl: "https://ticketmaster.com",
      price: 499,
      currency: "₹",
      source: "local"
    },
    {
      externalId: "tm_mumbai_05",
      title: "Resonance Open-Air Music & Arts Festival 2026",
      description: "A two-day multi-stage celebration of alternative music, progressive indie, art installations, and artisanal cuisine.",
      category: "festival",
      genre: "Alternative Festival",
      artist: "Arctic Monkeys, BICEP, & Guests",
      venue: "Mahalaxmi Racecourse",
      city: "Mumbai",
      latitude: 18.9830,
      longitude: 72.8200,
      date: "2026-10-24",
      time: "3:00 PM",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
      ticketUrl: "https://ticketmaster.com",
      price: 3499,
      currency: "₹",
      source: "ticketmaster"
    }
  ];

  for (const e of demoEvents) {
    const createdEvent = await prisma.event.upsert({
      where: { externalId: e.externalId },
      update: {},
      create: e
    });

    // Seed sample interaction and save for demonstration
    if (e.category === "concert" || e.category === "club") {
      await prisma.savedEvent.upsert({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId: createdEvent.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          eventId: createdEvent.id
        }
      }).catch(() => {});

      await prisma.userInteraction.create({
        data: {
          userId: user.id,
          eventId: createdEvent.id,
          type: "SAVE"
        }
      }).catch(() => {});
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
