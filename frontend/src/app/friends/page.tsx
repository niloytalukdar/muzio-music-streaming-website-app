"use client";

import { useState } from "react";
import { Users, Search, UserPlus, UserCheck, Music } from "lucide-react";

const friendsList = [
  { id: "1", name: "Alex Rivera", initials: "AR", color: "#A13BFF", status: "online" as const, listening: "Blinding Lights — The Weeknd", following: true },
  { id: "2", name: "Maya Chen", initials: "MC", color: "#E477B5", status: "online" as const, listening: "Heat Waves — Glass Animals", following: true },
  { id: "3", name: "Jordan Blake", initials: "JB", color: "#70A9E8", status: "away" as const, listening: "STAY — The Kid LAROI", following: true },
  { id: "4", name: "Priya Sharma", initials: "PS", color: "#8254D8", status: "online" as const, listening: "Levitating — Dua Lipa", following: false },
  { id: "5", name: "Kai Tanaka", initials: "KT", color: "#B58AFF", status: "offline" as const, listening: "Last played 2h ago", following: true },
  { id: "6", name: "Sofia Morales", initials: "SM", color: "#E477B5", status: "online" as const, listening: "Electric Dreams — Nova Bloom", following: true },
  { id: "7", name: "Liam O'Connor", initials: "LO", color: "#70A9E8", status: "away" as const, listening: "Night Drive — Muzio Studio", following: false },
  { id: "8", name: "Zara Ahmed", initials: "ZA", color: "#A13BFF", status: "online" as const, listening: "Dreamy Playlist", following: true },
  { id: "9", name: "Ethan Park", initials: "EP", color: "#8254D8", status: "offline" as const, listening: "Last played 1d ago", following: true },
  { id: "10", name: "Nina Volkov", initials: "NV", color: "#E477B5", status: "online" as const, listening: "Jazz Radio", following: false },
];

const suggestedUsers = [
  { id: "s1", name: "Oliver James", initials: "OJ", color: "#A13BFF", followers: 1240, tracks: 45 },
  { id: "s2", name: "Aria Williams", initials: "AW", color: "#E477B5", followers: 3400, tracks: 89 },
  { id: "s3", name: "Ravi Patel", initials: "RP", color: "#70A9E8", followers: 890, tracks: 23 },
  { id: "s4", name: "Luna Martinez", initials: "LM", color: "#8254D8", followers: 5670, tracks: 112 },
  { id: "s5", name: "Daniel Kim", initials: "DK", color: "#B58AFF", followers: 2100, tracks: 67 },
  { id: "s6", name: "Emma Stone", initials: "ES", color: "#E477B5", followers: 4320, tracks: 98 },
  { id: "s7", name: "Amir Hassan", initials: "AH", color: "#70A9E8", followers: 760, tracks: 31 },
  { id: "s8", name: "Yuki Sato", initials: "YS", color: "#A13BFF", followers: 1890, tracks: 56 },
];

export default function FriendsPage() {
  const [tab, setTab] = useState<"friends" | "find">("friends");
  const [followState, setFollowState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    friendsList.forEach((f) => { init[f.id] = f.following; });
    return init;
  });
  const [suggestedFollows, setSuggestedFollows] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const toggleFollow = (id: string) => {
    setFollowState((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSuggested = (id: string) => {
    setSuggestedFollows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const statusColor = { online: "#22c55e", away: "#f59e0b", offline: "var(--text-muted)" };

  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Users size={28} /> Friends & Social
      </h1>

      <div className="chip-group" style={{ marginBottom: 24 }}>
        <button className={`chip ${tab === "friends" ? "active" : ""}`} onClick={() => setTab("friends")}>
          <Users size={14} /> Friends
        </button>
        <button className={`chip ${tab === "find" ? "active" : ""}`} onClick={() => setTab("find")}>
          <UserPlus size={14} /> Find People
        </button>
      </div>

      {tab === "friends" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {friendsList.map((friend) => (
            <div key={friend.id} className="friend-item" style={{ padding: 12, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-muted)", background: "var(--card-surface)" }}>
              <div className="friend-avatar" style={{ background: friend.color }}>
                {friend.initials}
                <div className="friend-status-dot" style={{ background: statusColor[friend.status] }} />
              </div>
              <div className="friend-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="friend-name">{friend.name}</div>
                <div className="friend-activity" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {friend.status !== "offline" && <Music size={10} />}
                  {friend.listening}
                </div>
              </div>
              <button
                className={`friend-follow-btn ${followState[friend.id] ? "following" : "follow"}`}
                onClick={() => toggleFollow(friend.id)}
              >
                {followState[friend.id] ? (
                  <><UserCheck size={12} /> Following</>
                ) : (
                  <><UserPlus size={12} /> Follow</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "find" && (
        <>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              className="form-input"
              placeholder="Search for users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <h3 className="section-title" style={{ marginBottom: 16, fontSize: 15 }}>Suggested for You</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {suggestedUsers
              .filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()))
              .map((user) => (
                <div key={user.id} style={{ background: "var(--card-surface)", borderRadius: "var(--radius-lg)", padding: 20, border: "1px solid var(--border-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: user.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>
                    {user.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                      {user.followers.toLocaleString()} followers · {user.tracks} tracks
                    </div>
                  </div>
                  <button
                    className={`friend-follow-btn ${suggestedFollows.has(user.id) ? "following" : "follow"}`}
                    onClick={() => toggleSuggested(user.id)}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    {suggestedFollows.has(user.id) ? <><UserCheck size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
                  </button>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
}

