'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  MapPin,
  Search,
  LogOut,
  User,
  ChevronDown,
  LocateFixed,
  Loader2,
  Compass,
  Bookmark,
  BarChart3,
  SlidersHorizontal,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { OnboardingModal } from './profile/OnboardingModal';

interface NavbarProps {
  initialCity?: string;
  isDemo?: boolean;
}

export function Navbar({ initialCity = 'Mumbai', isDemo = false }: NavbarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [city, setCity] = useState(initialCity);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [tempCity, setTempCity] = useState(initialCity);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Global Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    events: any[];
    artists: string[];
    venues: string[];
    genres: string[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data.results);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempCity && tempCity.trim() !== '') {
      const formatted = tempCity.trim();
      setCity(formatted);
      setIsEditingCity(false);
      router.push(`/?city=${encodeURIComponent(formatted)}`);
    } else {
      setIsEditingCity(false);
      setTempCity(city);
    }
  };

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const detected = data.address?.city || data.address?.town || data.address?.state_district || 'Mumbai';
          setCity(detected);
          setTempCity(detected);
          setIsEditingCity(false);
          router.push(`/?city=${encodeURIComponent(detected)}`);
        } catch {
          alert('Could not determine city name from GPS coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/saved', label: 'Saved', icon: Bookmark },
    { href: '/profile', label: 'DNA & Profile', icon: SlidersHorizontal },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 text-black fill-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                  Resonate
                  {isDemo && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Live
                    </span>
                  )}
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-neutral-900/60 p-1 rounded-full border border-white/5">
              {navLinks.map(link => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Global Search Bar */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-sm relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5 text-neutral-400" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search artists, venues, genres..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />

              {/* Search Results Dropdown */}
              {searchResults && (
                <div className="absolute top-11 left-0 right-0 bg-neutral-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 text-xs space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.events.length === 0 &&
                  searchResults.artists.length === 0 &&
                  searchResults.genres.length === 0 ? (
                    <div className="p-3 text-center text-neutral-500">No matching experiences found.</div>
                  ) : (
                    <>
                      {searchResults.events.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2 py-1 block">
                            Live Events
                          </span>
                          {searchResults.events.map(e => (
                            <Link
                              key={e.id}
                              href={`/events/${e.id}`}
                              onClick={() => setSearchResults(null)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
                            >
                              <div className="truncate pr-2">
                                <p className="font-semibold truncate">{e.title}</p>
                                <p className="text-[10px] text-neutral-400">{e.venue} • {e.date}</p>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {e.matchScore}%
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {searchResults.artists.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2 py-1 block">
                            Artists
                          </span>
                          <div className="flex flex-wrap gap-1 px-2 pb-1">
                            {searchResults.artists.map(art => (
                              <button
                                key={art}
                                onClick={() => {
                                  setSearchQuery(art);
                                  router.push(`/discover?query=${encodeURIComponent(art)}`);
                                  setSearchResults(null);
                                }}
                                className="px-2 py-1 bg-neutral-800 rounded-md text-[11px] text-neutral-300 hover:text-white"
                              >
                                {art}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: City Selector & User Menu */}
            <div className="flex items-center gap-3">
              {/* City Pill */}
              {isEditingCity ? (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <form onSubmit={handleCitySubmit}>
                    <input
                      autoFocus
                      type="text"
                      value={tempCity}
                      onChange={e => setTempCity(e.target.value)}
                      className="bg-neutral-900 text-white border border-emerald-500/60 rounded-full px-3 py-1 text-xs outline-none w-28 sm:w-36"
                      placeholder="City..."
                    />
                  </form>
                  <button
                    onClick={handleAutoLocate}
                    disabled={isLocating}
                    className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Detect GPS Location"
                  >
                    {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingCity(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 hover:border-emerald-500/50 cursor-pointer text-xs text-neutral-300 hover:text-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">{city}</span>
                </div>
              )}

              {/* Preferences Button */}
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="hidden sm:flex items-center gap-1.5 p-2 rounded-full bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Edit Discovery Preferences"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {!session && (
                <button
                  onClick={() => signIn('demo-login', { callbackUrl: '/' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
                  title="Instant 1-Click Demo Login"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Demo Login</span>
                </button>
              )}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-300 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center overflow-hidden">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden py-1.5 text-xs animate-fade-in z-50">
                    <div className="px-3.5 py-2.5 border-b border-white/10 bg-neutral-800/40">
                      <p className="font-bold text-white truncate">{session?.user?.name || 'Alex Rivera (Demo)'}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{session?.user?.email || 'alex.demo@resonate.app'}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        Musical DNA & Settings
                      </Link>

                      <Link
                        href="/saved"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                        Saved Experiences
                      </Link>

                      <Link
                        href="/analytics"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                        Personal Taste Analytics
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                        System Platform Stats
                      </Link>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsOnboardingOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-left"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Tune Preferences
                      </button>

                      <div className="pt-1 mt-1 border-t border-white/10">
                        {session ? (
                          <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left font-semibold cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign out
                          </button>
                        ) : (
                          <button
                            onClick={() => signIn('demo-login', { callbackUrl: '/' })}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors text-left font-semibold cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Demo Sign In
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Onboarding Preferences Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaved={(prefs) => {
          if (prefs.city) setCity(prefs.city);
          router.refresh();
        }}
        initialCity={city}
      />
    </>
  );
}
