import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";
import { cookies } from "next/headers";
import Dashboard from "../components/Dashboard";
import { DEMO_PLAYLISTS } from "../utils/demoData";
import spotifyApi, { setAccessToken } from "../utils/spotify";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const isDemo = cookieStore.get("demo-mode")?.value === "true";

  let playlists = DEMO_PLAYLISTS;
  let user: {
    name: string;
    image?: string;
    email?: string;
  } = {
    name: "Demo Listener",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    email: "demo@spotify-clone.local"
  };

  // If there is an active Spotify OAuth session and not forced into demo mode, use the session details
  if (session && !isDemo) {
    user = {
      name: session.user?.name || "Spotify User",
      image: session.user?.image || undefined,
      email: session.user?.email || undefined
    };

    if (session.accessToken) {
      try {
        setAccessToken(session.accessToken);
        const playlistsResponse = await spotifyApi.getUserPlaylists();
        if (playlistsResponse && playlistsResponse.body && Array.isArray(playlistsResponse.body.items)) {
          playlists = playlistsResponse.body.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            images: item.images || [],
          }));
        }
      } catch (error) {
        console.error("Error fetching Spotify playlists server-side:", error);
      }
    }
  }

  return <Dashboard initialPlaylists={playlists} user={user} />;
}
