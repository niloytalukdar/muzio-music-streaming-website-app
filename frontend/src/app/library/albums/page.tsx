"use client";

import Link from "next/link";
import { Music2 } from "lucide-react";

const albums = [
  { id: "1", title: "After Hours", artist: "The Weeknd", year: "2020", art: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80" },
  { id: "2", title: "Future Nostalgia", artist: "Dua Lipa", year: "2020", art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80" },
  { id: "3", title: "Dreamland", artist: "Glass Animals", year: "2020", art: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80" },
  { id: "4", title: "F*ck Love", artist: "The Kid LAROI", year: "2020", art: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80" },
  { id: "5", title: "Dawn FM", artist: "The Weeknd", year: "2022", art: "https://picsum.photos/seed/dawnfm/400/400" },
  { id: "6", title: "Cyberpunk Sessions", artist: "Nova Bloom", year: "2023", art: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80" },
  { id: "7", title: "Midnight Lo-Fi", artist: "Muzio Studio", year: "2024", art: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80" },
  { id: "8", title: "Velvet Horizons", artist: "Luna Wave", year: "2024", art: "https://picsum.photos/seed/velvet/400/400" },
];

export default function AlbumsLibraryPage() {
  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Music2 size={26} /> Saved Albums
      </h1>
      <div className="card-grid">
        {albums.map((album) => (
          <Link key={album.id} href={`/album/${album.id}`} className="music-card">
            <div className="music-card-art">
              <img src={album.art} alt={album.title} />
            </div>
            <div className="music-card-info">
              <div className="music-card-title">{album.title}</div>
              <div className="music-card-sub">{album.artist} · {album.year}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

