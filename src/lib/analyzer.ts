// Dummy/mock implementations for the analyzer engine

import { mockVibeProfile, mockEvents } from "./mockData";
import { VibeProfile, EventItem } from "../types";

export async function analyzeTasteProfile(): Promise<VibeProfile> {
  // In a real app, this would fetch from Spotify API, aggregate, and calculate
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVibeProfile), 800);
  });
}

export async function getRecommendedEvents(profile: VibeProfile, city: string, radius: number): Promise<EventItem[]> {
  // Real app: fetch from Ticketmaster/SeatGeek based on topGenres/Artists
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEvents), 600);
  });
}
