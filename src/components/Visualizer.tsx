"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePlaybackStore } from "../store/usePlaybackStore";
import audioManager from "../utils/audioManager";
import { Tv, Sparkles, Volume2, Music } from "lucide-react";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentTrack, isPlaying } = usePlaybackStore();
  const [visualMode, setVisualMode] = useState<"bars" | "wave">("bars");

  // Keep track of animation frame to cancel on unmount
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system variables
    const particles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.5 + 0.2),
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Extract raw audio data if available
      const analyser = audioManager.getAnalyser();
      let bufferLength = 0;
      let dataArray = new Uint8Array(0);
      let hasRealAudio = false;

      if (analyser && isPlaying) {
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        if (visualMode === "bars") {
          analyser.getByteFrequencyData(dataArray);
        } else {
          analyser.getByteTimeDomainData(dataArray);
        }
        
        // Double check we actually have non-zero data
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        if (sum > 0) {
          hasRealAudio = true;
        }
      }

      // Calculate average frequency / volume for secondary animations
      let average = 0;
      if (hasRealAudio) {
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        average = sum / dataArray.length;
      } else if (isPlaying) {
        // Mock average if playing without direct analyser connection
        average = 40 + Math.sin(Date.now() / 200) * 10;
      }

      // 1. Draw floating particles
      particles.forEach((p) => {
        // Speed up particles slightly with higher volume
        const currentSpeed = p.speedY * (1 + average / 60);
        p.y += currentSpeed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${p.opacity * (0.5 + average / 100)})`; // Neon green glow
        ctx.fill();
      });

      // 2. Render Audio Graphs
      if (visualMode === "bars") {
        const barWidth = (width / (hasRealAudio ? bufferLength / 1.5 : 64)) * 0.8;
        const barGap = 3;
        const numBars = hasRealAudio ? Math.floor(bufferLength / 1.5) : 64;

        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(16, 185, 129, 0.4)";

        for (let i = 0; i < numBars; i++) {
          let value = 0;

          if (hasRealAudio) {
            value = dataArray[i];
          } else {
            // Simulated bounce if no raw stream access (browser policy or fallback)
            const timeModifier = Date.now() / 300;
            value = isPlaying
              ? Math.max(10, Math.sin(i * 0.15 + timeModifier) * 60 + Math.cos(i * 0.05 + timeModifier * 0.5) * 40 + 100)
              : 8 + Math.sin(i * 0.2 + Date.now() / 800) * 4;
          }

          // Map 0-255 values to canvas height
          const barHeight = (value / 255) * (height * 0.65);
          const x = i * (barWidth + barGap) + (width - numBars * (barWidth + barGap)) / 2;
          const y = height - barHeight - 40;

          // Gradient color fill
          const gradient = ctx.createLinearGradient(x, y, x, height);
          gradient.addColorStop(0, "#10b981"); // Emerald 500
          gradient.addColorStop(0.5, "#3b82f6"); // Blue 500
          gradient.addColorStop(1, "rgba(0,0,0,0)");

          ctx.fillStyle = gradient;
          
          // Draw rounded bars
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
          ctx.fill();
        }
        
        ctx.shadowBlur = 0; // reset shadow
      } else {
        // Waveform/Oscilloscope visualizer
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#10b981"; // Emerald
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(16, 185, 129, 0.6)";

        const sliceWidth = width / (hasRealAudio ? bufferLength : 100);
        let x = 0;

        for (let i = 0; i < (hasRealAudio ? bufferLength : 100); i++) {
          let y = 0;
          if (hasRealAudio) {
            const v = dataArray[i] / 128.0;
            y = (v * height) / 2;
          } else {
            // Simulated sine wave
            const timeModifier = Date.now() / 150;
            const waveValue = isPlaying
              ? Math.sin(i * 0.1 + timeModifier) * 50 + Math.cos(i * 0.05 - timeModifier * 0.3) * 30
              : Math.sin(i * 0.08 + Date.now() / 1000) * 10;
            y = height / 2 + waveValue;
          }

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        ctx.shadowBlur = 0; // reset shadow
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, visualMode]);

  return (
    <div className="relative w-full h-[82%] bg-zinc-950/40 rounded-2xl border border-zinc-900 overflow-hidden flex flex-col p-6 animate-fadeIn">
      {/* Visualizer Header Controls */}
      <div className="flex items-center justify-between z-10 border-b border-zinc-900/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Full-Screen Visualizer</h2>
            <p className="text-xs text-zinc-500 font-medium">
              {currentTrack ? `${currentTrack.name} — Live Analysis` : "Ambient Spectrum Mode"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setVisualMode("bars")}
            className={`px-3 py-1.5 rounded-md transition ${
              visualMode === "bars" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Spectrum Bars
          </button>
          <button
            onClick={() => setVisualMode("wave")}
            className={`px-3 py-1.5 rounded-md transition ${
              visualMode === "wave" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Oscilloscope
          </button>
        </div>
      </div>

      {/* Live Canvas Area */}
      <div className="flex-1 w-full relative min-h-0">
        <canvas ref={canvasRef} className="w-full h-full block rounded-xl" />
        
        {/* Floating track card overlay */}
        {currentTrack && (
          <div className="absolute bottom-6 left-6 p-4 bg-zinc-950/70 border border-zinc-850/80 backdrop-blur-md rounded-xl flex items-center gap-3 shadow-2xl max-w-xs transition duration-300 hover:bg-zinc-950/95 cursor-default select-none">
            <div className="relative w-12 h-12 rounded overflow-hidden border border-zinc-800 shrink-0 shadow-lg">
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-extrabold text-white truncate">{currentTrack.name}</h4>
              <p className="text-[10px] text-zinc-400 truncate">
                {Array.isArray(currentTrack.artists)
                  ? currentTrack.artists.map((a) => a.name).join(", ")
                  : currentTrack.artists}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">
                <Volume2 className="w-3 h-3 animate-bounce" />
                <span>Streaming fallback</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
