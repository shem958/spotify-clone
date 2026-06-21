import { DefaultSession } from "next-auth";

declare module "spotify-web-api-node";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
  }
}

export interface Artist {
  name: string;
  id?: string;
}

export interface AlbumImage {
  url: string;
  height?: number;
  width?: number;
}

export interface Album {
  name: string;
  images: AlbumImage[];
  id?: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[] | string; // support both structured and simple strings
  album: Album;
  duration_ms: number;
  preview_url: string | null;
  uri: string;
  localUrl?: string; // path to locally stored/royalty-free audio
}

export interface Playlist {
  id: string;
  name: string;
  images?: AlbumImage[];
  description?: string;
  tracks?: {
    items: { track: Track }[];
    total: number;
  };
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface CollaborativeRoom {
  id: string;
  name: string;
  listeners: { name: string; avatar: string; isHost?: boolean }[];
  playlistId: string;
  activeTrackId?: string;
}
