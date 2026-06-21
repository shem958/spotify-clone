import { Playlist, Track } from "../types";

export const DEMO_TRACKS: Track[] = [
  {
    id: "demo-track-1",
    name: "Neon Horizon",
    artists: [{ name: "Synthwave Collective" }],
    album: {
      name: "Retro City Beats",
      images: [{ url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop" }],
    },
    duration_ms: 372000, // Duration of SoundHelix Song 1 (approx 6:12)
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    localUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    uri: "spotify:track:demo1",
  },
  {
    id: "demo-track-2",
    name: "Code & Coffee",
    artists: [{ name: "Lofi Dreamer" }],
    album: {
      name: "Midnight Sessions",
      images: [{ url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=300&h=300&fit=crop" }],
    },
    duration_ms: 425000, // SoundHelix Song 2 duration (approx 7:05)
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    localUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    uri: "spotify:track:demo2",
  },
  {
    id: "demo-track-3",
    name: "Summer Acoustic Breeze",
    artists: [{ name: "Acoustic Explorer" }],
    album: {
      name: "Sunny Horizons",
      images: [{ url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" }],
    },
    duration_ms: 302000, // SoundHelix Song 4 duration (approx 5:02)
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    localUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    uri: "spotify:track:demo3",
  },
  {
    id: "demo-track-4",
    name: "Deep Space Ambient",
    artists: [{ name: "Cosmic Voyager" }],
    album: {
      name: "Beyond the Stars",
      images: [{ url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop" }],
    },
    duration_ms: 318000, // SoundHelix Song 8 duration (approx 5:18)
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    localUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    uri: "spotify:track:demo4",
  },
];

export const DEMO_PLAYLISTS: Playlist[] = [
  {
    id: "demo-playlist-1",
    name: "Late Night Chill Sessions 🎧",
    description: "Relax, unwind and vibe with this premium synthwave and lofi mix.",
    images: [{ url: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop" }],
    tracks: {
      items: [
        { track: DEMO_TRACKS[0] },
        { track: DEMO_TRACKS[1] },
        { track: DEMO_TRACKS[2] },
        { track: DEMO_TRACKS[3] },
      ],
      total: 4,
    },
  },
  {
    id: "demo-playlist-2",
    name: "Lo-Fi Coding Focus Code 💻",
    description: "Keep your flow state lock with minimal interruptions and maximum focus.",
    images: [{ url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop" }],
    tracks: {
      items: [
        { track: DEMO_TRACKS[1] },
        { track: DEMO_TRACKS[3] },
        { track: DEMO_TRACKS[0] },
      ],
      total: 3,
    },
  },
];

export const LYRICS_DATABASE: Record<string, string> = {
  "demo-track-1": `[00:00.00] (Instrumental Synth Intro)
[00:05.00] Synthesizers start to rise...
[00:10.00] Driving down the neon street at midnight
[00:15.00] Seeing stars reflection in the headlights
[00:20.00] Cyber dreams are calling out your name tonight
[00:25.00] Speeding past the skyscrapers so bright
[00:30.00] (Synth Solo Build Up)
[00:36.00] We are the children of the neon lights
[00:41.00] Running away into the endless nights
[00:46.00] No speed limits, no fears in sight
[00:51.00] In this retro world, everything is alright
[00:56.00] (Synthesizer Interlude)
[01:06.00] Analog feelings running through my veins
[01:11.00] Washing away all of the day's strains
[01:16.00] Meet me where the grid starts to fade
[01:21.00] Live in the digital memories we made`,

  "demo-track-2": `[00:00.00] (Relaxing Lofi Beat Starts)
[00:05.00] Fresh coffee brewing in the pot
[00:10.00] Open up the editor, type a lot
[00:15.00] Bugs in the console, let them go
[00:20.00] Keep the rhythm steady, nice and slow
[00:25.00] Rain outside is tapping on the glass
[00:30.00] Hoping that these tests will finally pass
[00:35.00] Chill vibes flow through my headphones
[00:40.00] Building code inside our comfort zones
[00:45.00] (Mellow Saxophone Solo)
[00:55.00] Scrolling through lines, solving the maze
[01:00.00] Coding away in a deep lofi daze
[01:05.00] Variables align, functions compile
[01:10.00] Taking a sip, wearing a smile`,

  "demo-track-3": `[00:00.00] (Warm Acoustic Guitar Strumming)
[00:06.00] Walking down the sandy shore today
[00:12.00] Feeling all my worries drift away
[00:18.00] Sun is shining golden on your face
[00:24.00] We have found our perfect summer place
[00:30.00] Wind is blowing whispers from the sea
[00:36.00] You and I are happy, wild and free
[00:42.00] (Acoustic Solo)
[00:50.00] Laying on the grass under the tree
[00:56.00] Life is simple, just the way it should be
[01:02.00] Let the acoustic melody float
[01:08.00] Writing our feelings in a small note`,

  "demo-track-4": `[00:00.00] (Ambient Cosmic Pads Intro)
[00:10.00] Floating in the zero gravity zone
[00:20.00] Looking at the Earth, so far from home
[00:30.00] Constellations shine like crystal dust
[00:40.00] In the silence of the void, we trust
[00:50.00] (Ethereal Electric Piano Chords)
[01:05.00] Passing nebulae of purple and blue
[01:15.00] A space odyssey created for two
[01:25.00] Drift forever in the starlight stream
[01:35.00] Living in this cosmic dreaming theme`,
};
