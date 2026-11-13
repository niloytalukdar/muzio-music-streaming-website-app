"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Library, Search, User } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play } from "lucide-react";

export function MobileNavigation() {
  const pathname = usePathname();
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/library", icon: Library },
    { label: "Profile", href: "/profile/niloy", icon: User },
  ];

  return (
    <div className="mobile-shell-dock">
      {/* Mini Player when track is playing */}
      {currentTrack && (
        <div className="mobile-mini-player">
          <div
            className="m-mini-art"
            style={{
              backgroundImage: `url(${currentTrack.artworkUrl || "/images/default-album.svg"})`,
            }}
          />
          <div className="m-player-copy">
            <strong>{currentTrack.title}</strong>
            <span>{currentTrack.artistName}</span>
          </div>
          <button
            type="button"
            className="m-play"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="mobile-nav" aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

