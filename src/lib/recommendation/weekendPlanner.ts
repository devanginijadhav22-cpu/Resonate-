import { EventItem, VibeProfile } from '../../types';

export interface WeekendItineraryDay {
  day: 'Friday' | 'Saturday' | 'Sunday';
  dateLabel: string;
  theme: string;
  event: EventItem;
}

export interface WeekendItinerary {
  headline: string;
  totalMatchScore: number;
  days: WeekendItineraryDay[];
}

export function generateWeekendPlan(events: EventItem[], vibe?: VibeProfile | null): WeekendItinerary | null {
  if (!events || events.length === 0) return null;

  // Find candidate for Friday (preferably club / high energy concert / dj)
  let fridayEvent = events.find(e =>
    e.date.toLowerCase().includes('friday') ||
    e.category === 'club' ||
    e.category === 'dj'
  ) || events[0];

  // Find candidate for Saturday (preferably headline concert / festival / main event)
  let saturdayEvent = events.find(e =>
    e.id !== fridayEvent.id &&
    (e.date.toLowerCase().includes('saturday') || e.category === 'concert' || e.category === 'festival')
  ) || events[1] || events[0];

  // Find candidate for Sunday (preferably comedy / open_mic / acoustic / intimate chill)
  let sundayEvent = events.find(e =>
    e.id !== fridayEvent.id &&
    e.id !== saturdayEvent.id &&
    (e.date.toLowerCase().includes('sunday') || e.category === 'comedy' || e.category === 'open_mic' || e.category === 'poetry')
  ) || events[2] || events[0];

  const avgMatch = Math.round(
    ((fridayEvent?.matchScore || 90) + (saturdayEvent?.matchScore || 90) + (sundayEvent?.matchScore || 90)) / 3
  );

  return {
    headline: `Curated for your ${vibe?.persona || 'Music Explorer'} Taste`,
    totalMatchScore: avgMatch,
    days: [
      {
        day: 'Friday',
        dateLabel: fridayEvent.time || '10:00 PM',
        theme: 'High-Energy Electronic / Club Night',
        event: fridayEvent
      },
      {
        day: 'Saturday',
        dateLabel: saturdayEvent.time || '8:00 PM',
        theme: 'Headlining Live Concert & Tour',
        event: saturdayEvent
      },
      {
        day: 'Sunday',
        dateLabel: sundayEvent.time || '7:00 PM',
        theme: 'Acoustic / Stand-Up Intimate Vibe',
        event: sundayEvent
      }
    ]
  };
}
