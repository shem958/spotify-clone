# Spotify Clone - High-Fidelity Audio Streaming Web Player

A modern, production-grade audio streaming platform built using **Next.js 14 (App Router)**, **Tailwind CSS**, **NextAuth.js**, and **Zustand**. 

This application transforms a standard API-consuming layout into an immersive audio experience featuring real-time canvas visualizations, synchronized lyrics, simulated collaborative rooms, and offline PWA capabilities.

---

## 🌟 Key Features

### 1. Modern Next.js 14 Architecture
* **Unified App Router:** Authentication endpoints transitioned fully into App Router Route Handlers (`src/app/api/auth/[...nextauth]/route.ts`).
* **Route Protection Middleware:** Global middleware (`src/middleware.ts`) intercepts unauthorized visits and redirects to `/login`.
* **Server-First Fetching:** Uses React Server Components (RSC) to retrieve user metadata and playlist records directly on the server before client rendering.
* **Premium Demo Mode:** Allows testing the application instantly (bypassing authentication) via a `demo-mode` cookie.

### 2. Playback Synchronization & Centralized State
* **Zustand State Store:** Manages active queues, play/pause switches, shuffle, repeat modes, histories, volume levels, and collaboration rooms.
* **Fallback Audio Manager:** Features a custom singleton manager (`src/utils/audioManager.ts`) utilizing the native HTML5 `Audio` API coupled with Web Audio API nodes (`AudioContext` and `AnalyserNode`) for raw frequency spectrum analysis.
* **LRC Timed Lyrics Parsing:** Automatically parses timestamped LRC text formats and scrolls the active line to the center of the viewport. Users can click any lyric line to seek directly to that second.

### 3. High-Fidelity UI & Audio UX
* **Dynamic Background Color Extraction:** Analyzes the active track's cover art on a client-side canvas, extracting the dominant color and applying it as a smooth, animated radial gradient backdrop.
* **Interactive Canvas Visualizer:** Displays live bouncing audio spectrum bars or a waveform oscilloscope based on frequency data.
* **Micro-interactions:** Interactive hover states on track tables, progressive play overlays, hover timeline sliders, and skeleton pulse load configurations.

### 4. Collaborative Rooms & PWAs
* **Listening Rooms:** Join live collaborative music rooms. Includes simulated live chat, participant entries, and automatic additions of tracks to the queue.
* **Progressive Web App (PWA):** Service worker cached files (`public/sw.js`) ensure core layouts remain active offline.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shem958/spotify-clone.git
   cd spotify-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file at the root of the project:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_jwt_secret_string

   # Spotify API Credentials
   SPOTIFY_CLIENT_ID=your_spotify_developer_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_developer_client_secret
   ```
   *(To obtain API credentials, register an application at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)).*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts         # NextAuth.js App Router route handler
│   ├── login/
│   │   └── page.tsx         # Glassmorphic Login page with Demo Mode
│   ├── layout.tsx           # PWA registration and layout
│   └── page.tsx             # Server Component data resolution
├── components/
│   ├── Dashboard.tsx        # Grid controller & theme color provider
│   ├── Sidebar.tsx          # Navigation panel & playlist list
│   ├── MainContent.tsx      # Main panel switching (Home, Search, Playlist, Queue)
│   ├── PlayerBar.tsx        # Bottom music player & timeline controller
│   ├── Visualizer.tsx       # Live frequency canvas visualizer
│   ├── LyricsView.tsx       # Scrollable LRC timed lyrics view
│   ├── CollaborationPanel.tsx # simulated multiplayer listening rooms
│   └── Providers.tsx        # Client SessionProvider context wrapper
├── store/
│   └── usePlaybackStore.ts  # Centralized Zustand state engine
├── utils/
│   ├── audioManager.ts      # Web Audio API singleton player
│   ├── authOptions.ts       # Shared NextAuth configurations
│   ├── color.ts             # Dominant color canvas extraction hook
│   └── demoData.ts          # Timed LRC lyrics database & royalty-free tracks
└── types.d.ts               # Custom interfaces and module typings
```
