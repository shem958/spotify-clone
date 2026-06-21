import { create } from "zustand";
import { Track, Playlist, CollaborativeRoom } from "../types";

interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  originalQueue: Track[]; // stores pre-shuffled order
  history: Track[];
  volume: number;
  currentTime: number;
  repeatMode: "off" | "track" | "queue";
  isShuffled: boolean;
  activeView: "home" | "search" | "playlist" | "queue" | "lyrics" | "visualizer" | "rooms";
  activePlaylist: Playlist | null;
  rooms: CollaborativeRoom[];
  currentRoom: CollaborativeRoom | null;

  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setActiveView: (view: "home" | "search" | "playlist" | "queue" | "lyrics" | "visualizer" | "rooms") => void;
  setActivePlaylist: (playlist: Playlist | null) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;

  // Collaborative Room actions
  createRoom: (name: string, playlistId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  addTrackToRoomPlaylist: (roomId: string, track: Track) => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  originalQueue: [],
  history: [],
  volume: 70,
  currentTime: 0,
  repeatMode: "off",
  isShuffled: false,
  activeView: "home",
  activePlaylist: null,
  rooms: [
    {
      id: "room-1",
      name: "Late Night Chill Sessions 🎧",
      playlistId: "demo-playlist-1",
      listeners: [
        { name: "Sarah K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isHost: true },
        { name: "Alex M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
        { name: "Jessica T.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }
      ],
      activeTrackId: "demo-track-1"
    },
    {
      id: "room-2",
      name: "Lo-Fi Coding Focus Code 💻",
      playlistId: "demo-playlist-2",
      listeners: [
        { name: "David L.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", isHost: true },
        { name: "Emma W.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }
      ],
      activeTrackId: "demo-track-3"
    }
  ],
  currentRoom: null,

  setCurrentTrack: (track) => {
    const { history, currentTrack } = get();
    const newHistory = [...history];
    if (currentTrack && currentTrack.id !== track?.id) {
      // Avoid duplicates in history
      if (newHistory.length === 0 || newHistory[newHistory.length - 1].id !== currentTrack.id) {
        newHistory.push(currentTrack);
      }
    }
    set({ currentTrack, history: newHistory });
    // If track is set, start playing automatically
    if (track) {
      set({ currentTrack: track, isPlaying: true, currentTime: 0 });
    }
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setQueue: (queue) => set({ queue, originalQueue: [...queue] }),

  addToQueue: (track) => {
    const { queue } = get();
    // Prevent duplicate in queue for simplicity, or just append
    set({ queue: [...queue, track] });
  },

  removeFromQueue: (trackId) => {
    const { queue } = get();
    set({ queue: queue.filter((t) => t.id !== trackId) });
  },

  reorderQueue: (startIndex, endIndex) => {
    const { queue } = get();
    const result = Array.from(queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ queue: result });
  },

  setVolume: (volume) => set({ volume }),

  setCurrentTime: (currentTime) => set({ currentTime }),

  setActiveView: (activeView) => set({ activeView }),

  setActivePlaylist: (activePlaylist) => set({ activePlaylist }),

  toggleShuffle: () => {
    const { isShuffled, queue, originalQueue, currentTrack } = get();
    if (!isShuffled) {
      // Shuffle queue, but keep currentTrack as first element or just random
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      set({
        isShuffled: true,
        originalQueue: [...queue],
        queue: shuffled,
      });
    } else {
      set({
        isShuffled: false,
        queue: [...originalQueue],
      });
    }
  },

  toggleRepeat: () => {
    const { repeatMode } = get();
    let nextMode: "off" | "track" | "queue" = "off";
    if (repeatMode === "off") nextMode = "track";
    else if (repeatMode === "track") nextMode = "queue";
    set({ repeatMode: nextMode });
  },

  nextTrack: () => {
    const { queue, currentTrack, repeatMode } = get();
    if (queue.length === 0) return;

    if (repeatMode === "track" && currentTrack) {
      // Re-trigger current track
      set({ currentTime: 0 });
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    if (currentIndex === -1) {
      // Play first track in queue
      set({ currentTrack: queue[0], currentTime: 0, isPlaying: true });
    } else if (currentIndex < queue.length - 1) {
      // Play next track
      set({ currentTrack: queue[currentIndex + 1], currentTime: 0, isPlaying: true });
    } else {
      // We reached the end of the queue
      if (repeatMode === "queue") {
        set({ currentTrack: queue[0], currentTime: 0, isPlaying: true });
      } else {
        set({ isPlaying: false, currentTime: 0 });
      }
    }
  },

  prevTrack: () => {
    const { queue, currentTrack, history } = get();

    // If there is history, play the previous track from history
    if (history.length > 0) {
      const prev = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      set({
        currentTrack: prev,
        history: newHistory,
        currentTime: 0,
        isPlaying: true,
      });
      return;
    }

    if (queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1], currentTime: 0, isPlaying: true });
    } else {
      // Re-play first track
      set({ currentTime: 0 });
    }
  },

  createRoom: (name, playlistId) => {
    const newRoom: CollaborativeRoom = {
      id: `room-${Date.now()}`,
      name,
      playlistId,
      listeners: [
        { name: "You (Host)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", isHost: true }
      ]
    };
    set((state) => ({
      rooms: [...state.rooms, newRoom],
      currentRoom: newRoom,
      activeView: "rooms"
    }));
  },

  joinRoom: (roomId) => {
    const { rooms } = get();
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      // Check if already in it
      const alreadyJoined = room.listeners.some((l) => l.name === "You");
      const updatedListeners = alreadyJoined 
        ? room.listeners 
        : [...room.listeners, { name: "You", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }];

      const updatedRoom = { ...room, listeners: updatedListeners };
      const updatedRooms = rooms.map((r) => r.id === roomId ? updatedRoom : r);

      set({
        rooms: updatedRooms,
        currentRoom: updatedRoom,
        activeView: "rooms"
      });
    }
  },

  leaveRoom: () => {
    const { currentRoom, rooms } = get();
    if (currentRoom) {
      const updatedListeners = currentRoom.listeners.filter((l) => l.name !== "You");
      const updatedRooms = rooms.map((r) => 
        r.id === currentRoom.id ? { ...r, listeners: updatedListeners } : r
      );
      set({
        rooms: updatedRooms,
        currentRoom: null,
        activeView: "home"
      });
    }
  },

  addTrackToRoomPlaylist: (roomId, track) => {
    set((state) => {
      const room = state.rooms.find((r) => r.id === roomId);
      if (!room) return state;
      
      // We can also trigger simulated toast or listener updates when a track is added
      return {
        // Trigger visual update for client
        queue: [...state.queue, track]
      };
    });
  }
}));
