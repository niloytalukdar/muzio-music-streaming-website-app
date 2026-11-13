# MUZIO — Full-Stack Architecture Documentation
**Tagline:** Music Belongs to Everyone.  
**Version:** 1.0 Production Edition  

---

## 1. Global Architecture Overview
MUZIO is architected with a decoupled full-stack design:
1. **Frontend (Next.js 16 + React 19 + Turbopack + TypeScript):**
   - Implements official approved MUZIO design specifications (zero green branding; electric violet `#8254D8`, neon purple `#A13BFF`, aurora pink `#E477B5`, icy blue `#70A9E8`, and dark plum/midnight purple background `#080510` & `#0B0715`).
   - Integrated with **LuanRT/YouTube.js** (InnerTube client) for server-side search and deciphered audio stream extraction/proxying without CORS or client IP block issues.
   - Dual playback engine: standard HTML5 Audio Adapter + YouTube IFrame Player API for official embedded video playback.
   - State managed via persistent **Zustand** store (`usePlayerStore`), keeping player, queue, repeat, shuffle, and history synchronized across all routes without re-mounting.

2. **Backend (ASP.NET Core Web API + .NET 10 LTS):**
   - Clean Architecture across four modular projects:
     - `Muzio.Domain`: Entities, enums, playback & download capability flags.
     - `Muzio.Application`: DTOs, service interfaces, validation contracts.
     - `Muzio.Infrastructure`: PostgreSQL DbContext, providers (Audius, Jamendo, LRCLIB), repository implementations.
     - `Muzio.Api`: REST API endpoints under `/api/v1/...` for auth, music discovery, playlists, library, and lyrics.
   - Database: PostgreSQL (EF Core Code First + Npgsql, with InMemory fallback for instant development).

---

## 2. YouTube InnerTube & Worldwide Music Integration
Per InnerTune / ViMusic / RiMusic design patterns:
- Uses `youtubei.js` on the server runtime (`/api/youtube/search`, `/api/youtube/stream`, `/api/youtube/stream/proxy`).
- Searches YouTube Music with `WEB_REMIX` / `YTMUSIC` client contexts to discover Bengali, Hindi, English, Korean, and worldwide catalog tracks.
- Resolves deciphered audio stream formats on demand, handling cipher signatures and n-parameters securely.
- Official YouTube IFrame player provides synchronized video playback when embedded view is active.
