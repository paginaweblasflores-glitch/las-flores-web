$ErrorActionPreference = "Stop"

$scriptPath = Join-Path $PSScriptRoot "backup-supabase.ps1"
$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$output = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath -DryRun 2>&1
$ErrorActionPreference = $previousErrorActionPreference
if ($LASTEXITCODE -eq 0) {
  throw "Expected dry-run to reject a missing SUPABASE_DB_URL"
}
if (-not ($output -match "SUPABASE_DB_URL")) {
  throw "Missing configuration error"
}

$temporaryDirectory = Join-Path ([IO.Path]::GetTempPath()) ("las-flores-backup-test-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $temporaryDirectory | Out-Null
try {
  $env:SUPABASE_DB_URL = "postgresql://user:password@example.test:5432/postgres?sslmode=require"
  $ErrorActionPreference = "Continue"
  $dryRunOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath -DryRun -OutputDirectory $temporaryDirectory 2>&1
  $ErrorActionPreference = $previousErrorActionPreference
  if ($LASTEXITCODE -ne 0) {
    throw "Dry-run rejected a valid PostgreSQL URL: $dryRunOutput"
  }
  if (-not ($dryRunOutput -match "pg_dump")) {
    throw "Dry-run did not print the pg_dump command"
  }
  if (@(Get-ChildItem -Path $temporaryDirectory).Count -ne 0) {
    throw "Dry-run created output files"
  }
} finally {
  Remove-Item -Recurse -Force $temporaryDirectory -ErrorAction SilentlyContinue
  Remove-Item Env:SUPABASE_DB_URL -ErrorAction SilentlyContinue
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($scriptPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors.Count -gt 0) {
  throw "PowerShell parse errors: $parseErrors"
}

Write-Output "Backup script smoke tests passed."