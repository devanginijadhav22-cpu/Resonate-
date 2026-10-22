import { EventItem, UserPreferences } from '../../types';

export interface DistanceScoreResult {
  score: number;
  distanceKm?: number;
  reason?: string;
}

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function calculateDistanceScore(event: EventItem, prefs?: Partial<UserPreferences>): DistanceScoreResult {
  const maxDistance = prefs?.maxDistanceKm || 20;

  if (event.distanceKm !== undefined) {
    const dist = event.distanceKm;
    const score = Math.max(40, Math.round(100 - (dist / maxDistance) * 50));
    return {
      score: Math.min(100, score),
      distanceKm: dist,
      reason: dist <= 5 ? `Only ${dist} km away from your area` : `${dist} km away (within your ${maxDistance} km limit)`
    };
  }

  if (prefs?.latitude && prefs?.longitude && event.latitude && event.longitude) {
    const dist = calculateHaversineDistance(prefs.latitude, prefs.longitude, event.latitude, event.longitude);
    const score = Math.max(40, Math.round(100 - (dist / maxDistance) * 50));
    return {
      score: Math.min(100, score),
      distanceKm: dist,
      reason: dist <= 5 ? `Only ${dist} km away` : `${dist} km away (within ${maxDistance} km)`
    };
  }

  // Fallback if coordinates missing: check city match
  const cityMatch = (event.city || '').toLowerCase() === (prefs?.city || 'mumbai').toLowerCase();
  return {
    score: cityMatch ? 85 : 60,
    distanceKm: cityMatch ? 4.2 : 25,
    reason: cityMatch ? `Located right in ${event.city}` : `In ${event.city}`
  };
}
