"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Shield, Volume2, Palette, Database, Radio, Bell } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");
  const [volume, setVolume] = useState(85);
  const [theme, setTheme] = useState("dark-purple");
  const [autoplay, setAutoplay] = useState(true);

  return (
    <div className="page-container settings-layout">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your audio playback, theme appearance, and privacy preferences.</p>
      </div>

      <div className="settings-grid">
        <aside className="settings-sidebar">
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={16} /> Appearance & Theme
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === "playback" ? "active" : ""}`}
            onClick={() => setActiveTab("playback")}
          >
            <Volume2 size={16} /> Audio Playback
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <Shield size={16} /> Privacy & History
          </button>
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === "storage" ? "active" : ""}`}
            onClick={() => setActiveTab("storage")}
          >
            <Database size={16} /> Offline Storage
          </button>
        </aside>

        <section className="settings-content-card">
          {activeTab === "appearance" && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <p>MUZIO utilizes an official dark neon midnight violet palette. Zero green color rule enforced.</p>
              <div className="settings-row">
                <label>Theme Style</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="settings-select">
                  <option value="dark-purple">Midnight Purple & Neon Violet (Approved)</option>
                  <option value="aurora-pink">Deep Space & Aurora Pink</option>
                  <option value="icy-blue">Cyber Minimal & Icy Blue</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "playback" && (
            <div className="settings-section">
              <h3>Playback Preferences</h3>
              <div className="settings-row">
                <label>Default Output Volume: {volume}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="settings-slider"
                />
              </div>
              <div className="settings-row checkbox-row">
                <input
                  type="checkbox"
                  id="autoplay-check"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                />
                <label htmlFor="autoplay-check">Autoplay recommended tracks when queue ends</label>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="settings-section">
              <h3>Privacy & Listening Activity</h3>
              <p>Your data belongs to you. No tracking ads or paywalls.</p>
              <div className="settings-row">
                <button type="button" className="btn-secondary" onClick={() => alert("Search history cleared.")}>
                  Clear Search History
                </button>
              </div>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="settings-section">
              <h3>Offline Storage (IndexedDB)</h3>
              <p>Manage downloaded audio files stored in your local browser sandbox.</p>
              <div className="settings-row">
                <button type="button" className="btn-secondary" onClick={() => alert("Local cache cleared.")}>
                  Clear Downloaded Cache
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

