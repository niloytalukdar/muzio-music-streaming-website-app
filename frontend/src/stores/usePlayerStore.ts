"use client";

import { create } from "zustand";

export interface Track {
  id: string;
  title: string;
  artistName: string;
  album?: string;
  genre?: string;
  artworkUrl?: string | null;
  sourceUrl?: string;
  audioStreamUrl?: string | null;
  provider: string;
  durationSeconds: number;
  isPlayable: boolean;
  playbackType?: string;
  licenseInformation?: string | null;
  likes?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  history: Track[];
  isShuffled: boolean;
  repeatMode: "off" | "one" | "all";
  playbackMode: "audio" | "youtube" | null;
  youtubeVideoId: string | null;
  
  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setProgress: (currentTime: number, duration: number) => void;
}

export function extractYouTubeId(track: Track): string | null {
  if (track.provider?.toLowerCase().includes("youtube") && track.id.startsWith("youtube:")) {
    const raw = track.id.slice("youtube:".length);
    return /^[\w-]{11}$/.test(raw) ? raw : null;
  }
  if (track.sourceUrl?.includes("youtube.com/watch?v=")) {
    const match = track.sourceUrl.match(/[?&]v=([\w-]{11})/);
    return match ? match[1] : null;
  }
  return null;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.85,
  currentTime: 0,
  duration: 0,
  queue: [],
  history: [],
  isShuffled: false,
  repeatMode: "off",
  playbackMode: null,
  youtubeVideoId: null,

  playTrack: async (track, newQueue) => {
    const ytId = extractYouTubeId(track);
    
    // First set basic track data
    set((state) => ({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: track.durationSeconds || 0,
      playbackMode: ytId ? "youtube" : "audio",
      youtubeVideoId: ytId,
      queue: newQueue ?? (state.queue.length > 0 ? state.queue : [track]),
      history: state.currentTrack ? [state.currentTrack, ...state.history].slice(0, 50) : state.history,
    }));

    // If it's a YouTube track and doesn't have an audioStreamUrl yet, attempt stream resolution
    if (ytId && !track.audioStreamUrl) {
      try {
        const res = await fetch(`/api/youtube/stream?videoId=${ytId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.streamUrl || data.proxiedStreamUrl) {
            set((state) => {
              if (state.currentTrack?.id === track.id) {
                return {
                  currentTrack: {
                    ...track,
                    audioStreamUrl: data.streamUrl || data.proxiedStreamUrl,
                  },
                };
              }
              return state;
            });
          }
        }
      } catch {
        // Keeps YouTube IFrame embed as stable fallback
      }
    }
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  seek: (seconds) => {
    set({ currentTime: seconds });
  },

  setVolume: (val) => {
    set({ volume: Math.max(0, Math.min(1, val)) });
  },

  nextTrack: () => {
    const { queue, currentTrack, repeatMode, isShuffled } = get();
    if (queue.length === 0) return;

    if (repeatMode === "one" && currentTrack) {
      set({ currentTime: 0, isPlaying: true });
      return;
    }

    const currentIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : -1;
    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    if (isShuffled && queue.length > 1) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    const next = queue[nextIndex];
    if (next) {
      get().playTrack(next, queue);
    }
  },

  previousTrack: () => {
    const { queue, currentTrack, currentTime } = get();
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    if (queue.length === 0) return;

    const currentIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : 0;
    const prevIndex = Math.max(0, currentIndex - 1);
    const prev = queue[prevIndex];
    if (prev) {
      get().playTrack(prev, queue);
    }
  },

  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index) => {
    set((state) => ({ queue: state.queue.filter((_, i) => i !== index) }));
  },

  clearQueue: () => set({ queue: [] }),

  toggleShuffle: () => {
    set((state) => ({ isShuffled: !state.isShuffled }));
  },

  toggleRepeat: () => {
    set((state) => {
      const modes: ("off" | "one" | "all")[] = ["off", "all", "one"];
      const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
      return { repeatMode: modes[nextIndex] };
    });
  },

  setProgress: (currentTime, duration) => {
    set({ currentTime, duration: duration > 0 ? duration : get().duration });
  },
}));
