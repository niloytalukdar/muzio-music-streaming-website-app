import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { GlobalPlayer } from "@/components/GlobalPlayer";
import { MobileNavigation } from "@/components/MobileNavigation";
import { FriendsPanel } from "@/components/FriendsPanel";

export const metadata: Metadata = {
  title: "MUZIO — Music Belongs to Everyone",
  description:
    "Open-source worldwide music discovery, streaming, download and offline listening platform. Free forever. No premium restrictions.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="muzio-page">
          <div className="app-shell">
            <Suspense fallback={<aside className="sidebar" />}>
              <Sidebar />
            </Suspense>
            <div className="center-stage">
              <Suspense fallback={<header className="top-header" />}>
                <Header />
              </Suspense>
              <main className="main-content-scrollable">
                <Suspense fallback={<div className="loading-state">Loading...</div>}>
                  {children}
                </Suspense>
              </main>
            </div>
            <Suspense fallback={<aside className="friends-panel" />}>
              <FriendsPanel />
            </Suspense>
          </div>
          <Suspense fallback={null}>
            <GlobalPlayer />
          </Suspense>
          <Suspense fallback={null}>
            <MobileNavigation />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
