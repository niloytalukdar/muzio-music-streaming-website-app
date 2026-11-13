"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Sparkles, Play, Pause, ArrowLeft } from "lucide-react";
import { usePlayerStore, type Track } from "@/stores/usePlayerStore";

const moodDetails: Record<string, { title: string; desc: string; gradient: string }> = {
  dreamy: {
    title: "Dreamy Mood",
    desc: "Late-night neon vibes, ethereal synths, and lush vocal soundscapes.",
    gradient: "gradient-one",
  },
  calm: {
    title: "Calm Mood",
    desc: "Soft textures, acoustic warmth, and peaceful, unhurried melodies.",
    gradient: "gradient-two",
  },
  energetic: {
    title: "Energetic Mood",
    desc: "High-drive beats, electrifying drops, and fast-paced anthems.",
    gradient: "gradient-three",
  },
  focus: {
    title: "Focus Mood",
    desc: "Instrumental, lo-fi beats, and steady rhythms for deep work.",
    gradient: "gradient-four",
  },
  melancholy: {
    title: "Melancholy Mood",
    desc: "Poignant strings, emotional chords, and soulful introspection.",
    gradient: "gradient-five",
  },
  soulful: {
    title: "Soulful Mood",
    desc: "Deep, emotional grooves, raw vocals, and heartfelt expressions.",
    gradient: "gradient-six",
  },
};

function MoodContent({ slug }: { slug: string }) {
  const info = moodDetails[slug] || {
    title: `${slug.toUpperCase()} Vibes`,
    desc: "Curated tracks tailored to your vibe.",
    gradient: "gradient-one",
  };

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5253/api/v1/music/moods/${slug}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setTracks)
      .catch(() => {});
  }, [slug]);

  return (
    <>
      <div className="collection-header">
        <div className={`collection-cover-art ${info.gradient}`}>
          <Sparkles size={48} />
        </div>
        <div className="collection-meta">
          <span className="collection-type">MOOD EXPERIENCE</span>
          <h1>{info.title}</h1>
          <p>{info.desc}</p>
        </div>
      </div>

      <div className="track-table">
        {tracks.length > 0 ? (
          tracks.map((track, i) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div key={track.id} className="track-row">
                <span className="track-rank">{i + 1}</span>
                <div
                  className="track-art-wrap"
                  onClick={() => {
                    if (currentTrack?.id === track.id) togglePlay();
                    else playTrack(track, tracks);
                  }}
                >
                  <div
                    className="track-thumbnail"
                    style={{ backgroundImage: `url(${track.artworkUrl})` }}
                  />
                  <div className="track-play-hover">
                    {isThisPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                  </div>
                </div>
                <div className="track-info">
                  <strong className="track-title">{track.title}</strong>
                  <span className="track-artist">{track.artistName}</span>
                </div>
                <span className="track-provider-badge">{track.provider}</span>
              </div>
            );
          })
        ) : (
          <p className="empty-subtext">Loading mood tracks from catalog...</p>
        )}
      </div>
    </>
  );
}

export default function MoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return (
    <div className="page-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <Suspense fallback={<p className="empty-subtext">Loading mood...</p>}>
        <MoodContent slug={slug} />
      </Suspense>
    </div>
  );
}
