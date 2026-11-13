"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Mic } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

function LyricsContent({ trackId }: { trackId: string }) {
  const { currentTrack } = usePlayerStore();
  const [lyrics, setLyrics] = useState<{ plainLyrics?: string; syncedLyricsJson?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5253/api/v1/music/lyrics/${trackId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setLyrics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [trackId]);

  return (
    <>
      <div className="lyrics-header">
        <Mic size={24} className="lyrics-icon-pulse" />
        <h2>Lyrics for &quot;{currentTrack?.title || "Current Track"}&quot;</h2>
        <span>{currentTrack?.artistName || "Unknown Artist"}</span>
      </div>

      <div className="lyrics-content-card">
        {loading && <p className="loading-subtext">Fetching lyrics from LRCLIB open provider...</p>}
        {!loading && lyrics?.plainLyrics ? (
          <div className="lyrics-text">
            {lyrics.plainLyrics.split("\n").map((line, idx) => (
              <p key={idx} className="lyrics-line">
                {line || " "}
              </p>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="empty-lyrics-notice">
              <p>Lyrics are currently not available for this recording.</p>
              <span>LRCLIB community lyrics are matched by title and artist.</span>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default function LyricsPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = use(params);

  return (
    <div className="page-container lyrics-page-layout">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} /> Back
      </Link>

      <Suspense fallback={<p className="loading-subtext">Loading lyrics...</p>}>
        <LyricsContent trackId={trackId} />
      </Suspense>
    </div>
  );
}
