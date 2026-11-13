"use client";

import Link from "next/link";
import { Heart, Download, History, ListMusic, Plus } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

export default function LibraryPage() {
  const { queue } = usePlayerStore();

  const libraryCards = [
    {
      title: "Liked Songs",
      subtitle: "All your saved and favorite tracks",
      href: "/library/liked",
      icon: Heart,
      accent: "gradient-one",
    },
    {
      title: "Downloaded Songs",
      subtitle: "Offline listening ready",
      href: "/library/downloads",
      icon: Download,
      accent: "gradient-two",
    },
    {
      title: "Recently Played",
      subtitle: "Your playback history",
      href: "/library/recent",
      icon: History,
      accent: "gradient-three",
    },
    {
      title: "Custom Playlists",
      subtitle: "Personal collections",
      href: "/playlists",
      icon: ListMusic,
      accent: "gradient-four",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Your Library</h1>
        <p>Manage your liked songs, saved offline audio, playlists and listening history.</p>
      </div>

      <div className="library-card-grid">
        {libraryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className={`library-hub-card ${card.accent}`}>
              <div className="hub-card-icon">
                <Icon size={28} />
              </div>
              <strong className="hub-card-title">{card.title}</strong>
              <span className="hub-card-desc">{card.subtitle}</span>
            </Link>
          );
        })}
      </div>

      <div className="page-section">
        <div className="section-title-wrap">
          <h2>Active Playing Queue</h2>
        </div>
        {queue.length === 0 ? (
          <p className="empty-subtext">Your queue is currently empty. Play songs to populate your queue.</p>
        ) : (
          <div className="track-table">
            {queue.map((track, i) => (
              <div key={`${track.id}-${i}`} className="track-row">
                <span className="track-rank">{i + 1}</span>
                <div className="track-info">
                  <strong className="track-title">{track.title}</strong>
                  <span className="track-artist">{track.artistName}</span>
                </div>
                <span className="track-provider-badge">{track.provider}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

