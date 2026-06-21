"use client";

import React, { useState } from "react";
import { usePlaybackStore } from "../store/usePlaybackStore";
import { DEMO_TRACKS, DEMO_PLAYLISTS } from "../utils/demoData";
import { Track, Playlist } from "../types";
import {
  Play,
  Pause,
  Clock,
  Heart,
  Search,
  Sparkles,
  Music,
  Plus,
  Trash2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Visualizer from "./Visualizer";
import LyricsView from "./LyricsView";
import CollaborationPanel from "./CollaborationPanel";

interface MainContentProps {
  user: {
    name: string;
  };
}

export default function MainContent({ user }: MainContentProps) {
  const {
    activeView,
    activePlaylist,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setIsPlaying,
    queue,
    setQueue,
    addToQueue,
    removeFromQueue,
    setActiveView,
    setActivePlaylist,
  } = usePlaybackStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [likedTracks, setLikedTracks] = useState<string[]>(["demo-track-1"]);

  const handleTrackLike = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    setActivePlaylist(playlist);
    if (playlist.tracks && playlist.tracks.items.length > 0) {
      const tracks = playlist.tracks.items.map((i) => i.track);
      setQueue(tracks);
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const handlePlayTrack = (track: Track, tracksContext: Track[] = []) => {
    if (tracksContext.length > 0) {
      setQueue(tracksContext);
    } else {
      addToQueue(track);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const formatDuration = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 1. Home View
  const renderHome = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome banner */}
      <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900/40 to-zinc-900 border border-zinc-800/50 shadow-lg flex items-center justify-between">
        <div className="z-10 space-y-3 max-w-md">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Welcome Back</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready for some music, {user.name.split(" ")[0]}?
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Experience our upgraded player engine. Load up collaborative rooms, visualizers, or check out synchronization lyrics.
          </p>
        </div>
        <div className="hidden md:block relative w-48 h-32 shrink-0 select-none pointer-events-none opacity-40">
          <Music className="w-full h-full text-emerald-500/20" />
        </div>
      </div>

      {/* Grid of featured playlists */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Featured Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DEMO_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => {
                setActivePlaylist(playlist);
                setActiveView("playlist");
              }}
              className="bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-900 hover:border-zinc-800/80 rounded-xl p-4 transition duration-300 group cursor-pointer relative"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-md shadow-black/30">
                {playlist.images?.[0]?.url ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-850 flex items-center justify-center">
                    <Music className="w-12 h-12 text-zinc-650" />
                  </div>
                )}
                {/* Play Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPlaylist(playlist);
                  }}
                  className="absolute bottom-3 right-3 w-11 h-11 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>
              <h4 className="font-semibold text-white truncate text-sm mb-1">{playlist.name}</h4>
              <p className="text-xs text-zinc-500 line-clamp-2">{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently played / Quick recommendations */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Trending Now</h3>
        <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-xl overflow-hidden">
          {DEMO_TRACKS.map((track) => (
            <div
              key={track.id}
              onClick={() => handlePlayTrack(track, DEMO_TRACKS)}
              className="flex items-center justify-between p-3 hover:bg-zinc-800/40 transition duration-200 cursor-pointer group border-b border-zinc-900 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                  <Image
                    src={track.album.images[0].url}
                    alt={track.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition truncate max-w-[180px] sm:max-w-xs">
                    {track.name}
                  </h5>
                  <p className="text-xs text-zinc-500 truncate max-w-[180px]">
                    {Array.isArray(track.artists) ? track.artists.map((a) => a.name).join(", ") : track.artists}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={(e) => handleTrackLike(track.id, e)}
                  className="text-zinc-500 hover:text-red-500 transition"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedTracks.includes(track.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
                <span className="text-xs text-zinc-500 mr-2">{formatDuration(track.duration_ms)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Search View
  const renderSearch = () => {
    const filteredTracks = DEMO_TRACKS.filter((track) => {
      const searchStr = `${track.name} ${
        Array.isArray(track.artists) ? track.artists.map((a) => a.name).join(" ") : track.artists
      }`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Search header bar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 focus:ring-1 focus:ring-zinc-750 text-white placeholder-zinc-500 rounded-full text-sm outline-none transition"
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            {searchQuery ? "Search Results" : "Explore Tracks"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => handlePlayTrack(track, DEMO_TRACKS)}
                className="flex items-center justify-between p-3 bg-zinc-950/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-xl transition duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-zinc-850">
                    <Image
                      src={track.album.images[0].url}
                      alt={track.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-5 h-5 text-emerald-400 fill-current" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-xs">
                      {track.name}
                    </h4>
                    <p className="text-xs text-zinc-500 truncate">
                      {Array.isArray(track.artists)
                        ? track.artists.map((a) => a.name).join(", ")
                        : track.artists}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToQueue(track);
                    }}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-full transition"
                    title="Add to Queue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-zinc-500 pr-2">{formatDuration(track.duration_ms)}</span>
                </div>
              </div>
            ))}

            {filteredTracks.length === 0 && (
              <div className="col-span-2 text-center py-12 text-zinc-500 italic">
                No matching tracks found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 3. Playlist View
  const renderPlaylist = () => {
    if (!activePlaylist) {
      return <div className="text-zinc-500 italic text-center py-12">Select a playlist from the sidebar</div>;
    }

    const tracks = activePlaylist.tracks?.items.map((i) => i.track) || [];

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Playlist Header */}
        <div className="flex flex-col sm:flex-row items-end gap-6 pb-6 border-b border-zinc-900/60">
          <div className="relative w-44 h-44 rounded-xl overflow-hidden shadow-2xl shrink-0">
            {activePlaylist.images?.[0]?.url ? (
              <Image
                src={activePlaylist.images[0].url}
                alt={activePlaylist.name}
                fill
                sizes="176px"
                className="object-cover animate-pulse"
                onLoadingComplete={(img) => img.classList.remove("animate-pulse")}
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Music className="w-16 h-16 text-zinc-600" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Playlist</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {activePlaylist.name}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">{activePlaylist.description}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <span className="text-emerald-400 font-semibold">Spotify Clone</span>
              <span>•</span>
              <span>{tracks.length} tracks</span>
            </div>
          </div>
        </div>

        {/* Playlist Action Bar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePlayPlaylist(activePlaylist)}
            className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-lg transition duration-200 transform hover:scale-[1.05]"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>
        </div>

        {/* Tracks table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-900/40 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 pl-4 w-12 text-center">#</th>
                <th className="py-3">Title</th>
                <th className="py-3 hidden md:table-cell">Album</th>
                <th className="py-3 w-12 text-center">
                  <Clock className="w-4 h-4 mx-auto" />
                </th>
                <th className="py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, idx) => (
                <tr
                  key={track.id}
                  onClick={() => handlePlayTrack(track, tracks)}
                  className={`group hover:bg-zinc-800/40 rounded-lg cursor-pointer transition ${
                    currentTrack?.id === track.id ? "bg-zinc-850/60" : ""
                  }`}
                >
                  <td className="py-3.5 pl-4 text-center font-medium text-zinc-500 text-sm">
                    <span className="group-hover:hidden">{idx + 1}</span>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-current mx-auto hidden group-hover:block" />
                  </td>
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded overflow-hidden shrink-0 border border-zinc-850">
                      <Image
                        src={track.album.images[0].url}
                        alt={track.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p
                        className={`text-sm font-semibold truncate max-w-[200px] sm:max-w-xs ${
                          currentTrack?.id === track.id ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {track.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {Array.isArray(track.artists)
                          ? track.artists.map((a) => a.name).join(", ")
                          : track.artists}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 text-zinc-400 text-sm hidden md:table-cell truncate max-w-xs">
                    {track.album.name}
                  </td>
                  <td className="py-3.5 text-center text-zinc-400 text-sm font-medium">
                    {formatDuration(track.duration_ms)}
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <button
                        onClick={(e) => handleTrackLike(track.id, e)}
                        className="text-zinc-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedTracks.includes(track.id) ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue(track);
                        }}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-full transition opacity-0 group-hover:opacity-100"
                        title="Add to Queue"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 4. Queue View
  const renderQueue = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Now Playing</h3>
        {currentTrack ? (
          <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-850">
                <Image
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {currentTrack.name}
                </h4>
                <p className="text-sm text-zinc-400 truncate">
                  {Array.isArray(currentTrack.artists)
                    ? currentTrack.artists.map((a) => a.name).join(", ")
                    : currentTrack.artists}
                </p>
              </div>
            </div>
            <div className="text-sm text-zinc-500 font-semibold">
              {formatDuration(currentTrack.duration_ms)}
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 italic">No track currently playing</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Upcoming Queue</h3>
          <span className="text-xs text-zinc-500 font-semibold">{queue.length} songs</span>
        </div>

        <div className="space-y-2">
          {queue.map((track, index) => {
            const isPlayingNow = currentTrack?.id === track.id;

            return (
              <div
                key={`${track.id}-${index}`}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer group transition ${
                  isPlayingNow
                    ? "bg-zinc-800/20 border-emerald-500/20"
                    : "bg-zinc-950/20 border-zinc-900/50 hover:bg-zinc-800/30 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-650 w-5 text-right">{index + 1}</span>
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border border-zinc-850">
                    <Image
                      src={track.album.images[0].url}
                      alt={track.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h5
                      className={`text-sm font-semibold truncate max-w-[180px] sm:max-w-sm ${
                        isPlayingNow ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {track.name}
                    </h5>
                    <p className="text-xs text-zinc-400 truncate">
                      {Array.isArray(track.artists)
                        ? track.artists.map((a) => a.name).join(", ")
                        : track.artists}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500 font-medium">
                    {formatDuration(track.duration_ms)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(track.id);
                    }}
                    className="p-1 hover:bg-zinc-800 hover:text-red-400 text-zinc-500 rounded transition opacity-0 group-hover:opacity-100"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {queue.length === 0 && (
            <p className="text-sm text-zinc-600 italic py-6 text-center">Queue is empty</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 bg-zinc-900/40 border border-zinc-900 rounded-xl overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {activeView === "home" && renderHome()}
      {activeView === "search" && renderSearch()}
      {activeView === "playlist" && renderPlaylist()}
      {activeView === "queue" && renderQueue()}
      {activeView === "lyrics" && <LyricsView />}
      {activeView === "visualizer" && <Visualizer />}
      {activeView === "rooms" && <CollaborationPanel />}
    </main>
  );
}
