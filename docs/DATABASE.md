# Database Setup

MUZIO uses Entity Framework Core migrations with PostgreSQL. The repository
contains an initial migration for the current domain model. No database is
created or changed automatically at API startup.

## Local configuration

1. Start PostgreSQL with `docker compose up -d` from the repository root.
2. Set `UsePostgres=true` in the API configuration.
3. Set `ConnectionStrings__DefaultConnection` in the process environment or
   user secrets. Do not commit credentials.
4. From `backend`, apply the migration:

```powershell
dotnet ef database update `
  --project src\Muzio.Infrastructure\Muzio.Infrastructure.csproj `
  --startup-project src\Muzio.Api\Muzio.Api.csproj
```

EF tooling also reads `ConnectionStrings__DefaultConnection` while constructing
the design-time context. Set that variable in PowerShell before running the
command.

## Production

Back up the database before applying migrations. Review generated migrations
and apply them through the deployment process; the application does not run
destructive or automatic schema changes at startup.
