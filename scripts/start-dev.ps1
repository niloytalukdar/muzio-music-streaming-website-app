param(
    [switch]$NoBackend
)

$root = Split-Path -Parent $PSScriptRoot

if (-not $NoBackend) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root/backend'; dotnet run --project src/Muzio.Api/Muzio.Api.csproj --urls http://localhost:5000"
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root/frontend'; npm run dev -- --hostname 0.0.0.0"
