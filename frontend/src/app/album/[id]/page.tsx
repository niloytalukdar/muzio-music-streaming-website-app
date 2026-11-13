"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Pause, Heart, Shuffle, Clock, MoreHorizontal, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const albumTracks = (albumTitle: string, artist: string): Track[] =>
  ["Overture", "Midnight City", "Velvet Skies", "Stardust", "Neon Pulse", "Echoes", "Gravity", "Twilight Zone", "Crystal Rain", "Infinite Loop", "Aurora", "Finale"].map((title, i) => ({
    id: `albt-${i + 1}`, title, artistName: artist, album: albumTitle,
    durationSeconds: 180 + i * 18, provider: "Audius", isPlayable: true,
    audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3",
    artworkUrl: `https://picsum.photos/seed/albumt${i}/300/300`, likes: 500 + i * 80,
  }));

const moreAlbums = [
  { id: "ma-1", title: "Echoes of Dawn", art: "https://picsum.photos/seed/ma1/300/300" },
  { id: "ma-2", title: "Starlight", art: "https://picsum.photos/seed/ma2/300/300" },
  { id: "ma-3", title: "Neon Dreams", art: "https://picsum.photos/seed/ma3/300/300" },
  { id: "ma-4", title: "Midnight Sessions", art: "https://picsum.photos/seed/ma4/300/300" },
];

function formatDuration(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const albumTitle = id === "alb-1" ? "After Hours" : id === "alb-2" ? "Dawn FM" : `Album ${id}`;
  const artist = "The Weeknd";
  const tracks = albumTracks(albumTitle, artist);
  const totalDuration = tracks.reduce((sum, t) => sum + t.durationSeconds, 0);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  return (
    <>
      {/* Album Hero */}
      <div className="playlist-hero" style={{ background: `linear-gradient(135deg, rgba(161,59,255,0.4), var(--deep-purple) 70%)` }}>
        <div className="playlist-hero-art">
          <img src={`https://picsum.photos/seed/${id}/400/400`} alt={albumTitle} />
        </div>
        <div className="playlist-hero-info">
          <div className="playlist-type">Album</div>
          <h1>{albumTitle}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: 13, flexWrap: "wrap" }}>
            <Link href="/artist/1" style={{ fontWeight: 600, color: "var(--text-primary)" }}>{artist}</Link>
            <span>·</span><span>2020</span><span>·</span>
            <span>{tracks.length} tracks, {Math.floor(totalDuration / 60)} min</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Muzio Records</div>
        </div>
      </div>

      {/* Actions */}
      <div className="playlist-actions">
        <button className="play-all-btn" onClick={() => playTrack(tracks[0], tracks)}>
          <Play size={22} fill="white" color="white" />
        </button>
        <button className="icon-btn" onClick={() => playTrack(tracks[Math.floor(Math.random() * tracks.length)], [...tracks].sort(() => Math.random() - 0.5))}>
          <Shuffle size={18} />
        </button>
        <button className="icon-btn" onClick={() => setSaved(!saved)} style={{ color: saved ? "var(--neon-purple)" : undefined }}>
          {saved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
        </button>
      </div>

      {/* Track list */}
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

      {/* More by artist */}
      <div style={{ marginTop: 40 }}>
        <div className="section-header">
          <h2 className="section-title">More by {artist}</h2>
        </div>
        <div className="card-grid">
          {moreAlbums.map((alb) => (
            <Link key={alb.id} href={`/album/${alb.id}`} className="music-card">
              <div className="music-card-art"><img src={alb.art} alt={alb.title} /></div>
              <div className="music-card-info">
                <div className="music-card-title">{alb.title}</div>
                <div className="music-card-sub">Album · {artist}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

