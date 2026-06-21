"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePlaybackStore } from "../store/usePlaybackStore";
import audioManager from "../utils/audioManager";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Mic2,
  Maximize2,
  ListMusic,
  Tv2,
  Users2,
  Music,
} from "lucide-react";
import Image from "next/image";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    repeatMode,
    isShuffled,
    activeView,
    setActiveView,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    currentRoom,
  } = usePlaybackStore();

  const [isMuted, setIsMuted] = useState(false);
  const prevVolume = useRef(volume);

  // Sync volume with audioManager
  useEffect(() => {
    if (isMuted) {
      audioManager.setVolume(0);
    } else {
      audioManager.setVolume(volume);
    }
  }, [volume, isMuted]);

  // Handle play/pause and track changes
  useEffect(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioManager.play(currentTrack);
    } else {
      audioManager.pause();
    }
  }, [currentTrack, isPlaying]);

  // Set up listeners for audioManager progress and end events
  useEffect(() => {
    audioManager.onTimeUpdate((time) => {
      setCurrentTime(time);
    });

    audioManager.onEnded(() => {
      nextTrack();
    });
  }, [setCurrentTime, nextTrack]);

  const handlePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioManager.seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume.current);
    } else {
      prevVolume.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const duration = currentTrack ? currentTrack.duration_ms / 1000 : 0;

  return (
    <footer className="h-24 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between select-none z-20">
      {/* Left section: Track details */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        {currentTrack ? (
          <>
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-800 shadow-md">
              <Image
                src={currentTrack.album.images[0].url}
                alt={currentTrack.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {currentTrack.name}
              </h4>
              <p className="text-xs text-zinc-400 truncate">
                {Array.isArray(currentTrack.artists)
                  ? currentTrack.artists.map((a) => a.name).join(", ")
                  : currentTrack.artists}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-700">
              <Music className="w-6 h-6" />
            </div>
            <p className="text-xs text-zinc-500 italic">No track playing</p>
          </div>
        )}
      </div>

      {/* Middle section: Playback Controls & Slider */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            title="Shuffle"
            className={`transition ${isShuffled ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] hover:text-emerald-300" : "text-zinc-400 hover:text-white"}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={prevTrack}
            className="text-zinc-400 hover:text-white transition"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 bg-white hover:scale-105 active:scale-95 text-black rounded-full flex items-center justify-center shadow transition duration-200"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-black" />
            ) : (
              <Play className="w-4 h-4 fill-current text-black ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="text-zinc-400 hover:text-white transition"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={toggleRepeat}
            title={`Repeat: ${repeatMode}`}
            className={`transition relative ${
              repeatMode !== "off"
                ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] hover:text-emerald-300"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === "track" && (
              <span className="absolute -top-1.5 -right-1 text-[8px] bg-emerald-500 text-black font-extrabold px-1 rounded-full scale-75">
                1
              </span>
            )}
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="w-full flex items-center gap-3 text-xs text-zinc-500 font-semibold">
          <span className="w-8 text-right select-none">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            disabled={!currentTrack}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 [&::-webkit-slider-runnable-track]:bg-zinc-800 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full"
          />
          <span className="w-8 text-left select-none">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right section: Tools & Volume */}
      <div className="flex items-center gap-4 w-[30%] justify-end min-w-[180px]">
        {currentRoom && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2 py-1 rounded-full max-w-[120px] truncate">
            <Users2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{currentRoom.name}</span>
          </div>
        )}

        <button
          onClick={() => setActiveView(activeView === "lyrics" ? "home" : "lyrics")}
          className={`p-1.5 rounded transition ${
            activeView === "lyrics" ? "text-emerald-400 bg-zinc-900 border border-zinc-850" : "text-zinc-400 hover:text-white"
          }`}
          title="Lyrics"
        >
          <Mic2 className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={() => setActiveView(activeView === "visualizer" ? "home" : "visualizer")}
          className={`p-1.5 rounded transition ${
            activeView === "visualizer" ? "text-emerald-400 bg-zinc-900 border border-zinc-850" : "text-zinc-400 hover:text-white"
          }`}
          title="Visualizer"
        >
          <Tv2 className="w-4.5 h-4.5" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
        </div>
      </div>
    </footer>
  );
}
