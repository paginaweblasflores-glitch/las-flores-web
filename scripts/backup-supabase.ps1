[CmdletBinding()]
param(
  [string]$OutputDirectory = (Join-Path ([IO.Path]::GetTempPath()) "las-flores-supabase-backup"),
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Get-ConnectionString {
  $connectionString = $env:SUPABASE_DB_URL
  if ([string]::IsNullOrWhiteSpace($connectionString)) {
    throw "SUPABASE_DB_URL is required."
  }

  $connectionUri = $null
  if (-not [Uri]::TryCreate($connectionString, [UriKind]::Absolute, [ref]$connectionUri)) {
    throw "SUPABASE_DB_URL must be a valid PostgreSQL connection URL."
  }
  if ($connectionUri.Scheme -notin @("postgres", "postgresql")) {
    throw "SUPABASE_DB_URL must use the postgres or postgresql scheme."
  }
  if ($connectionString -notmatch "(?i)(^|[?&])sslmode=(require|verify-ca|verify-full)(&|$)") {
    throw "SUPABASE_DB_URL must enable TLS with sslmode=require, verify-ca, or verify-full."
  }

  return $connectionString
}

$connectionString = Get-ConnectionString
$dumpCommand = @(
  "pg_dump",
  "--dbname=<SUPABASE_DB_URL>",
  "--format=custom",
  "--no-owner",
  "--no-privileges",
  "--schema=public"
) -join " "

if ($DryRun) {
  Write-Output "Dry run: $dumpCommand"
  exit 0
}

$pgDump = Get-Command "pg_dump" -ErrorAction SilentlyContinue
if ($null -eq $pgDump) {
  throw "pg_dump was not found in PATH. Install the PostgreSQL client tools."
}

if (-not (Test-Path -LiteralPath $OutputDirectory)) {
  New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

$timestamp = [DateTime]::UtcNow.ToString("yyyyMMdd-HHmmss")
$dumpPath = Join-Path $OutputDirectory "las-flores-public-$timestamp.dump"
$checksumPath = "$dumpPath.sha256"

Write-Output "Creating Supabase public schema backup: $dumpPath"
& $pgDump.Source "--dbname=$connectionString" "--format=custom" "--no-owner" "--no-privileges" "--schema=public" "--file=$dumpPath"
if ($LASTEXITCODE -ne 0) {
  Remove-Item -LiteralPath $dumpPath -Force -ErrorAction SilentlyContinue
  throw "pg_dump failed with exit code $LASTEXITCODE."
}

$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $dumpPath
"$($hash.Hash)  $([IO.Path]::GetFileName($dumpPath))" | Set-Content -LiteralPath $checksumPath -Encoding ASCII

Write-Output "Backup created: $dumpPath"
Write-Output "Checksum created: $checksumPath"