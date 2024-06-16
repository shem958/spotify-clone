import React from "react";
import { protectRoute } from "@/utils/protectRoute";
import spotifyApi, { setAccessToken } from "@/utils/spotify";

export default async function Home() {
  const session = await protectRoute();
  setAccessToken(session.accessToken);

  const [userData, playlists] = await Promise.all([
    spotifyApi.getMe(),
    spotifyApi.getUserPlaylists(),
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {userData.body.display_name}
      </h1>
      <h2 className="text-2xl font-bold mb-4">Your Playlists:</h2>
      <ul className="space-y-2">
        {playlists.body.items.map(
          (playlist: SpotifyApi.PlaylistObjectSimplified) => (
            <li key={playlist.id} className="bg-gray-800 p-4 rounded">
              {playlist.name}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
