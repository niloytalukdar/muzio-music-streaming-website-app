"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, Play, Pause, Heart, MoreHorizontal, Video, Music2 } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return "3:30";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "songs" | "videos">("all");
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  // Trigger search whenever the URL query parameter changes
  useEffect(() => {
    setQuery(queryParam);
    if (queryParam.trim()) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    try {
      const ytPromise = fetch(`/api/youtube/search?q=${encodeURIComponent(searchTerm)}&limit=25`)
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []);

      const backendPromise = fetch(`http://localhost:5253/api/v1/music/search?q=${encodeURIComponent(searchTerm)}`)
        .then((r) => (r.ok ? r.json() : { tracks: [] }))
        .then((data) => data.tracks || [])
        .catch(() => []);

      const [ytTracks, beTracks] = await Promise.all([ytPromise, backendPromise]);
      const combined = [...(Array.isArray(ytTracks) ? ytTracks : []), ...(Array.isArray(beTracks) ? beTracks : [])];
      setResults(combined);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredResults = results.filter((track) => {
    const isYouTube = track.provider?.toLowerCase().includes("youtube");
    if (activeFilter === "songs") return !isYouTube;
    if (activeFilter === "videos") return isYouTube;
    return true;
  });

  const topResult = filteredResults[0];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Search Input Box */}
      <div style={{ marginBottom: "28px" }}>
        <form onSubmit={handleFormSubmit} style={{ position: "relative", maxWidth: "640px" }}>
          <SearchIcon size={20} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="search-bar"
            style={{
              padding: "14px 120px 14px 50px",
              fontSize: "15px",
              borderRadius: "var(--radius-full)",
              background: "rgba(32, 24, 45, 0.8)",
              border: "1px solid var(--border-active)",
              width: "100%",
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, artists, albums, or YouTube videos..."
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "auto",
              padding: "8px 20px",
              marginTop: 0,
              height: "38px",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      {results.length > 0 && (
        <div className="chip-group" style={{ marginBottom: "24px" }}>
          <button
            className={`chip ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Results ({results.length})
          </button>
          <button
            className={`chip ${activeFilter === "songs" ? "active" : ""}`}
            onClick={() => setActiveFilter("songs")}
          >
            <Music2 size={13} /> Songs
          </button>
          <button
            className={`chip ${activeFilter === "videos" ? "active" : ""}`}
            onClick={() => setActiveFilter("videos")}
          >
            <Video size={13} /> Music Videos
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state" style={{ height: "240px", flexDirection: "column", gap: "12px" }}>
          <div className="animate-spin" style={{ width: "36px", height: "36px", border: "3px solid var(--border-muted)", borderTopColor: "var(--neon-purple)", borderRadius: "50%" }} />
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Searching worldwide music catalog...</span>
        </div>
      )}

      {!loading && filteredResults.length > 0 && (
        <>
          {topResult && (
            <div className="search-top-result" style={{ marginBottom: "36px" }}>
              <div>
                <h3 className="section-title" style={{ marginBottom: "14px", fontSize: "16px" }}>Top Result</h3>
                <div
                  className="top-result-card"
                  onClick={() => {
                    if (currentTrack?.id === topResult.id) togglePlay();
                    else playTrack(topResult, filteredResults);
                  }}
                  style={{ cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
                >
                  <div className="top-result-art" style={{ position: "relative" }}>
                    <img
                      src={topResult.artworkUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80"}
                      alt={topResult.title}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "var(--neon-purple)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 20px rgba(161,59,255,0.6)",
                      }}
                    >
                      {currentTrack?.id === topResult.id && isPlaying ? (
                        <Pause size={22} fill="white" color="white" />
                      ) : (
                        <Play size={22} fill="white" color="white" style={{ marginLeft: "2px" }} />
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                      {topResult.title}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      {topResult.artistName} · <span className="badge badge-purple">{topResult.provider || "Track"}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="section-title" style={{ marginBottom: "14px", fontSize: "16px" }}>Songs</h3>
                <div className="track-table">
                  {filteredResults.slice(0, 5).map((track, i) => {
                    const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                    const isLiked = likedTrackIds.has(track.id);
                    return (
                      <div
                        key={track.id}
                        className={`track-row ${currentTrack?.id === track.id ? "active-row" : ""}`}
                        onClick={() => {
                          if (currentTrack?.id === track.id) togglePlay();
                          else playTrack(track, filteredResults);
                        }}
                      >
                        <span className="track-rank">{i + 1}</span>
                        <div className="track-art-wrap">
                          <div
                            className="track-thumbnail"
                            style={{ backgroundImage: `url(${track.artworkUrl || "/images/default-album.svg"})` }}
                          />
                          <div className="track-play-hover">
                            {isThisPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                          </div>
                        </div>
                        <div className="track-info">
                          <strong className="track-title">{track.title}</strong>
                          <span className="track-artist">{track.artistName}</span>
                        </div>
                        <span className="track-provider-badge">{track.provider}</span>
                        <span className="track-duration">{formatDuration(track.durationSeconds)}</span>
                        <button
                          type="button"
                          className={`row-action-btn ${isLiked ? "liked" : ""}`}
                          onClick={(e) => toggleLike(track.id, e)}
                          aria-label="Like Track"
                        >
                          <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* All Tracks Table */}
          <div style={{ marginTop: "32px" }}>
            <h3 className="section-title" style={{ marginBottom: "16px", fontSize: "18px" }}>
              All Results
            </h3>
            <div className="track-table">
              {filteredResults.map((track, index) => {
                const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                const isLiked = likedTrackIds.has(track.id);
                return (
                  <div
                    key={track.id}
                    className={`track-row ${currentTrack?.id === track.id ? "active-row" : ""}`}
                    onClick={() => {
                      if (currentTrack?.id === track.id) togglePlay();
                      else playTrack(track, filteredResults);
                    }}
                  >
                    <span className="track-rank">{index + 1}</span>
                    <div className="track-art-wrap">
                      <div
                        className="track-thumbnail"
                        style={{ backgroundImage: `url(${track.artworkUrl || "/images/default-album.svg"})` }}
                      />
                      <div className="track-play-hover">
                        {isThisPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                      </div>
                    </div>
                    <div className="track-info">
                      <strong className="track-title">{track.title}</strong>
                      <span className="track-artist">{track.artistName}</span>
                    </div>
                    <span className="track-provider-badge">{track.provider}</span>
                    <span className="track-duration">{formatDuration(track.durationSeconds)}</span>
                    <button
                      type="button"
                      className={`row-action-btn ${isLiked ? "liked" : ""}`}
                      onClick={(e) => toggleLike(track.id, e)}
                      aria-label="Like Track"
                    >
                      <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button type="button" className="row-action-btn" aria-label="More Options">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {!loading && filteredResults.length === 0 && query && (
        <div className="empty-state">
          <SearchIcon size={48} />
          <div className="empty-state-title">No results found for &quot;{query}&quot;</div>
          <div className="empty-state-desc">Try searching for an artist, song title, or genre.</div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading-state">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
