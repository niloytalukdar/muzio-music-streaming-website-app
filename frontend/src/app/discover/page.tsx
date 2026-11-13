"use client";

import { useState } from "react";
import { Play, Sparkles, Globe, Disc, Radio as RadioIcon } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const discoverGenres = [
  "Pop", "Rock", "Hip-Hop", "R&B", "EDM", "Indie", "Bengali Folk", "Bollywood",
  "K-Pop", "Lo-Fi", "Cyberpunk Synth", "Ambient", "Classical", "Jazz"
];

const trendingWorldwide: Track[] = [
  {
    id: "yt:trending-1",
    title: "Chaleya (From Jawan)",
    artistName: "Arijit Singh, Anirudh Ravichander",
    durationSeconds: 200,
    provider: "YouTube Music",
    isPlayable: true,
    sourceUrl: "https://www.youtube.com/watch?v=VAdGW7QDJUI",
    artworkUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "yt:trending-2",
    title: "Tumi Robe Nirobe",
    artistName: "Rabindra Sangeet / Classical",
    durationSeconds: 245,
    provider: "YouTube Music",
    isPlayable: true,
    sourceUrl: "https://www.youtube.com/watch?v=VAdGW7QDJUI",
    artworkUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "yt:trending-3",
    title: "Seven (feat. Latto)",
    artistName: "Jung Kook",
    durationSeconds: 184,
    provider: "YouTube Music",
    isPlayable: true,
    sourceUrl: "https://www.youtube.com/watch?v=QU9c0053UAU",
    artworkUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "yt:trending-4",
    title: "Starboy",
    artistName: "The Weeknd, Daft Punk",
    durationSeconds: 230,
    provider: "YouTube Music",
    isPlayable: true,
    sourceUrl: "https://www.youtube.com/watch?v=34Na4j8AVgA",
    artworkUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
  },
];

export default function DiscoverPage() {
  const { playTrack } = usePlayerStore();
  const [selectedGenre, setSelectedGenre] = useState("All");

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Music Discovery</h1>
        <p>Explore trending hits, regional charts, and curated playlists worldwide.</p>
      </div>

      {/* Genre Filter Pills */}
      <div className="filter-pill-row">
        <button
          type="button"
          className={`pill-btn ${selectedGenre === "All" ? "active" : ""}`}
          onClick={() => setSelectedGenre("All")}
        >
          All
        </button>
        {discoverGenres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`pill-btn ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Worldwide Trending Section */}
      <div className="page-section">
        <div className="section-title-wrap">
          <Globe size={18} />
          <h2>Worldwide Top Picks</h2>
        </div>

        <div className="card-grid">
          {trendingWorldwide.map((track) => (
            <div key={track.id} className="music-card" onClick={() => playTrack(track, trendingWorldwide)}>
              <div
                className="music-card-artwork"
                style={{ backgroundImage: `url(${track.artworkUrl})` }}
              >
                <div className="play-hover-btn">
                  <Play size={20} fill="white" />
                </div>
              </div>
              <strong className="music-card-title">{track.title}</strong>
              <span className="music-card-subtitle">{track.artistName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

