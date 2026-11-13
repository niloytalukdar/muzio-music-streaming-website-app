"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Download,
  Flame,
  Heart,
  History,
  Home,
  Library,
  ListMusic,
  LogIn,
  Mic2,
  Music2,
  Radio,
  Search,
  Settings,
  Sparkles,
  Upload,
  UserPlus,
} from "lucide-react";

export function MuzioLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`muzio-logo ${compact ? "compact" : ""}`}
      style={{
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <img
        src="/muzio-logo-real.png"
        alt="MUZIO"
        style={{
          height: compact ? "34px" : "44px",
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Radio", href: "/radio", icon: Radio },
    { label: "Library", href: "/library", icon: Library },
    { label: "Playlists", href: "/playlists", icon: ListMusic },
    { label: "Artists", href: "/library/artists", icon: Mic2 },
    { label: "Albums", href: "/library/albums", icon: Music2 },
  ];

  const libraryNav = [
    { label: "Liked Songs", href: "/library/liked", icon: Heart },
    { label: "Recently Played", href: "/library/recent", icon: History },
    { label: "Downloads", href: "/library/downloads", icon: Download },
    { label: "My Music", href: "/my-music", icon: Upload },
    { label: "Made for You", href: "/discover", icon: Sparkles },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-row" style={{ padding: "20px 24px 16px" }}>
        <MuzioLogo />
      </div>

      <nav className="nav-group" aria-label="Main Navigation">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section-title">Your Library</div>

      <nav className="nav-group" aria-label="Library Navigation">
        {libraryNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section-title">Account</div>
      <nav className="nav-group" aria-label="Account Navigation">
        <Link
          href="/login"
          className={`nav-item ${pathname === "/login" ? "active" : ""}`}
        >
          <LogIn size={17} />
          <span>Sign In</span>
        </Link>
        <Link
          href="/register"
          className={`nav-item ${pathname === "/register" ? "active" : ""}`}
        >
          <UserPlus size={17} />
          <span>Create Account</span>
        </Link>
      </nav>
    </aside>
  );
}
