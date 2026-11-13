"use client";

import { useState } from "react";
import { Radio as RadioIcon, Play, Pause, Users, Headphones } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const stations = [
  { id: "pop", name: "Pop Hits Radio", genre: "Pop", listeners: 14203, color: "linear-gradient(135deg, #A13BFF, #E477B5)" },
  { id: "hiphop", name: "Hip-Hop Central", genre: "Hip-Hop", listeners: 11820, color: "linear-gradient(135deg, #2D1B69, #A13BFF)" },
  { id: "rnb", name: "R&B Vibes", genre: "R&B", listeners: 8943, color: "linear-gradient(135deg, #E477B5, #8254D8)" },
  { id: "jazz", name: "Smooth Jazz Lounge", genre: "Jazz", listeners: 5210, color: "linear-gradient(135deg, #70A9E8, #1a3a5c)" },
  { id: "electronic", name: "Electronic Pulse", genre: "Electronic", listeners: 12450, color: "linear-gradient(135deg, #8254D8, #70A9E8)" },
  { id: "rock", name: "Rock Legends", genre: "Rock", listeners: 9830, color: "linear-gradient(135deg, #6B1B1B, #E477B5)" },
  { id: "classical", name: "Classical Serenity", genre: "Classical", listeners: 3870, color: "linear-gradient(135deg, #1a2a4a, #B58AFF)" },
  { id: "latin", name: "Latin Rhythms", genre: "Latin", listeners: 10640, color: "linear-gradient(135deg, #A13BFF, #FFD2F5)" },
  { id: "indie", name: "Indie Discoveries", genre: "Indie", listeners: 6920, color: "linear-gradient(135deg, #2c1654, #70A9E8)" },
  { id: "metal", name: "Metal Forge", genre: "Metal", listeners: 4560, color: "linear-gradient(135deg, #171025, #A13BFF)" },
  { id: "country", name: "Country Roads", genre: "Country", listeners: 5870, color: "linear-gradient(135deg, #291f39, #E477B5)" },
  { id: "world", name: "World Sounds", genre: "World Music", listeners: 7340, color: "linear-gradient(135deg, #1a4a3a, #70A9E8)" },
];

const streamUrls = [
  "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3",
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3",
  "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3",
  "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=electronic-future-beats-117997.mp3",
];

export default function RadioPage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [playingStation, setPlayingStation] = useState<string | null>(null);

  const handlePlay = (station: typeof stations[0]) => {
    if (playingStation === station.id && currentTrack) {
      togglePlay();
      return;
    }
    const track: Track = {
      id: `radio-${station.id}`,
      title: station.name,
      artistName: `${station.genre} Radio`,
      durationSeconds: 0,
      provider: "Radio",
      isPlayable: true,
      audioStreamUrl: streamUrls[stations.indexOf(station) % streamUrls.length],
      artworkUrl: `https://picsum.photos/seed/${station.id}/400/400`,
    };
    playTrack(track);
    setPlayingStation(station.id);
  };

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <RadioIcon size={28} /> Radio Stations
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 500 }}>
          Tune into curated radio stations spanning every genre. Sit back, relax, and let the music flow.
        </p>
      </div>

      <div className="radio-stations-grid">
        {stations.map((station) => {
          const isActive = playingStation === station.id && currentTrack?.id === `radio-${station.id}`;
          const isStationPlaying = isActive && isPlaying;
          return (
            <div
              key={station.id}
              className={`radio-station-card ${isActive ? "playing" : ""}`}
              onClick={() => handlePlay(station)}
            >
              <div className="radio-art" style={{ background: station.color }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isStationPlaying ? (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 4, borderRadius: 2, background: "white",
                            animation: `eq-bar 0.${4 + i}s ease-in-out infinite alternate`,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes eq-bar {
                          from { height: 6px; }
                          to { height: 24px; }
                        }
                      `}</style>
                    </div>
                  ) : (
                    <Headphones size={36} style={{ color: "rgba(255,255,255,0.6)" }} />
                  )}
                </div>
                {isStationPlaying && (
                  <div className="radio-live-badge">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white", display: "inline-block" }} /> LIVE
                  </div>
                )}
              </div>
              <div className="radio-info">
                <div className="radio-name">{station.name}</div>
                <div className="radio-genre">{station.genre}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
                  <Users size={12} /> {station.listeners.toLocaleString()} listeners
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
