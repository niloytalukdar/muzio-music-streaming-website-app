# MUZIO

MUZIO is a free, open-source music discovery and streaming platform concept built around the approved visual design. The project includes a high-fidelity dashboard UI and a .NET API skeleton ready for PostgreSQL-backed expansion.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: ASP.NET Core Web API, Entity Framework Core, PostgreSQL-ready configuration
- Database: PostgreSQL with Docker Compose support

## Quick start

```bash
# Frontend
cd frontend
npm install
npm run dev -- --hostname 0.0.0.0

# Backend
cd backend
# optionally run docker compose up -d from the repository root

dotnet run --project src/Muzio.Api/Muzio.Api.csproj
```

## Notes

- The dashboard follows the approved MUZIO look and palette.
- Green is intentionally excluded from the design system.
- Some provider workflows remain metadata-only until credentials are added.
- Search uses YouTube.js server-side for YouTube Music song metadata, then video metadata as a fallback. YouTube playback stays in MUZIO through YouTube's official embedded player; audio streams are not extracted.
