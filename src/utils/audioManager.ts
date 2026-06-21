import { Track } from "../types";

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private timeUpdateCallback: ((time: number) => void) | null = null;
  private endedCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio();
      this.audio.crossOrigin = "anonymous"; // Crucial for Web Audio API visualizer CORS

      this.audio.addEventListener("timeupdate", () => {
        if (this.audio && this.timeUpdateCallback) {
          this.timeUpdateCallback(this.audio.currentTime);
        }
      });

      this.audio.addEventListener("ended", () => {
        if (this.endedCallback) {
          this.endedCallback();
        }
      });
    }
  }

  public initAudioContext() {
    if (!this.audio || this.audioContext) return;

    try {
      // Lazy init AudioContext on user interaction
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256; // Fast Fourier Transform size

      this.source = this.audioContext.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (e) {
      console.warn("Failed to initialize Web Audio API Context:", e);
    }
  }

  public play(track: Track) {
    if (!this.audio) return;
    this.initAudioContext();

    // If AudioContext is suspended (browser policy), resume it
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const url = track.localUrl || track.preview_url || "";
    if (this.audio.src !== url) {
      this.audio.src = url;
    }
    this.audio.play().catch((err) => {
      console.error("Audio playback error:", err);
    });
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public resume() {
    if (this.audio) {
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      this.audio.play().catch((err) => {
        console.error("Audio resume error:", err);
      });
    }
  }

  public seek(seconds: number) {
    if (this.audio) {
      this.audio.currentTime = seconds;
    }
  }

  public setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public onTimeUpdate(callback: (time: number) => void) {
    this.timeUpdateCallback = callback;
  }

  public onEnded(callback: () => void) {
    this.endedCallback = callback;
  }

  public getDuration(): number {
    return this.audio ? this.audio.duration : 0;
  }
}

// Export as a singleton
const audioManager = new AudioManager();
export default audioManager;
