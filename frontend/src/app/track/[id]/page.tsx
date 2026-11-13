"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, Heart, Share2, ListPlus, UserPlus, UserCheck } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const lyrics = [
  "Walking through the neon lights tonight",
  "Every shadow hides a melody inside",
  "The city breathes in purple hues",
  "And I can feel the rhythm in my shoes",
  "",
  "Take me higher, let the bass drop low",
  "In this moment, I don't wanna let go",
  "Stars collide above the rooftop stage",
  "We're writing music on an endless page",
  "",
  "So close your eyes and feel the sound",
  "Let every worry fall to the ground",
  "The night belongs to those who dream",
  "And nothing's ever quite what it seems",
];

const relatedTracks: Track[] = [
  { id: "r1", title: "Midnight Run", artistName: "Luna Wave", durationSeconds: 214, provider: "Audius", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", artworkUrl: "https://picsum.photos/seed/r1/300/300" },
  { id: "r2", title: "Crystal Clear", artistName: "Neon Drift", durationSeconds: 198, provider: "Audius", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3", artworkUrl: "https://picsum.photos/seed/r2/300/300" },
  { id: "r3", title: "Velvet Sunrise", artistName: "Echo Park", durationSeconds: 242, provider: "Jamendo", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3", artworkUrl: "https://picsum.photos/seed/r3/300/300" },
  { id: "r4", title: "Cloud Walker", artistName: "Astral", durationSeconds: 186, provider: "Audius", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3", artworkUrl: "https://picsum.photos/seed/r4/300/300" },
  { id: "r5", title: "Digital Rain", artistName: "Synthwave", durationSeconds: 225, provider: "Jamendo", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c9a8a140d3.mp3", artworkUrl: "https://picsum.photos/seed/r5/300/300" },
  { id: "r6", title: "Neon Pulse", artistName: "Bass Theory", durationSeconds: 201, provider: "Audius", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77cd0.mp3", artworkUrl: "https://picsum.photos/seed/r6/300/300" },
];

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [currentLyricLine, setCurrentLyricLine] = useState(0);
  const [progress, setProgress] = useState(0);

  const track: Track = currentTrack?.id === id
    ? currentTrack
    : { id, title: `Track ${id}`, artistName: "Unknown Artist", durationSeconds: 240, provider: "Audius", isPlayable: true, audioStreamUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", artworkUrl: `https://picsum.photos/seed/track${id}/400/400` };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLyricLine((prev) => (prev + 1) % lyrics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPlaying || currentTrack?.id !== id) return;
    const interval = setInterval(() => setProgress((p) => Math.min(p + 1, track.durationSeconds)), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, id, track.durationSeconds]);

  const handlePlay = () => {
    if (currentTrack?.id === id) togglePlay();
    else playTrack(track);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Large artwork */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ width: 320, height: 320, borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "0 16px 60px rgba(0,0,0,0.6), 0 0 80px rgba(161,59,255,0.2)" }}>
          <img src={track.artworkUrl || `https://picsum.photos/seed/${id}/400/400`} alt={track.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Track info */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{track.title}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>{track.artistName}</p>
        {track.album && <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>{track.album}</p>}
      </div>

      {/* Play button + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
        <button className={`row-action-btn ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)} style={{ width: 40, height: 40 }}>
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
        </button>
        <button className="play-all-btn" onClick={handlePlay} style={{ width: 64, height: 64 }}>
          {isPlaying && currentTrack?.id === id ? <Pause size={26} fill="white" color="white" /> : <Play size={26} fill="white" color="white" />}
        </button>
        <button className="row-action-btn" style={{ width: 40, height: 40 }}><Share2 size={20} /></button>
        <button className="row-action-btn" style={{ width: 40, height: 40 }}><ListPlus size={20} /></button>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 32 }}>{Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, "0")}</span>
        <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${(progress / track.durationSeconds) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--electric-violet), var(--neon-purple))", borderRadius: 2, transition: "width 0.5s linear" }} />
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 32 }}>{Math.floor(track.durationSeconds / 60)}:{(track.durationSeconds % 60).toString().padStart(2, "0")}</span>
      </div>

      {/* Lyrics */}
      <div style={{ background: "var(--card-surface)", borderRadius: "var(--radius-xl)", padding: 28, border: "1px solid var(--border-muted)", marginBottom: 32 }}>
        <h3 className="section-title" style={{ marginBottom: 16 }}>Lyrics</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {lyrics.map((line, i) => (
            <p key={i} style={{ fontSize: line === "" ? 8 : 15, color: i === currentLyricLine ? "var(--neon-purple)" : "var(--text-secondary)", fontWeight: i === currentLyricLine ? 700 : 400, transition: "color 0.3s, font-weight 0.3s", lineHeight: 1.6 }}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>

      {/* Related Tracks */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-header"><h2 className="section-title">Related Tracks</h2></div>
        <div className="card-grid">
          {relatedTracks.map((t) => (
            <div key={t.id} className="music-card" onClick={() => playTrack(t, relatedTracks)}>
              <div className="music-card-art"><img src={t.artworkUrl!} alt={t.title} /></div>
              <div className="music-card-info">
                <div className="music-card-title">{t.title}</div>
                <div className="music-card-sub">{t.artistName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artist mini */}
      <div style={{ background: "var(--card-surface)", borderRadius: "var(--radius-xl)", padding: 20, border: "1px solid var(--border-muted)", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--neon-purple), var(--aurora-pink))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white", flexShrink: 0 }}>
          {track.artistName.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/artist/1`} style={{ fontWeight: 700, fontSize: 15 }}>{track.artistName}</Link>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Pushing boundaries in modern music production.</p>
        </div>
        <button className={`friend-follow-btn ${following ? "following" : "follow"}`} onClick={() => setFollowing(!following)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {following ? <><UserCheck size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
        </button>
      </div>
    </div>
  );
}

