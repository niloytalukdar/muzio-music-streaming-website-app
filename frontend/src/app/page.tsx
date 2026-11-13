"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreHorizontal,
  Play,
  Pause,
  Sparkles,
} from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const moodCards = [
  { name: "Dreamy", slug: "dreamy", gradient: "gradient-one" },
  { name: "Calm", slug: "calm", gradient: "gradient-two" },
  { name: "Energetic", slug: "energetic", gradient: "gradient-three" },
  { name: "Focus", slug: "focus", gradient: "gradient-four" },
  { name: "Melancholy", slug: "melancholy", gradient: "gradient-five" },
  { name: "Soulful", slug: "soulful", gradient: "gradient-six" },
];

const fallbackTracks: Track[] = [
  {
    id: "1", title: "Blinding Lights", artistName: "The Weeknd", durationSeconds: 200, provider: "Jamendo", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80", likes: 201,
  },
  {
    id: "2", title: "Heat Waves", artistName: "Glass Animals", durationSeconds: 238, provider: "Jamendo", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80", likes: 184,
  },
  {
    id: "3", title: "STAY", artistName: "The Kid LAROI, Justin Bieber", durationSeconds: 141, provider: "Jamendo", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80", likes: 222,
  },
  {
    id: "4", title: "Levitating", artistName: "Dua Lipa", durationSeconds: 203, provider: "Jamendo", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=electronic-future-beats-117997.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80", likes: 170,
  },
  {
    id: "5", title: "Night Drive", artistName: "Muzio Studio", durationSeconds: 242, provider: "Audius", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c9a8a140d3.mp3?filename=night-drive-126296.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80", likes: 148,
  },
  {
    id: "6", title: "Electric Dreams", artistName: "Nova Bloom", durationSeconds: 221, provider: "Audius", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77cd0.mp3?filename=cyberpunk-2099-10701.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80", likes: 130,
  },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function HomePage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [tracks, setTracks] = useState<Track[]>(fallbackTracks);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("http://localhost:5253/api/v1/music/trending?limit=12")
      .then((res) => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((data: Track[]) => {
        if (Array.isArray(data) && data.length > 0) setTracks(data);
      })
      .catch(() => {});
  }, []);

  const toggleLike = (id: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Cinematic Hero Banner */}
      <section className="hero-banner" aria-label="Hero Banner">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={14} /> Welcome to Muzio
          </span>
          <h1 className="hero-title">Music Belongs to Everyone.</h1>
          <p className="hero-subtitle">
            Discover. Listen. Feel the Vibe. Free forever, no subscription gates, worldwide discovery.
          </p>
          <div className="hero-actions">
            <Link href="/discover" className="hero-cta">
              <Play size={16} fill="currentColor" /> Start Exploring
            </Link>
          </div>
          <div className="hero-controls" style={{ marginTop: 16 }}>
            <button type="button" className="hero-nav-btn" aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <span className="hero-dot active" />
            <span className="hero-dot" />
            <span className="hero-dot" />
            <button type="button" className="hero-nav-btn" aria-label="Next">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="hero-artwork-side">
          <div className="hero-artwork-mini">
            <div className="hero-mini-card">
              <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&auto=format&fit=crop&q=60" alt="" />
            </div>
            <div className="hero-mini-card">
              <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=60" alt="" />
            </div>
          </div>
          <div className="hero-artwork-card">
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" alt="Featured artwork" />
          </div>
        </div>
      </section>

      {/* Mood Section */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-header">
          <h2 className="section-title">Made for Your Mood</h2>
          <Link href="/discover" className="section-link">See All</Link>
        </div>
        <div className="moods-grid">
          {moodCards.map((mood) => (
            <Link key={mood.slug} href={`/mood/${mood.slug}`} className="mood-card">
              <div className={`mood-card-bg ${mood.gradient}`} />
              <div className="mood-card-label">{mood.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tracks */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-header">
          <h2 className="section-title">Trending Tracks</h2>
          <Link href="/discover" className="section-link">See All</Link>
        </div>
        <div className="track-table">
          {tracks.map((track, index) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            const isLiked = likedTrackIds.has(track.id);
            return (
              <div key={track.id} className={`track-row ${currentTrack?.id === track.id ? "active-row" : ""}`}>
                <span className="track-rank">{index + 1}</span>
                <div className="track-art-wrap" onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track, tracks)}>
                  <div className="track-thumbnail" style={{ backgroundImage: `url(${track.artworkUrl || "/images/default-album.svg"})` }} />
                  <div className="track-play-hover">
                    {isThisPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  </div>
                </div>
                <div className="track-info">
                  <strong className="track-title">{track.title}</strong>
                  <span className="track-artist">{track.artistName}</span>
                </div>
                <span className="track-provider-badge">{track.provider}</span>
                <span className="track-duration">{formatDuration(track.durationSeconds)}</span>
                <button type="button" className={`row-action-btn ${isLiked ? "liked" : ""}`} onClick={() => toggleLike(track.id)} aria-label="Like">
                  <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button type="button" className="row-action-btn" aria-label="More"><MoreHorizontal size={15} /></button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
