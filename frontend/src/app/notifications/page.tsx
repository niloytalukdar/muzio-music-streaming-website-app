"use client";

import { useState } from "react";
import { Bell, Heart, UserPlus, Music, ListMusic, Star, CheckCheck, Disc3 } from "lucide-react";

type NotifType = "follow" | "like" | "playlist" | "release" | "digest" | "mention";

interface Notification {
  id: string;
  type: NotifType;
  text: string;
  time: string;
  read: boolean;
}

const allNotifications: Notification[] = [
  { id: "1", type: "follow", text: "Alex Rivera started following you", time: "2m ago", read: false },
  { id: "2", type: "like", text: "Maya Chen liked your track \"Night Drive\"", time: "8m ago", read: false },
  { id: "3", type: "playlist", text: "Your playlist \"Chill Vibes\" was updated with 3 new tracks", time: "25m ago", read: false },
  { id: "4", type: "release", text: "The Weeknd released a new album \"After Hours (Deluxe)\"", time: "1h ago", read: false },
  { id: "5", type: "follow", text: "Jordan Blake started following you", time: "2h ago", read: true },
  { id: "6", type: "like", text: "Priya Sharma liked your playlist \"Focus Mode\"", time: "3h ago", read: true },
  { id: "7", type: "mention", text: "Kai Tanaka mentioned you in a comment", time: "4h ago", read: false },
  { id: "8", type: "digest", text: "Weekly Digest: 847 plays across 12 tracks this week", time: "5h ago", read: true },
  { id: "9", type: "release", text: "Dua Lipa released \"Radical Optimism\" — listen now", time: "6h ago", read: true },
  { id: "10", type: "follow", text: "Sofia Morales started following you", time: "Yesterday", read: true },
  { id: "11", type: "playlist", text: "\"Made for You\" daily mix is ready", time: "Yesterday", read: true },
  { id: "12", type: "like", text: "Liam O'Connor liked your track \"Electric Dreams\"", time: "Yesterday", read: true },
  { id: "13", type: "mention", text: "Zara Ahmed tagged you in a shared playlist", time: "2 days ago", read: true },
  { id: "14", type: "digest", text: "Monthly Report: Your top genre was Electronic, 3,200 mins listened", time: "3 days ago", read: true },
  { id: "15", type: "release", text: "Glass Animals released a new single \"Creatures in Heaven\"", time: "4 days ago", read: true },
];

const typeIcon: Record<NotifType, React.ReactNode> = {
  follow: <UserPlus size={18} />,
  like: <Heart size={18} />,
  playlist: <ListMusic size={18} />,
  release: <Disc3 size={18} />,
  digest: <Star size={18} />,
  mention: <Music size={18} />,
};

const typeBg: Record<NotifType, string> = {
  follow: "rgba(161,59,255,0.2)",
  like: "rgba(228,119,181,0.2)",
  playlist: "rgba(130,84,216,0.2)",
  release: "rgba(112,169,232,0.2)",
  digest: "rgba(181,138,255,0.2)",
  mention: "rgba(161,59,255,0.2)",
};

const typeColor: Record<NotifType, string> = {
  follow: "#A13BFF",
  like: "#E477B5",
  playlist: "#8254D8",
  release: "#70A9E8",
  digest: "#B58AFF",
  mention: "#A13BFF",
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "mentions">("all");
  const [notifications, setNotifications] = useState(allNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "mentions") return n.type === "mention";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <Bell size={28} /> Notifications
          {unreadCount > 0 && (
            <span className="badge badge-purple" style={{ fontSize: 12, marginLeft: 4 }}>{unreadCount} new</span>
          )}
        </h1>
        <button className="btn-secondary" onClick={markAllRead} style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>

      <div className="chip-group" style={{ marginBottom: 24 }}>
        {(["all", "unread", "mentions"] as const).map((f) => (
          <button key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : "Mentions"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <div className="empty-state-title">No notifications</div>
          <div className="empty-state-desc">You&#39;re all caught up!</div>
        </div>
      ) : (
        <div className="notif-list">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`notif-item ${!notif.read ? "unread" : ""}`}
              onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
              style={!notif.read ? { borderLeft: `3px solid ${typeColor[notif.type]}` } : undefined}
            >
              <div className="notif-icon" style={{ background: typeBg[notif.type], color: typeColor[notif.type] }}>
                {typeIcon[notif.type]}
              </div>
              <div className="notif-content">
                <div className="notif-text">{notif.text}</div>
                <div className="notif-time">{notif.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

