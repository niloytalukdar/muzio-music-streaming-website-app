"use client";

import { useState } from "react";
import { Upload, Music, CheckCircle, FileAudio, Image as ImageIcon } from "lucide-react";

export default function MyMusicPage() {
  const [tab, setTab] = useState<"uploaded" | "upload">("uploaded");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setTab("uploaded");
      setTitle("");
      setArtist("");
      setFileSelected(null);
    }, 2000);
  };

  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Upload size={26} /> My Music & Creator Hub
      </h1>

      <div className="chip-group" style={{ marginBottom: 24 }}>
        <button className={`chip ${tab === "uploaded" ? "active" : ""}`} onClick={() => setTab("uploaded")}>
          <Music size={14} /> Uploaded Tracks
        </button>
        <button className={`chip ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
          <Upload size={14} /> Upload New Track
        </button>
      </div>

      {tab === "uploaded" && (
        <div className="empty-state">
          <Upload size={48} />
          <div className="empty-state-title">No Uploaded Tracks Yet</div>
          <div className="empty-state-desc">Share your original compositions, instrumentals, or tracks with Muzio listeners worldwide.</div>
          <button className="btn-primary" style={{ width: "auto", marginTop: 12 }} onClick={() => setTab("upload")}>
            Upload Track
          </button>
        </div>
      )}

      {tab === "upload" && (
        <div style={{ maxWidth: 600, margin: "0 auto", background: "var(--card-surface)", padding: 28, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-muted)" }}>
          {uploadSuccess ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <CheckCircle size={48} style={{ color: "var(--electric-violet)", margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Track Uploaded Successfully!</h2>
              <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 13 }}>Your music is now processing and being indexed.</p>
            </div>
          ) : (
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Track Title *</label>
                <input className="form-input" placeholder="e.g. Midnight Reverie" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Artist / Creator Name *</label>
                <input className="form-input" placeholder="e.g. DJ Eclipse" required value={artist} onChange={(e) => setArtist(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Genre</label>
                <select className="form-input" value={genre} onChange={(e) => setGenre(e.target.value)}>
                  {["Pop", "Electronic", "Hip-Hop", "R&B", "Rock", "Lo-Fi", "Classical", "Ambient"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Audio File (.mp3, .wav, .flac) *</label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderRadius: "var(--radius-md)", border: "1px dashed var(--border-active)", cursor: "pointer", background: "rgba(16,11,28,0.5)" }}>
                  <FileAudio size={20} style={{ color: "var(--neon-purple)" }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {fileSelected || "Choose audio file..."}
                  </span>
                  <input type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => setFileSelected(e.target.files?.[0]?.name || null)} />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Artwork</label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderRadius: "var(--radius-md)", border: "1px dashed var(--border-muted)", cursor: "pointer", background: "rgba(16,11,28,0.5)" }}>
                  <ImageIcon size={20} style={{ color: "var(--soft-lavender)" }} />
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Choose image file...</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} />
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 20 }}>
                Publish Track
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

