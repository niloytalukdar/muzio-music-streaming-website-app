"use client";

import { Download, HardDrive, CheckCircle } from "lucide-react";

export default function DownloadsPage() {
  return (
    <div className="page-container">
      <div className="collection-header">
        <div className="collection-cover-art gradient-two">
          <Download size={48} />
        </div>
        <div className="collection-meta">
          <span className="collection-type">OFFLINE STORAGE</span>
          <h1>Downloads & Offline Library</h1>
          <p>Eligible open-licensed music stored locally in browser IndexedDB for offline listening.</p>
        </div>
      </div>

      <div className="downloads-status-card">
        <div className="storage-info">
          <HardDrive size={20} />
          <div>
            <strong>Offline Storage Available</strong>
            <span>Browser Cache & IndexedDB storage active. Music downloaded under open license can be played without an internet connection.</span>
          </div>
        </div>
      </div>

      <div className="empty-subtext" style={{ marginTop: "2rem" }}>
        No tracks downloaded yet. When playing an eligible track, tap Download to store it for offline playback.
      </div>
    </div>
  );
}

