"use client";

import Link from "next/link";
import { Mic2 } from "lucide-react";

const artists = [
  { id: "1", name: "The Weeknd", listeners: "87.4M", art: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80" },
  { id: "2", name: "Dua Lipa", listeners: "65.2M", art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80" },
  { id: "3", name: "Glass Animals", listeners: "28.9M", art: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80" },
  { id: "4", name: "The Kid LAROI", listeners: "32.1M", art: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80" },
  { id: "5", name: "Nova Bloom", listeners: "4.8M", art: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80" },
  { id: "6", name: "Muzio Studio", listeners: "1.2M", art: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80" },
  { id: "7", name: "Luna Wave", listeners: "3.5M", art: "https://picsum.photos/seed/art7/300/300" },
  { id: "8", name: "Neon Drift", listeners: "6.1M", art: "https://picsum.photos/seed/art8/300/300" },
];

export default function ArtistsLibraryPage() {
  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Mic2 size={26} /> Followed & Recommended Artists
      </h1>
      <div className="card-grid">
        {artists.map((artist) => (
          <Link key={artist.id} href={`/artist/${artist.id}`} className="music-card" style={{ textAlign: "center" }}>
            <div className="music-card-art" style={{ borderRadius: "50%", margin: "16px auto 0", width: "120px", height: "120px" }}>
              <img src={artist.art} alt={artist.name} style={{ borderRadius: "50%" }} />
            </div>
            <div className="music-card-info">
              <div className="music-card-title">{artist.name}</div>
              <div className="music-card-sub">{artist.listeners} listeners</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

