"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import spotifyApi, { setAccessToken } from "@/utils/spotify";

interface Playlist {
  id: string;
  name: string;
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeInner />
    </SessionProvider>
  );
}

function HomeInner() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (session) {
      // Check if accessToken is a string before setting it
      if (typeof session.accessToken === "string") {
        setAccessToken(session.accessToken);
      }

      const fetchData = async () => {
        try {
          const [userDataResponse, playlistsResponse] = await Promise.all([
            spotifyApi.getMe(),
            spotifyApi.getUserPlaylists(),
          ]);
          // Ensure that playlistsResponse.body.items is an array before setting it
          if (Array.isArray(playlistsResponse.body.items)) {
            setUserPlaylists(playlistsResponse.body.items);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex h-screen justify-center items-center">
        <button
          onClick={() => signIn()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user.name ?? "User"}
      </h1>
      <h2 className="text-2xl font-bold mb-4">Your Playlists:</h2>
      <ul className="space-y-2">
        {userPlaylists.map((playlist) => (
          <li key={playlist.id} className="bg-gray-800 p-4 rounded">
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
