"use client";

import { useState } from "react";
import Link from "next/link";
import { ListMusic, Plus, Play } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  coverUrl: string;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "cyber-lounge",
      title: "Muzio Cyber Lounge",
      trackCount: 6,
      coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "chill-drive",
      title: "Night Drive Kolkata",
      trackCount: 12,
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "bengali-acoustics",
      title: "Acoustic Bengali Hits",
      trackCount: 8,
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    },
  ]);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>Playlists</h1>
          <p>Curated collections and your custom playlists.</p>
        </div>
        <Link href="/playlists/create" className="btn-primary">
          <Plus size={16} /> Create Playlist
        </Link>
      </div>

      <div className="card-grid">
        {playlists.map((pl) => (
          <Link key={pl.id} href={`/playlist/${pl.id}`} className="music-card">
            <div
              className="music-card-artwork"
              style={{ backgroundImage: `url(${pl.coverUrl})` }}
            >
              <div className="play-hover-btn">
                <Play size={20} fill="white" />
              </div>
            </div>
            <strong className="music-card-title">{pl.title}</strong>
            <span className="music-card-subtitle">{pl.trackCount} Tracks</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

