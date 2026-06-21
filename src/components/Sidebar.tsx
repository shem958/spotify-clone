"use client";

import React from "react";
import { signOut } from "next-auth/react";
import {
  Home,
  Search,
  Library,
  ListMusic,
  Mic2,
  Users2,
  LogOut,
  Music,
  PlusCircle,
  Radio,
} from "lucide-react";
import { usePlaybackStore } from "../store/usePlaybackStore";
import { Playlist } from "../types";
import Image from "next/image";

interface SidebarProps {
  playlists: Playlist[];
  user: {
    name: string;
    image?: string;
    email?: string;
  };
}

export default function Sidebar({ playlists, user }: SidebarProps) {
  const {
    activeView,
    setActiveView,
    setActivePlaylist,
    setQueue,
    currentRoom,
  } = usePlaybackStore();

  const isDemoUser = user.email === "demo@spotify-clone.local";

  const handleLogout = () => {
    if (isDemoUser) {
      // Clear demo cookie and redirect
      document.cookie = "demo-mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = "/login";
    } else {
      signOut({ callbackUrl: "/login" });
    }
  };

  const selectPlaylist = (playlist: Playlist) => {
    setActivePlaylist(playlist);
    setActiveView("playlist");
    if (playlist.tracks && playlist.tracks.items.length > 0) {
      setQueue(playlist.tracks.items.map((item) => item.track));
    }
  };

  interface NavItem {
    view: "home" | "search" | "playlist" | "queue" | "lyrics" | "visualizer" | "rooms";
    label: string;
    icon: React.ComponentType<any>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { view: "home", label: "Home", icon: Home },
    { view: "search", label: "Search", icon: Search },
    { view: "queue", label: "Play Queue", icon: ListMusic },
    { view: "lyrics", label: "Lyrics", icon: Mic2 },
    { view: "rooms", label: "Collaborative", icon: Users2, badge: currentRoom ? "Live" : undefined },
  ];

  return (
    <aside className="w-64 bg-zinc-950/80 backdrop-blur-md border border-zinc-900 rounded-xl flex flex-col h-full overflow-hidden select-none">
      {/* App Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-zinc-900">
        <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <Music className="w-5 h-5 text-black" />
        </div>
        <div>
          <span className="font-bold text-white text-lg tracking-tight">Spotify</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full ml-2">
            Clone
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 space-y-1.5">
        {navItems.map(({ view, label, icon: Icon, badge }) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition duration-250 group ${
              activeView === view
                ? "bg-zinc-800/80 text-white shadow-md shadow-black/10"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  activeView === view ? "text-emerald-400" : "text-zinc-400"
                }`}
              />
              <span>{label}</span>
            </div>
            {badge && (
              <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Playlist Divider */}
      <div className="px-6 py-2 flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase tracking-wider">
        <span>Playlists</span>
        <button className="hover:text-white transition duration-200">
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Playlists List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => selectPlaylist(playlist)}
            className="w-full text-left px-4 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition duration-200 truncate flex items-center gap-2"
          >
            <Radio className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="truncate">{playlist.name}</span>
          </button>
        ))}
        {playlists.length === 0 && (
          <p className="text-xs text-zinc-600 px-4 py-2 italic">No playlists found</p>
        )}
      </div>

      {/* User Profile / Logout */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          {user.image ? (
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-zinc-800">
              <Image
                src={user.image}
                alt={user.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white shrink-0">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider font-bold">
              {isDemoUser ? "Demo Account" : "Spotify Premium"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log Out"
          className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-red-400 transition duration-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
