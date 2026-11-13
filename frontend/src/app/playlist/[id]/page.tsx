"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Pause, Heart, Shuffle, MoreHorizontal, Clock, Plus, Share2 } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const playlistTracks: Track[] = Array.from({ length: 15 }, (_, i) => ({
  id: `plt-${i + 1}`,
  title: ["Blinding Lights", "Levitating", "Heat Waves", "STAY", "Night Drive", "Electric Dreams", "Midnight Run", "Crystal Clear", "Velvet Sunrise", "Cloud Walker", "Digital Rain", "Neon Pulse", "Starboy", "Save Your Tears", "Die For You"][i],
  artistName: ["The Weeknd", "Dua Lipa", "Glass Animals", "The Kid LAROI", "Muzio Studio", "Nova Bloom", "Luna Wave", "Neon Drift", "Echo Park", "Astral", "Synthwave", "Bass Theory", "The Weeknd", "The Weeknd", "The Weeknd"][i],
  album: ["After Hours", "Future Nostalgia", "Dreamland", "F*ck Love", "Muzio Sessions", "Neon Collection"][i % 6],
  durationSeconds: 180 + i * 13,
  provider: i % 3 === 0 ? "Audius" : "Jamendo",
  isPlayable: true,
  audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3",
  artworkUrl: `https://picsum.photos/seed/plt${i}/300/300`,
  likes: 300 + i * 45,
}));

function formatDuration(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }

export default function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [isLikedPlaylist, setIsLikedPlaylist] = useState(false);
  const totalDuration = playlistTracks.reduce((a, t) => a + t.durationSeconds, 0);

  return (
    <>
      <div className="playlist-hero" style={{ background: `linear-gradient(135deg, rgba(130,84,216,0.4), var(--deep-purple) 70%)` }}>
        <div className="playlist-hero-art">
          <img src={`https://picsum.photos/seed/playlist${id}/400/400`} alt="Playlist" />
        </div>
        <div className="playlist-hero-info">
          <div className="playlist-type">Playlist</div>
          <h1>Chill Vibes Collection</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
            A handpicked collection of tracks for your most relaxed moments.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Muzio User</span>
            <span>·</span><span>{playlistTracks.length} tracks</span>
            <span>·</span><span>{Math.floor(totalDuration / 60)} min</span>
          </div>
        </div>
      </div>

      <div className="playlist-actions">
        <button className="play-all-btn" onClick={() => playTrack(playlistTracks[0], playlistTracks)}>
          <Play size={22} fill="white" color="white" />
        </button>
        <button className="icon-btn" onClick={() => { const shuffled = [...playlistTracks].sort(() => Math.random() - 0.5); playTrack(shuffled[0], shuffled); }}>
          <Shuffle size={18} />
        </button>
        <button className={`icon-btn ${isLikedPlaylist ? "active" : ""}`} onClick={() => setIsLikedPlaylist(!isLikedPlaylist)} style={{ color: isLikedPlaylist ? "var(--aurora-pink)" : undefined }}>
          <Heart size={18} fill={isLikedPlaylist ? "currentColor" : "none"} />
        </button>
        <button className="icon-btn"><Share2 size={18} /></button>
        <button className="icon-btn"><Plus size={18} /></button>
      </div>

      <div className="track-table">
        {playlistTracks.map((track, i) => {
          const playing = currentTrack?.id === track.id && isPlaying;
          return (
            <div key={track.id} className={`track-row ${currentTrack?.id === track.id ? "active-row" : ""}`}>
              <span className="track-rank">{i + 1}</span>
              <div className="track-art-wrap" onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track, playlistTracks)}>
                <div className="track-thumbnail" style={{ backgroundImage: `url(${track.artworkUrl})` }} />
                <div className="track-play-hover">{playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</div>
              </div>
              <div className="track-info">
                <strong className="track-title">{track.title}</strong>
                <span className="track-artist">{track.artistName}</span>
              </div>
              <span className="track-provider-badge">{track.provider}</span>
              <span className="track-duration">{formatDuration(track.durationSeconds)}</span>
              <button className={`row-action-btn ${liked.has(track.id) ? "liked" : ""}`} onClick={() => setLiked((p) => { const n = new Set(p); n.has(track.id) ? n.delete(track.id) : n.add(track.id); return n; })}>
                <Heart size={15} fill={liked.has(track.id) ? "currentColor" : "none"} />
              </button>
              <button className="row-action-btn"><MoreHorizontal size={15} /></button>
            </div>
          );
        })}
      </div>
    </>
  );
}

