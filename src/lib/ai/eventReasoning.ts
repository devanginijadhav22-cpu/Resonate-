import { EventItem, VibeProfile } from '../../types';

export interface EventReasoningBreakdown {
  headline: string;
  whyThisMatchesYou: string[];
  musicalFitDescription: string;
  crowdVibe: string;
}

export function generateEventReasoning(event: EventItem, vibe?: VibeProfile | null): EventReasoningBreakdown {
  const persona = vibe?.persona || 'Music Explorer';
  const category = event.category;
  const genre = event.genre || 'Live Music';

  const reasons = event.matchReasons && event.matchReasons.length > 0
    ? event.matchReasons
    : [
        `High sonic affinity with your ${persona} taste`,
        `Curated for fans of ${genre}`,
        `Located conveniently in ${event.city}`
      ];

  let crowdVibe = 'High-energy crowd and vibrant live acoustics';
  if (category === 'club' || category === 'dj') {
    crowdVibe = 'Late-night electronic heads, hypnotic lighting, and pulsating dancefloor energy.';
  } else if (category === 'comedy') {
    crowdVibe = 'Intimate comedy club setting with craft drinks and unscripted crowd interaction.';
  } else if (category === 'open_mic' || category === 'poetry') {
    crowdVibe = 'Cozy candlelit listening room, acoustic instruments, and supportive creative community.';
  } else if (category === 'festival') {
    crowdVibe = 'Multi-stage festival grounds, open-air sun-drenched anthems, and festival food trucks.';
  }

  const musicalFit = `This event aligns with your Spotify rotation in ${genre}. With a ${event.matchScore}% affinity score, it matches your affinity for live performances in ${event.city}.`;

  return {
    headline: event.matchReason || `Perfect for your ${persona} taste profile`,
    whyThisMatchesYou: reasons,
    musicalFitDescription: musicalFit,
    crowdVibe
  };
}
