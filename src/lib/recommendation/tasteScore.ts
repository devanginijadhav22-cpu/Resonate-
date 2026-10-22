import { EventItem, VibeProfile } from '../../types';

export interface TasteScoreResult {
  score: number;
  reason?: string;
}

export function calculateTasteScore(event: EventItem, vibe: VibeProfile): TasteScoreResult {
  if (!vibe) return { score: 70 };

  // Infer event vibe characteristics from category and genre
  const isHighEnergy = event.category === 'club' || event.category === 'dj' || event.category === 'festival';
  const isAcoustic = event.category === 'open_mic' || event.category === 'poetry' || (event.genre || '').toLowerCase().includes('acoustic');
  const isConcert = event.category === 'concert';

  let delta = 0;
  let reasons: string[] = [];

  if (isHighEnergy) {
    const energyFit = 100 - Math.abs(vibe.energy - 85);
    delta += energyFit;
    if (vibe.energy >= 70) reasons.push('High night-energy profile fit');
  } else if (isAcoustic) {
    const acousticFit = 100 - Math.abs(vibe.acousticness - 70);
    delta += acousticFit;
    if (vibe.acousticness >= 40) reasons.push('Fits your acoustic listening preferences');
  } else if (isConcert) {
    const liveFit = vibe.liveMusicAffinity || 80;
    delta += liveFit;
    reasons.push('High live performance affinity');
  } else {
    delta += 75;
  }

  const finalTaste = Math.round(Math.min(100, Math.max(50, delta)));
  return {
    score: finalTaste,
    reason: reasons[0] || 'Aligns with your musical DNA'
  };
}
