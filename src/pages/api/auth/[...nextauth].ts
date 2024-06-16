import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const scopes = [
  'user-read-email',
  'playlist-read-private',
  'user-read-private',
  'user-library-read',
  'user-top-read',
].join(',');

const params = {
  scope: scopes,
};

const queryString = new URLSearchParams(params);

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables.');
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId,
      clientSecret,
      authorization: `https://accounts.spotify.com/authorize?${queryString.toString()}`,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
