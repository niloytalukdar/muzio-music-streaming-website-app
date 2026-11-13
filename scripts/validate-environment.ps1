$ErrorActionPreference = "Stop"

$required = @("node", "npm", "dotnet")
foreach ($tool in $required) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        throw "Required tool '$tool' is not installed or not on PATH."
    }
}

Write-Host "Environment validation passed."
