"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserCheck, UserPlus, Music, Heart, ListMusic } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const mockLiked: Track[] = Array.from({ length: 6 }, (_, i) => ({
  id: `prof-liked-${i + 1}`,
  title: ["Blinding Lights", "Heat Waves", "Levitating", "Night Drive", "Electric Dreams", "STAY"][i],
  artistName: ["The Weeknd", "Glass Animals", "Dua Lipa", "Muzio Studio", "Nova Bloom", "The Kid LAROI"][i],
  durationSeconds: 190 + i * 10,
  provider: "Audius",
  isPlayable: true,
  audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3",
  artworkUrl: `https://picsum.photos/seed/userlik${i}/300/300`,
}));

const mockPlaylists = [
  { id: "p1", name: "Late Night Chill", tracks: 24, art: "https://picsum.photos/seed/p1/300/300" },
  { id: "p2", name: "Workout Hits", tracks: 38, art: "https://picsum.photos/seed/p2/300/300" },
  { id: "p3", name: "Deep Focus", tracks: 19, art: "https://picsum.photos/seed/p3/300/300" },
  { id: "p4", name: "Synthwave Vibes", tracks: 42, art: "https://picsum.photos/seed/p4/300/300" },
];

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const [tab, setTab] = useState<"playlists" | "liked">("playlists");
  const [isFollowing, setIsFollowing] = useState(false);
  const { playTrack } = usePlayerStore();

  return (
    <>
      <div className="profile-banner" style={{ background: "linear-gradient(135deg, rgba(161,59,255,0.4), rgba(112,169,232,0.3), var(--deep-purple))" }}>
        <div className="profile-banner-overlay" />
      </div>

      <div className="profile-info-row">
        <div className="profile-avatar-large">
          {username.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>{username}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>@{username.toLowerCase()} · Joined Muzio 2025</p>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
            <span><strong>148</strong> Followers</span>
            <span><strong>82</strong> Following</span>
            <span><strong>4</strong> Playlists</span>
          </div>
        </div>
        <button
          className={`friend-follow-btn ${isFollowing ? "following" : "follow"}`}
          onClick={() => setIsFollowing(!isFollowing)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", fontSize: 13 }}
        >
          {isFollowing ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
        </button>
      </div>

      <div className="library-tabs">
        <button className={`library-tab ${tab === "playlists" ? "active" : ""}`} onClick={() => setTab("playlists")}>
          <ListMusic size={14} style={{ display: "inline", marginRight: 6 }} /> Playlists
        </button>
        <button className={`library-tab ${tab === "liked" ? "active" : ""}`} onClick={() => setTab("liked")}>
          <Heart size={14} style={{ display: "inline", marginRight: 6 }} /> Liked Songs
        </button>
      </div>

      {tab === "playlists" && (
        <div className="card-grid">
          {mockPlaylists.map((pl) => (
            <Link key={pl.id} href={`/playlist/${pl.id}`} className="music-card">
              <div className="music-card-art"><img src={pl.art} alt={pl.name} /></div>
              <div className="music-card-info">
                <div className="music-card-title">{pl.name}</div>
                <div className="music-card-sub">{pl.tracks} tracks</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "liked" && (
        <div className="track-table">
          {mockLiked.map((track, i) => (
            <div key={track.id} className="track-row" onClick={() => playTrack(track, mockLiked)}>
              <span className="track-rank">{i + 1}</span>
              <div className="track-art-wrap">
                <div className="track-thumbnail" style={{ backgroundImage: `url(${track.artworkUrl})` }} />
              </div>
              <div className="track-info">
                <strong className="track-title">{track.title}</strong>
                <span className="track-artist">{track.artistName}</span>
              </div>
              <span className="track-provider-badge">{track.provider}</span>
              <span className="track-duration">3:20</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

