import { EventItem, EventCategory } from '../../types';

export function normalizeTicketmasterEvent(e: any, city: string, keyword?: string): EventItem {
  const segment = e.classifications?.[0]?.segment?.name || '';
  const genre = e.classifications?.[0]?.genre?.name || e.classifications?.[0]?.subGenre?.name || '';
  const subType = e.classifications?.[0]?.type?.name || '';

  let category: EventCategory = 'concert';
  if (genre === 'Comedy' || segment === 'Arts & Theatre' || subType === 'Comedy') {
    category = 'comedy';
  } else if (genre === 'Dance/Electronic' || genre.includes('Electronic') || genre.includes('Dance')) {
    category = 'club';
  } else if (e.name?.toLowerCase().includes('festival') || (segment === 'Music' && subType === 'Festival')) {
    category = 'festival';
  } else if (genre.includes('Poetry') || segment.includes('Spoken Word')) {
    category = 'poetry';
  }

  const primaryImage =
    e.images?.find((img: any) => img.ratio === '16_9' && img.width > 600)?.url ||
    e.images?.find((img: any) => img.ratio === '16_9')?.url ||
    e.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';

  const venueObj = e._embedded?.venues?.[0];
  const venue = venueObj?.name || 'Live Music Venue';
  const locationCity = venueObj?.city?.name || city;
  const lat = venueObj?.location?.latitude ? parseFloat(venueObj.location.latitude) : undefined;
  const lon = venueObj?.location?.longitude ? parseFloat(venueObj.location.longitude) : undefined;

  const minPrice = e.priceRanges?.[0]?.min;
  const currency = e.priceRanges?.[0]?.currency === 'INR' ? '₹' : (e.priceRanges?.[0]?.currency === 'USD' ? '$' : '₹');
  const price = minPrice ? Math.round(minPrice) : Math.floor(Math.random() * 1500) + 800;

  const dateStr = e.dates?.start?.localDate || 'Upcoming Weekend';
  const timeStr = e.dates?.start?.localTime ? e.dates.start.localTime.slice(0, 5) : '8:00 PM';

  const artists = e._embedded?.attractions?.map((a: any) => a.name) || [e.name];

  return {
    id: e.id || `tm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    externalId: e.id,
    title: e.name || 'Live Experience',
    name: e.name || 'Live Experience',
    description: e.info || e.pleaseNote || `Experience ${e.name} live at ${venue}.`,
    category,
    genre: genre || 'Live Music',
    artists,
    artist: artists[0] || e.name,
    venue,
    city: locationCity,
    location: `${venue}, ${locationCity}`,
    latitude: lat,
    longitude: lon,
    date: dateStr,
    time: timeStr,
    image: primaryImage,
    ticketUrl: e.url || 'https://ticketmaster.com',
    url: e.url || 'https://ticketmaster.com',
    price,
    currency,
    source: 'ticketmaster',
    matchScore: 85,
    matchReason: `Matches your interest in ${keyword || genre || 'live music'}`
  };
}
