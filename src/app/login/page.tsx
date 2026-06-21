"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Music, Play } from "lucide-react";

export default function LoginPage() {
  const handleDemoMode = () => {
    // Set demo-mode cookie for middleware bypass
    document.cookie = "demo-mode=true; path=/; max-age=86400"; // 24 hours
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-green-500/15 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />

      <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-2xl shadow-2xl text-center flex flex-col items-center">
        {/* Floating Logo Icon */}
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 group cursor-default">
          <Music className="w-8 h-8 text-black animate-bounce" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Spotify <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">Clone</span>
        </h1>
        <p className="text-sm text-zinc-400 mb-8 max-w-xs">
          A high-fidelity immersive web player with synchronized lyrics, real-time collaboration, and audio visualizer.
        </p>

        {/* Buttons Section */}
        <div className="w-full space-y-4">
          <button
            onClick={() => signIn("spotify", { callbackUrl: "/" })}
            className="w-full py-4 px-6 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/15 flex items-center justify-center gap-2"
          >
            <Music className="w-5 h-5 fill-current" />
            <span>Sign in with Spotify</span>
          </button>

          <button
            onClick={handleDemoMode}
            className="w-full py-4 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-full border border-zinc-700/80 transition duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-emerald-400" />
            <span>Try Demo Mode</span>
          </button>
        </div>

        {/* Info notice */}
        <div className="mt-8 text-xs text-zinc-500 leading-relaxed max-w-xs">
          Demo mode lets you test all features including Audio Canvas Visualizer, Persistent Queuing, and Collaborative Rooms immediately.
        </div>
      </div>
    </div>
  );
}
