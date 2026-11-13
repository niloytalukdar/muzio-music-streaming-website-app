"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { Heart, Play, Pause } from "lucide-react";

export default function LikedSongsPage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  return (
    <div className="page-container">
      <div className="collection-header">
        <div className="collection-cover-art gradient-one">
          <Heart size={48} fill="white" />
        </div>
        <div className="collection-meta">
          <span className="collection-type">PLAYLIST</span>
          <h1>Liked Songs</h1>
          <p>Your favorite music saved across all sessions.</p>
        </div>
      </div>

      <div className="track-table">
        {currentTrack ? (
          <div className="track-row active-row">
            <span className="track-rank">1</span>
            <div
              className="track-art-wrap"
              onClick={() => togglePlay()}
            >
              <div
                className="track-thumbnail"
                style={{ backgroundImage: `url(${currentTrack.artworkUrl})` }}
              />
              <div className="track-play-hover">
                {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
              </div>
            </div>
            <div className="track-info">
              <strong className="track-title">{currentTrack.title}</strong>
              <span className="track-artist">{currentTrack.artistName}</span>
            </div>
            <span className="track-provider-badge">{currentTrack.provider}</span>
          </div>
        ) : (
          <p className="empty-subtext">No liked songs yet. Tap the heart icon on any song to save it here.</p>
        )}
      </div>
    </div>
  );
}

