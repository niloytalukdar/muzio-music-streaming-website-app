"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  FileText,
  ListMusic,
} from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import YouTubeEmbedPlayer, { YouTubeEmbedPlayerHandle } from "../app/YouTubeEmbedPlayer";

function formatSeconds(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffled,
    repeatMode,
    playbackMode,
    youtubeVideoId,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    setProgress,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<YouTubeEmbedPlayerHandle | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const prevVolume = useRef(volume);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    if (playbackMode === "audio" && currentTrack?.audioStreamUrl) {
      if (audio.src !== currentTrack.audioStreamUrl) {
        audio.src = currentTrack.audioStreamUrl;
      }
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, volume, isMuted, playbackMode]);

  const handleTimeUpdate = () => {
    if (audioRef.current && playbackMode === "audio") {
      setProgress(audioRef.current.currentTime, audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seek(val);
    if (playbackMode === "audio" && audioRef.current) {
      audioRef.current.currentTime = val;
    } else if (playbackMode === "youtube" && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(val);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume.current || 0.8);
    } else {
      prevVolume.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        preload="auto"
      />

      {playbackMode === "youtube" && youtubeVideoId && (
        <div className={`youtube-frame-container ${isExpanded ? "expanded" : "docked"}`}>
          <YouTubeEmbedPlayer
            ref={ytPlayerRef}
            videoId={youtubeVideoId}
            isPlaying={isPlaying}
            volume={isMuted ? 0 : volume}
            onPlaybackChange={(state) => {
              if (state === "ended") nextTrack();
            }}
            onProgress={(curr, dur) => setProgress(curr, dur)}
            onError={() => nextTrack()}
          />
        </div>
      )}

      <footer className="global-player" aria-label="Audio Player">
        <div className="player-track-info">
          {currentTrack ? (
            <>
              <div className="player-artwork">
                <img
                  src={currentTrack.artworkUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80"}
                  alt={currentTrack.title}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: "2px" }}>
                <Link href={`/track/${currentTrack.id}`} className="player-track-name">
                  {currentTrack.title}
                </Link>
                <span className="player-track-artist">{currentTrack.artistName}</span>
              </div>
              <button
                type="button"
                className={`player-like-btn ${isLiked ? "liked" : ""}`}
                onClick={() => setIsLiked(!isLiked)}
                aria-label="Like Track"
                style={{ marginLeft: "8px" }}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Select a song to start listening
            </div>
          )}
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button
              type="button"
              className={`player-ctrl-btn ${isShuffled ? "active" : ""}`}
              onClick={toggleShuffle}
              aria-label="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            <button
              type="button"
              className="player-ctrl-btn"
              onClick={previousTrack}
              aria-label="Previous Track"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              className="player-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: "2px" }} />}
            </button>
            <button
              type="button"
              className="player-ctrl-btn"
              onClick={nextTrack}
              aria-label="Next Track"
            >
              <SkipForward size={18} />
            </button>
            <button
              type="button"
              className={`player-ctrl-btn ${repeatMode !== "off" ? "active" : ""}`}
              onClick={toggleRepeat}
              aria-label="Repeat"
            >
              {repeatMode === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          <div className="player-progress-row">
            <span className="player-time">{formatSeconds(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="player-seeker"
              aria-label="Seek position"
            />
            <span className="player-time">{formatSeconds(duration)}</span>
          </div>
        </div>

        <div className="player-right">
          {currentTrack && (
            <Link href={`/lyrics/${currentTrack.id}`} className="player-ctrl-btn" aria-label="Lyrics">
              <FileText size={16} />
            </Link>
          )}

          <div className="volume-row">
            <button type="button" onClick={toggleMute} className="player-ctrl-btn" aria-label="Mute">
              {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setIsMuted(false);
                setVolume(Number(e.target.value));
              }}
              className="volume-slider"
              aria-label="Volume"
            />
          </div>

          {playbackMode === "youtube" && (
            <button
              type="button"
              className="player-ctrl-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse video" : "Expand video"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
      </footer>
    </>
  );
}
