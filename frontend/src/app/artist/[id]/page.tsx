"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Pause, Heart, Shuffle, MoreHorizontal, UserCheck, UserPlus, BadgeCheck } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const artistData: Record<string, { name: string; monthlyListeners: number; bio: string; color: string }> = {
  "1": { name: "The Weeknd", monthlyListeners: 87400000, bio: "Abel Makkonen Tesfaye, known as The Weeknd, is a Canadian singer, songwriter, and record producer.", color: "#A13BFF" },
  "2": { name: "Dua Lipa", monthlyListeners: 65200000, bio: "Dua Lipa is a British-Albanian singer and songwriter known for her disco-pop style.", color: "#E477B5" },
  "3": { name: "Glass Animals", monthlyListeners: 28900000, bio: "Glass Animals are a British indie pop band formed in Oxford in 2010.", color: "#70A9E8" },
};

function getArtist(id: string) {
  return artistData[id] || { name: `Artist ${id}`, monthlyListeners: Math.floor(Math.random() * 50000000), bio: "An incredible artist pushing the boundaries of modern music.", color: "#8254D8" };
}

const mockTracks = (artist: string): Track[] =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `at-${i + 1}`, title: ["Starboy", "Save Your Tears", "Blinding Lights", "Die For You", "After Hours", "The Hills", "Can't Feel My Face", "Heartless", "In Your Eyes", "Sacrifice"][i],
    artistName: artist, album: ["After Hours", "Starboy", "Dawn FM"][i % 3], durationSeconds: 180 + i * 15, provider: "Audius", isPlayable: true,
    audioStreamUrl: `https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3`,
    artworkUrl: `https://picsum.photos/seed/track${i}/300/300`, likes: 1000 + i * 230,
  }));

const mockAlbums = [
  { id: "alb-1", title: "After Hours", year: "2020", art: "https://picsum.photos/seed/alb1/300/300" },
  { id: "alb-2", title: "Dawn FM", year: "2022", art: "https://picsum.photos/seed/alb2/300/300" },
  { id: "alb-3", title: "Starboy", year: "2016", art: "https://picsum.photos/seed/alb3/300/300" },
  { id: "alb-4", title: "Beauty Behind the Madness", year: "2015", art: "https://picsum.photos/seed/alb4/300/300" },
];

function formatDuration(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const artist = getArtist(id);
  const tracks = mockTracks(artist.name);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [tab, setTab] = useState<"popular" | "albums" | "about">("popular");
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  return (
    <>
      {/* Banner */}
      <div style={{ height: 280, borderRadius: "var(--radius-xl)", overflow: "hidden", position: "relative", marginBottom: -60, background: `linear-gradient(135deg, ${artist.color}44, var(--deep-purple), ${artist.color}22)` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--midnight) 100%)" }} />
      </div>

      {/* Info row */}
      <div className="profile-info-row">
        <div className="profile-avatar-large" style={{ background: artist.color }}>
          {artist.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800 }}>{artist.name}</h1>
            <BadgeCheck size={22} style={{ color: "var(--icy-blue)" }} />
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {artist.monthlyListeners.toLocaleString()} monthly listeners
          </div>
        </div>
        <button
          className={`friend-follow-btn ${isFollowing ? "following" : "follow"}`}
          onClick={() => setIsFollowing(!isFollowing)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", fontSize: 13 }}
        >
          {isFollowing ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
        </button>
      </div>

      {/* Actions */}
      <div className="playlist-actions">
        <button className="play-all-btn" onClick={() => playTrack(tracks[0], tracks)}>
          <Play size={22} fill="white" color="white" />
        </button>
        <button className="icon-btn"><Shuffle size={18} /></button>
      </div>

      {/* Tabs */}
      <div className="library-tabs" style={{ marginBottom: 24 }}>
        {(["popular", "albums", "about"] as const).map((t) => (
          <button key={t} className={`library-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "popular" && (
        <div className="track-table">
          {tracks.map((track, i) => {
            const playing = currentTrack?.id === track.id && isPlaying;
            return (
              <div key={track.id} className={`track-row ${currentTrack?.id === track.id ? "active-row" : ""}`}>
                <span className="track-rank">{i + 1}</span>
                <div className="track-art-wrap" onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track, tracks)}>
                  <div className="track-thumbnail" style={{ backgroundImage: `url(${track.artworkUrl})` }} />
                  <div className="track-play-hover">{playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</div>
                </div>
                <div className="track-info">
                  <strong className="track-title">{track.title}</strong>
                  <span className="track-artist">{track.album}</span>
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
      )}

      {tab === "albums" && (
        <div className="card-grid">
          {mockAlbums.map((alb) => (
            <Link key={alb.id} href={`/album/${alb.id}`} className="music-card">
              <div className="music-card-art"><img src={alb.art} alt={alb.title} /></div>
              <div className="music-card-info">
                <div className="music-card-title">{alb.title}</div>
                <div className="music-card-sub">{alb.year} · Album</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "about" && (
        <div style={{ background: "var(--card-surface)", borderRadius: "var(--radius-xl)", padding: 28, border: "1px solid var(--border-muted)" }}>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>{artist.bio}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[{ label: "Monthly Listeners", value: artist.monthlyListeners.toLocaleString() }, { label: "Followers", value: "2.1M" }, { label: "Tracks", value: "48" }].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

