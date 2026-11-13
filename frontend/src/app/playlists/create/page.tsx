"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Image as ImageIcon, Lock, Globe, ArrowLeft } from "lucide-react";

export default function CreatePlaylistPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Playlist name is required"); return; }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("muzio_token");
      const res = await fetch("http://localhost:5253/api/v1/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, description, isPublic }),
      });
      if (!res.ok) throw new Error("Failed to create playlist");
      router.push("/playlists");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <Link href="/playlists" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Playlists
      </Link>
      <h1 className="page-title">Create New Playlist</h1>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "var(--card-surface)", borderRadius: "var(--radius-xl)", padding: 28, border: "1px solid var(--border-muted)" }}>
        {/* Cover image */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <label style={{ width: 160, height: 160, borderRadius: "var(--radius-lg)", background: coverPreview ? `url(${coverPreview}) center/cover` : "rgba(32,24,45,0.7)", border: "2px dashed var(--border-muted)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", color: "var(--text-muted)", fontSize: 12 }}>
            {!coverPreview && <><ImageIcon size={24} /><span>Add cover</span></>}
            <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Playlist Name *</label>
          <input className="form-input" placeholder="My awesome playlist" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" placeholder="Add an optional description..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ resize: "vertical" }} />
        </div>

        <div className="form-group">
          <label className="form-label">Privacy</label>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" onClick={() => setIsPublic(true)} className="chip" style={{ flex: 1, justifyContent: "center", ...(isPublic ? { background: "rgba(161,59,255,0.2)", color: "var(--soft-lavender)", borderColor: "rgba(161,59,255,0.4)" } : {}) }}>
              <Globe size={14} /> Public
            </button>
            <button type="button" onClick={() => setIsPublic(false)} className="chip" style={{ flex: 1, justifyContent: "center", ...(!isPublic ? { background: "rgba(161,59,255,0.2)", color: "var(--soft-lavender)", borderColor: "rgba(161,59,255,0.4)" } : {}) }}>
              <Lock size={14} /> Private
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Link href="/playlists" className="btn-secondary" style={{ flex: 1 }}>Cancel</Link>
          <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </div>
      </form>
    </div>
  );
}

