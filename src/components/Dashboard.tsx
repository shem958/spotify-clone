"use client";

import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import PlayerBar from "./PlayerBar";
import { usePlaybackStore } from "../store/usePlaybackStore";
import { useColorExtraction } from "../utils/color";
import { Playlist } from "../types";

interface DashboardProps {
  initialPlaylists: Playlist[];
  user: {
    name: string;
    image?: string;
    email?: string;
  };
}

export default function Dashboard({ initialPlaylists, user }: DashboardProps) {
  const { currentTrack, setQueue, setActivePlaylist, activePlaylist } = usePlaybackStore();
  const activeColor = useColorExtraction(currentTrack?.album?.images?.[0]?.url);

  // Load initial playlists and set default queue on mount
  useEffect(() => {
    if (initialPlaylists.length > 0) {
      // Find the first playlist with tracks
      const playlistWithTracks = initialPlaylists.find(p => p.tracks && p.tracks.items.length > 0) || initialPlaylists[0];
      setActivePlaylist(playlistWithTracks);
      
      if (playlistWithTracks.tracks && playlistWithTracks.tracks.items.length > 0) {
        const trackList = playlistWithTracks.tracks.items.map(item => item.track);
        setQueue(trackList);
      }
    }
  }, [initialPlaylists, setQueue, setActivePlaylist]);

  return (
    <div
      className="relative flex flex-col h-screen w-screen overflow-hidden bg-black text-zinc-300 font-sans transition-all duration-[1000ms] ease-out"
      style={{
        backgroundImage: `radial-gradient(circle at top left, ${activeColor} 0%, rgba(0, 0, 0, 0) 60%)`,
      }}
    >
      {/* Top Main Section */}
      <div className="flex flex-1 flex-row min-h-0 w-full p-2 gap-2">
        {/* Left Sidebar */}
        <Sidebar playlists={initialPlaylists} user={user} />

        {/* Center/Right Main Content View */}
        <MainContent user={user} />
      </div>

      {/* Bottom Player Bar */}
      <PlayerBar />
    </div>
  );
}
