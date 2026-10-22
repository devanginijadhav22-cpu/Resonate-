'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EventItem } from '../../types';
import { MapPin, Calendar, ExternalLink, Sparkles, Navigation } from 'lucide-react';
import Link from 'next/link';

interface MapViewProps {
  events: EventItem[];
  centerCity?: string;
}

export function MapView({ events, centerCity = 'Mumbai' }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(events[0] || null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter events with coordinates or default to city coordinates
  const eventsWithCoords = events.map(e => {
    let lat = e.latitude;
    let lon = e.longitude;

    if (!lat || !lon) {
      if (e.city.toLowerCase() === 'mumbai') {
        lat = 19.0760 + (Math.random() - 0.5) * 0.08;
        lon = 72.8777 + (Math.random() - 0.5) * 0.08;
      } else if (e.city.toLowerCase() === 'new york') {
        lat = 40.7128 + (Math.random() - 0.5) * 0.06;
        lon = -74.0060 + (Math.random() - 0.5) * 0.06;
      } else if (e.city.toLowerCase() === 'london') {
        lat = 51.5074 + (Math.random() - 0.5) * 0.06;
        lon = -0.1278 + (Math.random() - 0.5) * 0.06;
      } else if (e.city.toLowerCase() === 'bengaluru') {
        lat = 12.9716 + (Math.random() - 0.5) * 0.06;
        lon = 77.5946 + (Math.random() - 0.5) * 0.06;
      } else {
        lat = 19.0760;
        lon = 72.8777;
      }
    }

    return { ...e, latitude: lat, longitude: lon };
  });

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = await import('leaflet');

      // Import leaflet css dynamically if not already present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const defaultCenter: [number, number] = eventsWithCoords[0]?.latitude && eventsWithCoords[0]?.longitude
        ? [eventsWithCoords[0].latitude, eventsWithCoords[0].longitude]
        : [19.0760, 72.8777];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true
      });
      mapInstanceRef.current = map;

      // Dark Matter CartoDB tiles for sleek dark UI aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; CartoDB &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      // Custom marker icon with pulsating Spotify green dot
      const createIcon = (score: number) => {
        const color = score >= 90 ? '#1DB954' : '#8B5CF6';
        return L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.9);
            box-shadow: 0 0 15px ${color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            color: #000;
          ">${score}%</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
      };

      eventsWithCoords.forEach(evt => {
        if (evt.latitude && evt.longitude) {
          const marker = L.marker([evt.latitude, evt.longitude], {
            icon: createIcon(evt.matchScore || 85)
          }).addTo(map);

          marker.on('click', () => {
            if (isMounted) setSelectedEvent(evt);
          });
        }
      });

      if (isMounted) setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl h-[550px]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Selected Event Floating Card */}
      {selectedEvent && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-neutral-900/90 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl z-[1000] text-foreground transition-all duration-300">
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              {selectedEvent.matchScore}% Match
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-md">
              {selectedEvent.category}
            </span>
          </div>

          <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{selectedEvent.title}</h3>
          <p className="text-xs text-neutral-300 line-clamp-1 mb-3">{selectedEvent.artist || selectedEvent.genre}</p>

          <div className="space-y-1.5 text-xs text-neutral-400 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{selectedEvent.venue} ({selectedEvent.distanceKm || 2.4} km away)</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span>{selectedEvent.date} • {selectedEvent.time || '8:00 PM'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div>
              <span className="text-[11px] text-neutral-400 block">Tickets from</span>
              <span className="font-extrabold text-sm text-white">
                {selectedEvent.currency || '₹'}{selectedEvent.price || 999}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/events/${selectedEvent.id}`}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                View Details
              </Link>
              <a
                href={selectedEvent.ticketUrl || selectedEvent.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-transform active:scale-95"
              >
                Get Tickets
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
