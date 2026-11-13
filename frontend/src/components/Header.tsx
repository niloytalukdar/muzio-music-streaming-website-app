"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, SunMedium, User, LogIn } from "lucide-react";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ username?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("muzio_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="top-header">
      <form onSubmit={handleSubmit} className="search-bar-wrap">
        <Search size={16} />
        <input
          ref={inputRef}
          type="text"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search anything here..."
          aria-label="Search music"
        />
        <span className="search-shortcut">Ctrl + K</span>
      </form>

      <div className="header-actions">
        <Link href="/notifications" className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notif-badge" />
        </Link>
        <button
          type="button"
          className="icon-btn"
          aria-label="Toggle Theme"
        >
          <SunMedium size={18} />
        </button>

        {user ? (
          <Link href={`/profile/${user.username || "me"}`} className="avatar-btn" aria-label="User Profile">
            {user.username?.slice(0, 2).toUpperCase() || <User size={16} />}
          </Link>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/login" className="btn-secondary" style={{ padding: "6px 14px", fontSize: "13px", height: "36px" }}>
              <LogIn size={14} /> Sign In
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "6px 14px", fontSize: "13px", height: "36px", marginTop: 0 }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
