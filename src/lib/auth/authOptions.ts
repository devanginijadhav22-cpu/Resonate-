import { NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import CredentialsProvider from 'next-auth/providers/credentials';
import { upsertUser } from '../database';

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'user-read-recently-played'
].join(' ');

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID?.trim() || '';
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim() || '';

// Dev-only diagnostics — never logs credential values
if (process.env.NODE_ENV === 'development') {
  const nextauthUrl = process.env.NEXTAUTH_URL || '(not set)';
  const expectedCallback = nextauthUrl.replace(/\/$/, '') + '/api/auth/callback/spotify';
  console.info('[NextAuth Config]', {
    nextauthUrl,
    expectedSpotifyCallback: expectedCallback,
    hasClientId: !!spotifyClientId,
    hasClientSecret: !!spotifyClientSecret,
    hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
    // SPOTIFY_REDIRECT_URI is NOT used by NextAuth — the callback URI is derived from NEXTAUTH_URL automatically
    spotifyRedirectUriEnvPresent: !!process.env.SPOTIFY_REDIRECT_URI,
    spotifyRedirectUriIsUnused: true,
  });
}


async function refreshAccessToken(token: any) {
  try {
    const basicAuth = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      })
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    };
  } catch (error) {
    console.error('Error refreshing Spotify access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

const providers = [];

// Only register real Spotify provider if credentials exist
if (spotifyClientId && spotifyClientSecret) {
  providers.push(
    SpotifyProvider({
      clientId: spotifyClientId,
      clientSecret: spotifyClientSecret,
      authorization: {
        params: { scope: scopes }
      }
    })
  );
}

// Seamless 1-Click Demo Login Provider
providers.push(
  CredentialsProvider({
    id: 'demo-login',
    name: 'Demo Login',
    credentials: {},
    async authorize() {
      return {
        id: 'demo-user',
        name: 'Alex Rivera',
        email: 'alex.demo@resonate.app',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      };
    }
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || 'resonate-dev-secret-key-32-chars-ok',
  session: {
    strategy: 'jwt'
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'spotify') {
        try {
          await upsertUser({
            id: user.email || user.id,
            spotifyId: (profile as any)?.id || user.id,
            name: user.name || 'Spotify Explorer',
            email: user.email || '',
            image: user.image || undefined,
            city: 'Mumbai',
            onboardingCompleted: true
          });
        } catch (e) {
          console.warn('Failed to upsert Spotify user on signin:', e);
        }
      }
    }
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token || 'demo_access_token';
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600000;
      }
      if (user) {
        token.user = user;
        if (!token.accessToken) token.accessToken = 'demo_access_token';
      }

      // If token is still valid or is demo token, return as is
      if (!token.expiresAt || Date.now() < token.expiresAt || token.accessToken === 'demo_access_token') {
        return token;
      }

      // Refresh Spotify token if expired
      if (token.refreshToken && spotifyClientId && spotifyClientSecret) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken || 'demo_access_token';
      if (token.user && session.user) {
        session.user = {
          ...session.user,
          ...token.user
        };
      }
      return session;
    }
  }
};
