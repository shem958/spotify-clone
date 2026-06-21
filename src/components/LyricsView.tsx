"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePlaybackStore } from "../store/usePlaybackStore";
import { LYRICS_DATABASE } from "../utils/demoData";
import { LyricLine } from "../types";
import { Mic2, Music, RefreshCw } from "lucide-react";
import audioManager from "../utils/audioManager";

export default function LyricsView() {
  const { currentTrack, currentTime, isPlaying } = usePlaybackStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parse LRC lyrics from string
  const lyrics = useMemo<LyricLine[]>(() => {
    if (!currentTrack || !LYRICS_DATABASE[currentTrack.id]) return [];

    const rawLrc = LYRICS_DATABASE[currentTrack.id];
    const lines = rawLrc.split("\n");
    const parsedLines: LyricLine[] = [];

    // Match lines like: [01:23.45] text
    const lrcRegex = /\[(\d+):(\d+)(?:\.(\d+))?\](.*)/;

    lines.forEach((line) => {
      const match = lrcRegex.exec(line);
      if (match) {
        const mins = parseInt(match[1]);
        const secs = parseInt(match[2]);
        const ms = match[3] ? parseInt(match[3]) : 0;
        const text = match[4].trim();

        // Convert to absolute seconds
        const timeInSeconds = mins * 60 + secs + (ms > 100 ? ms / 1000 : ms / 100);
        parsedLines.push({ time: timeInSeconds, text });
      }
    });

    return parsedLines.sort((a, b) => a.time - b.time);
  }, [currentTrack]);

  // Find active line index based on current time
  const activeLineIndex = useMemo(() => {
    if (lyrics.length === 0) return -1;

    // Find the latest line that has time <= currentTime
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break; // since it's sorted, we can stop
      }
    }
    return index;
  }, [lyrics, currentTime]);

  // Auto-scroll active lyric into view
  const activeLineRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLineIndex]);

  const handleLineClick = (time: number) => {
    audioManager.seek(time);
    usePlaybackStore.getState().setCurrentTime(time);
  };

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-[82%] text-zinc-500 gap-4">
        <Mic2 className="w-16 h-16 text-zinc-700 animate-pulse" />
        <p className="italic text-sm">Select a track and play to see synchronized lyrics</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[82%] bg-zinc-950/40 rounded-2xl border border-zinc-900 overflow-hidden flex flex-col p-6 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center gap-3 z-10 border-b border-zinc-900/60 pb-4 mb-4 select-none">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <Mic2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Live Synced Lyrics</h2>
          <p className="text-xs text-zinc-500 font-medium">
            {currentTrack.name} — {Array.isArray(currentTrack.artists) ? currentTrack.artists[0].name : currentTrack.artists}
          </p>
        </div>
      </div>

      {/* Lyrics container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-32 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent text-center select-none"
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeLineIndex;
          const isPassed = idx < activeLineIndex;

          return (
            <button
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => handleLineClick(line.time)}
              className={`block w-full text-center text-xl md:text-2xl font-extrabold focus:outline-none transition duration-500 cursor-pointer transform hover:scale-105 ${
                isActive
                  ? "text-emerald-400 scale-[1.08] drop-shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                  : isPassed
                  ? "text-zinc-550 opacity-60"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {line.text || "•••"}
            </button>
          );
        })}

        {lyrics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-650 gap-3">
            <Music className="w-12 h-12" />
            <p className="text-sm italic">Lyrics not available for this track.</p>
            <p className="text-xs text-zinc-700 leading-relaxed max-w-xs mx-auto">
              (Try playing &quot;Neon Horizon&quot; or &quot;Code &amp; Coffee&quot; to see full timed synchronization lyrics).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
