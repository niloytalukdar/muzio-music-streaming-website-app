"use client";

import Link from "next/link";
import { UserPlus, UserCheck } from "lucide-react";
import { useState } from "react";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  activity: string;
  status: "online" | "away" | "offline";
  isFollowing: boolean;
}

const initialFriends: Friend[] = [
  {
    id: "1",
    name: "James Foster",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    activity: "Listening to Chill Vibes",
    status: "online",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Wilson Roy",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    activity: "Listening to The Weeknd",
    status: "online",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Jason Miller",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80",
    activity: "Listening to Dua Lipa",
    status: "away",
    isFollowing: false,
  },
  {
    id: "4",
    name: "Tommy Green",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    activity: "Listening to Imagine Dragons",
    status: "offline",
    isFollowing: false,
  },
];

export function FriendsPanel() {
  const [friends, setFriends] = useState(initialFriends);

  const toggleFollow = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f))
    );
  };

  return (
    <aside className="friends-panel" aria-label="Friends Activity">
      <div className="friends-header">
        <span className="friends-title">Friends</span>
        <Link href="/friends" className="friends-see-all">
          See All
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <div className="friend-avatar">
              <img src={friend.avatar} alt={friend.name} />
              <span className={`friend-status-dot ${friend.status}`} />
            </div>
            <div className="friend-info">
              <div className="friend-name">{friend.name}</div>
              <div className="friend-activity">{friend.activity}</div>
            </div>
            <button
              type="button"
              className={`friend-follow-btn ${friend.isFollowing ? "following" : "follow"}`}
              onClick={() => toggleFollow(friend.id)}
            >
              {friend.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
