# Development Guide

This repository contains the MUZIO dashboard frontend and the backend skeleton for the music platform.

## Frontend

```bash
cd frontend
npm install
npm run dev -- --hostname 0.0.0.0
```

## Backend

```bash
cd backend
# PostgreSQL via Docker
# docker compose up -d
# For local demo mode, the API uses temporary in-memory storage.
# For persistent data, set UsePostgres=true and configure
# ConnectionStrings__DefaultConnection before starting the API.

dotnet restore src/Muzio.Api/Muzio.Api.csproj
dotnet run --project src/Muzio.Api/Muzio.Api.csproj
```

To apply the PostgreSQL schema after configuring the connection:

```powershell
dotnet ef database update `
  --project src\Muzio.Infrastructure\Muzio.Infrastructure.csproj `
  --startup-project src\Muzio.Api\Muzio.Api.csproj
```

See [DATABASE.md](./DATABASE.md) for the required environment variables and migration workflow.

The local API uses Audius for trending tracks and search. It does not seed fake
catalogue entries. Audius playback is exposed only for tracks marked streamable
and available by the provider. Downloads are not enabled unless provider
metadata explicitly permits them.

## Health checks

- Frontend: http://localhost:3000
- API: http://localhost:5000/api/health
