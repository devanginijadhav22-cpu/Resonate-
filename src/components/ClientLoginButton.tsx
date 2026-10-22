'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { LogIn, Sparkles, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

// The canonical callback URI NextAuth generates from NEXTAUTH_URL=http://127.0.0.1:3000
// Must match exactly what is registered in Spotify Developer Dashboard.
const SPOTIFY_CALLBACK_URI = 'http://127.0.0.1:3000/api/auth/callback/spotify';

export default function ClientLoginButton() {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err) {
        setOauthError(err);
      }
    }
  }, []);

  const handleDemoLogin = async () => {
    setLoadingDemo(true);
    try {
      await signIn('demo-login', { callbackUrl: '/' });
    } catch (e) {
      console.error('Demo login error:', e);
      window.location.href = '/?demo=true';
    }
  };

  const handleSpotifyLogin = async () => {
    setLoadingSpotify(true);
    setOauthError(null);

    // Dev-mode diagnostics: log config info without exposing secrets
    if (process.env.NODE_ENV === 'development') {
      console.info('[Auth Diagnostics]', {
        providerId: 'spotify',
        nextauthUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? '(server-side only — check NEXTAUTH_URL in .env.local)',
        expectedCallbackUri: SPOTIFY_CALLBACK_URI,
        hasClientId: !!(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID_CHECK ?? true),
        note: 'redirect_uri is built by NextAuth from NEXTAUTH_URL — do NOT set SPOTIFY_REDIRECT_URI, it is unused',
      });
    }

    try {
      // Uses NextAuth's built-in Spotify provider (id: 'spotify')
      // redirect_uri sent to Spotify = NEXTAUTH_URL + /api/auth/callback/spotify
      await signIn('spotify', { callbackUrl: '/' });
    } catch (err: any) {
      console.error('Spotify login error:', err);
      setOauthError('Failed to initialize Spotify sign in. Please verify network and credentials.');
      setLoadingSpotify(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {oauthError && (
        <div className="max-w-xl w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left space-y-2 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Spotify Authentication Notice ({oauthError})</span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            If Spotify shows an error or redirect failed, please ensure in your{' '}
            <strong className="text-white">Spotify Developer Dashboard</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-300 pl-1">
            <li>
              <strong>Redirect URI:</strong> In your Spotify Developer Dashboard, add exactly:{' '}
              <code className="bg-black/50 text-emerald-400 px-1.5 py-0.5 rounded text-[11px]">{SPOTIFY_CALLBACK_URI}</code>
              {' '}— use <strong>127.0.0.1</strong>, not <em>localhost</em> (they are treated as different origins by Spotify).
            </li>
            <li>
              <strong>User Whitelist:</strong> In Spotify Development Mode, your Spotify account email must be added under <em>Users and Access</em> / <em>User Management</em>.
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        <button
          onClick={handleDemoLogin}
          disabled={loadingDemo}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm md:text-base px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer"
        >
          {loadingDemo ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 fill-black" />
          )}
          <span>Explore Live Demo (1-Click Login)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleSpotifyLogin}
          disabled={loadingSpotify}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/15 font-bold text-sm md:text-base px-7 py-4 rounded-full transition-all hover:border-emerald-500/50 shadow-lg active:scale-95 cursor-pointer"
          title="Connect using your Spotify account"
        >
          {loadingSpotify ? (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          ) : (
            <LogIn className="w-4 h-4 text-emerald-400" />
          )}
          <span>Connect with Spotify</span>
        </button>
      </div>
    </div>
  );
}
