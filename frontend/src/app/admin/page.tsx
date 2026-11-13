"use client";

import { useState } from "react";
import { Shield, Users, Music2, HardDrive, BarChart3, Database } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "tracks">("overview");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
          <Shield size={28} style={{ color: "var(--neon-purple)" }} /> Muzio Platform Administration
        </h1>
        <span className="badge badge-purple" style={{ padding: "6px 14px", fontSize: 12 }}>Production Mode</span>
      </div>

      <div className="admin-stat-grid">
        <div className="stat-card">
          <div className="stat-card-value">12,482</div>
          <div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={14} /> Total Registered Users
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">84,190</div>
          <div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Music2 size={14} /> Indexed Tracks
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">1.4 TB</div>
          <div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <HardDrive size={14} /> Cache & Media Storage
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">99.98%</div>
          <div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Database size={14} /> PostgreSQL 18 Uptime
          </div>
        </div>
      </div>

      <div className="library-tabs" style={{ marginBottom: 20 }}>
        <button className={`library-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
          <BarChart3 size={14} style={{ display: "inline", marginRight: 6 }} /> System Overview
        </button>
        <button className={`library-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          <Users size={14} style={{ display: "inline", marginRight: 6 }} /> User Management
        </button>
        <button className={`library-tab ${activeTab === "tracks" ? "active" : ""}`} onClick={() => setActiveTab("tracks")}>
          <Music2 size={14} style={{ display: "inline", marginRight: 6 }} /> Catalog & Providers
        </button>
      </div>

      {activeTab === "overview" && (
        <div style={{ background: "var(--card-surface)", padding: 24, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-muted)" }}>
          <h3 className="section-title" style={{ marginBottom: 14 }}>Connected Infrastructure</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "PostgreSQL Database", status: "Active (Localhost:5432 - Database: muzio)", ping: "1.2ms" },
              { name: "ASP.NET Core Web API", status: "Healthy (.NET 10 LTS on Port 5253)", ping: "0.8ms" },
              { name: "YouTube InnerTube Proxy", status: "Connected (youtubei.js v18)", ping: "42ms" },
              { name: "Audius Decentralized Network", status: "Connected & Synced", ping: "86ms" },
              { name: "Jamendo Open Catalog", status: "Connected (REST API v3.0)", ping: "55ms" },
            ].map((srv, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "var(--radius-md)", background: "rgba(16,11,28,0.6)" }}>
                <div>
                  <strong style={{ fontSize: 13.5, color: "var(--text-primary)" }}>{srv.name}</strong>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{srv.status}</div>
                </div>
                <span className="badge badge-blue">{srv.ping}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div style={{ background: "var(--card-surface)", padding: 24, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-muted)" }}>
          <h3 className="section-title" style={{ marginBottom: 14 }}>Recent Users</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>User management operations, role modifications, and audit logs.</p>
        </div>
      )}

      {activeTab === "tracks" && (
        <div style={{ background: "var(--card-surface)", padding: 24, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-muted)" }}>
          <h3 className="section-title" style={{ marginBottom: 14 }}>Provider Sync Status</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>All streaming providers (InnerTube, Audius, Jamendo) are operating normally without rate limits.</p>
        </div>
      )}
    </>
  );
}

