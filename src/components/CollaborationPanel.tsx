"use client";

import React, { useEffect, useState } from "react";
import { usePlaybackStore } from "../store/usePlaybackStore";
import { DEMO_PLAYLISTS, DEMO_TRACKS } from "../utils/demoData";
import { Track } from "../types";
import {
  Users2,
  Plus,
  ArrowLeft,
  Disc,
  Play,
  Volume2,
  MessageSquare,
  Sparkles,
  Radio,
  ExternalLink,
} from "lucide-react";

export default function CollaborationPanel() {
  const {
    rooms,
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    addTrackToRoomPlaylist,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setIsPlaying,
    setQueue,
  } = usePlaybackStore();

  const [newRoomName, setNewRoomName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(DEMO_PLAYLISTS[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([
    { user: "Sarah K.", text: "Hey everyone! Welcome to the late night vibes.", time: "10:15 PM" },
    { user: "Alex M.", text: "This lofi mix is perfect for coding.", time: "10:17 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Simulating real-time updates inside the room (users joining, adding songs, chatting)
  useEffect(() => {
    if (!currentRoom) return;

    const interval = setInterval(() => {
      const mockActions = [
        // 1. Mock chat message
        () => {
          const names = ["Sarah K.", "Alex M.", "Jessica T.", "David L.", "Emma W."];
          const msgs = [
            "What a tune!",
            "Lovin this vibe.",
            "Can we add some synthwave next?",
            "Just pushed my code, chillin now.",
            "Awesome playlist! 🔥",
          ];
          const randomName = names[Math.floor(Math.random() * names.length)];
          const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
          setMessages((prev) => [
            ...prev,
            {
              user: randomName,
              text: randomMsg,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        },
        // 2. Mock song added to playlist
        () => {
          const randomTrack = DEMO_TRACKS[Math.floor(Math.random() * DEMO_TRACKS.length)];
          addTrackToRoomPlaylist(currentRoom.id, randomTrack);
          setMessages((prev) => [
            ...prev,
            {
              user: "System",
              text: `🎵 Alex M. added "${randomTrack.name}" to the room queue.`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        },
      ];

      // Execute a random mock action
      const randomAction = mockActions[Math.floor(Math.random() * mockActions.length)];
      randomAction();
    }, 12000); // Trigger every 12 seconds

    return () => clearInterval(interval);
  }, [currentRoom, addTrackToRoomPlaylist]);

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    createRoom(newRoomName, selectedPlaylistId);
    setNewRoomName("");
    setShowCreateModal(false);
    setMessages([
      { user: "System", text: `Room "${newRoomName}" created. You are now the host.`, time: "Just now" },
    ]);

    // Load room playlist tracks into active queue
    const playlist = DEMO_PLAYLISTS.find((p) => p.id === selectedPlaylistId);
    if (playlist?.tracks && playlist.tracks.items.length > 0) {
      const tracks = playlist.tracks.items.map((i) => i.track);
      setQueue(tracks);
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        user: "You",
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setChatInput("");
  };

  const handleJoin = (roomId: string) => {
    joinRoom(roomId);
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      const playlist = DEMO_PLAYLISTS.find((p) => p.id === room.playlistId);
      if (playlist?.tracks && playlist.tracks.items.length > 0) {
        const tracks = playlist.tracks.items.map((i) => i.track);
        setQueue(tracks);
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
      }
    }
    setMessages([
      { user: "System", text: "You joined the room. Audio playback synced with room host.", time: "Just now" },
      { user: "Sarah K.", text: "Hey! Glad you could join.", time: "Just now" },
    ]);
  };

  // Render Join View
  if (!currentRoom) {
    return (
      <div className="space-y-6 animate-fadeIn relative h-[82%]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900/60">
          <div className="flex items-center gap-3 select-none">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Collaborative Listening Rooms</h2>
              <p className="text-xs text-zinc-500 font-medium">Listen together in sync with other listeners</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-full shadow-lg transition duration-200 transform hover:scale-[1.03]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </button>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => {
            const playlist = DEMO_PLAYLISTS.find((p) => p.id === room.playlistId);
            return (
              <div
                key={room.id}
                className="p-5 bg-zinc-900/40 hover:bg-zinc-800/40 border border-zinc-900 hover:border-zinc-800/80 rounded-xl transition duration-300 flex flex-col justify-between h-44 group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white text-base truncate max-w-[200px] group-hover:text-emerald-400 transition">
                      {room.name}
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] bg-rose-550/20 text-rose-400 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      <Radio className="w-3 h-3" />
                      <span>Live</span>
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    Playlist: {playlist?.name || "Shared Mix"}
                  </p>
                  
                  {/* Listener avatars */}
                  <div className="flex items-center gap-1 mt-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {room.listeners.slice(0, 3).map((l, idx) => (
                        <img
                          key={idx}
                          src={l.avatar}
                          alt={l.name}
                          className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-zinc-950 object-cover"
                        />
                      ))}
                    </div>
                    {room.listeners.length > 3 && (
                      <span className="text-[10px] text-zinc-400 font-bold ml-1.5">
                        +{room.listeners.length - 3} listeners
                      </span>
                    )}
                    {room.listeners.length <= 3 && (
                      <span className="text-[10px] text-zinc-500 font-medium ml-1.5">
                        {room.listeners.length} listening
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(room.id)}
                  className="w-full py-2 px-4 bg-zinc-850 hover:bg-zinc-750 text-white font-semibold text-xs rounded-lg transition"
                >
                  Join Room & Sync Audio
                </button>
              </div>
            );
          })}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateRoomSubmit}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white">Create Collaborative Room</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Synthwave Jamming Session"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Select Room Playlist</label>
                <select
                  value={selectedPlaylistId}
                  onChange={(e) => setSelectedPlaylistId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700"
                >
                  {DEMO_PLAYLISTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400"
                >
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Render Active Room View
  return (
    <div className="flex flex-col md:flex-row gap-4 h-[82%] animate-fadeIn">
      {/* Left panel: Room Info & Chat */}
      <div className="flex-1 bg-zinc-950/40 rounded-2xl border border-zinc-900 p-5 flex flex-col justify-between h-full min-w-0">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Room Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900/60 mb-4 select-none">
            <button
              onClick={leaveRoom}
              className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition"
              title="Leave Room"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center overflow-hidden mx-4">
              <h3 className="font-bold text-white text-base truncate">{currentRoom.name}</h3>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                Sync Room host
              </p>
            </div>
            <div className="w-9 h-9" /> {/* spacer */}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {messages.map((m, idx) => {
              const isSystem = m.user === "System";
              const isMe = m.user === "You";

              return (
                <div
                  key={idx}
                  className={`flex flex-col text-xs ${
                    isSystem ? "items-center" : isMe ? "items-end" : "items-start"
                  }`}
                >
                  {!isSystem && (
                    <span className="text-[10px] text-zinc-500 font-semibold mb-0.5">
                      {m.user} • {m.time}
                    </span>
                  )}
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-xl leading-relaxed ${
                      isSystem
                        ? "bg-zinc-900/30 text-emerald-400 italic text-[10px]"
                        : isMe
                        ? "bg-emerald-500 text-black font-semibold rounded-tr-none"
                        : "bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-850"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-zinc-900/60">
          <input
            type="text"
            placeholder="Type a message to sync group..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
          <button
            type="submit"
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right panel: Participants & Shared Queue info */}
      <div className="w-full md:w-72 bg-zinc-950/40 rounded-2xl border border-zinc-900 p-5 flex flex-col justify-between h-full select-none">
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Room Active Listeners</h4>
          <div className="space-y-3">
            {currentRoom.listeners.map((l, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-zinc-950/30 rounded-xl border border-zinc-900">
                <img
                  src={l.avatar}
                  alt={l.name}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-800"
                />
                <div>
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">{l.name}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                    {l.isHost ? "Host / Anchor" : "Listener"}
                  </p>
                </div>
                {l.isHost && (
                  <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sync state control display */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl space-y-2 mt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Synced Playback Active</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Changing tracks or seeking timeline will update this room&apos;s queue stream for all active participants.
          </p>
        </div>
      </div>
    </div>
  );
}
