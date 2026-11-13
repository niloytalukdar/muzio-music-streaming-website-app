"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { History, Play, Pause } from "lucide-react";

export default function RecentlyPlayedPage() {
  const { history, currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  return (
    <div className="page-container">
      <div className="collection-header">
        <div className="collection-cover-art gradient-three">
          <History size={48} />
        </div>
        <div className="collection-meta">
          <span className="collection-type">HISTORY</span>
          <h1>Recently Played</h1>
          <p>Tracks you have listened to during this session.</p>
        </div>
      </div>

      <div className="track-table">
        {history.length > 0 ? (
          history.map((track, idx) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div key={`${track.id}-${idx}`} className="track-row">
                <span className="track-rank">{idx + 1}</span>
                <div
                  className="track-art-wrap"
                  onClick={() => {
                    if (currentTrack?.id === track.id) togglePlay();
                    else playTrack(track, history);
                  }}
                >
                  <div
                    className="track-thumbnail"
                    style={{ backgroundImage: `url(${track.artworkUrl})` }}
                  />
                  <div className="track-play-hover">
                    {isThisPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                  </div>
                </div>
                <div className="track-info">
                  <strong className="track-title">{track.title}</strong>
                  <span className="track-artist">{track.artistName}</span>
                </div>
                <span className="track-provider-badge">{track.provider}</span>
              </div>
            );
          })
        ) : (
          <p className="empty-subtext">No listening history recorded yet. Start playing tracks to see them here.</p>
        )}
      </div>
    </div>
  );
}

