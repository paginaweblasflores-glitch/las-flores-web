# Supabase Backup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automate a daily logical backup of the Supabase `public` schema and publish it as a private GitHub Actions artifact.

**Architecture:** A PowerShell script validates `SUPABASE_DB_URL`, invokes `pg_dump` with SSL and custom format, then writes a SHA-256 checksum. A scheduled GitHub Actions workflow installs PostgreSQL client tools, runs the script, and uploads the dump and checksum with 30-day retention.

**Tech Stack:** PowerShell, PostgreSQL `pg_dump`/`pg_restore`, GitHub Actions, Supabase PostgreSQL.

## Global Constraints

- Never commit database URLs, passwords, dump files, or service-role keys.
- Back up only the `public` schema in this first iteration; Storage objects and managed Auth data need separate recovery procedures.
- The workflow must support both a daily schedule and manual dispatch.
- Artifacts must be retained for 30 days.
- Local dry-run validation must not contact Supabase.

---

### Task 1: Add backup script contract and tests

**Files:**

- Create: `scripts/backup-supabase.test.ps1`
- Create: `scripts/backup-supabase.ps1`

**Interfaces:**

- Consumes: `SUPABASE_DB_URL` and optional `-OutputDirectory`, `-DryRun`.
- Produces: `las-flores-public-<UTC timestamp>.dump` and matching `.sha256` file; dry-run prints the intended command.

- [ ] **Step 1: Write the failing smoke test**

```powershell
$scriptPath = Join-Path $PSScriptRoot "backup-supabase.ps1"
$output = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath -DryRun 2>&1
if ($LASTEXITCODE -eq 0) { throw "Expected dry-run to reject a missing SUPABASE_DB_URL" }
if (-not ($output -match "SUPABASE_DB_URL")) { throw "Missing configuration error" }
```

- [ ] **Step 2: Run it and verify it fails because the script is missing**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/backup-supabase.test.ps1`

Expected: FAIL because `scripts/backup-supabase.ps1` does not exist yet.

- [ ] **Step 3: Implement the minimal script**

The script will reject missing or non-PostgreSQL URLs, support `-DryRun`, call
`pg_dump --format=custom --no-owner --no-privileges --schema=public`, and write
the checksum only after a successful dump.

- [ ] **Step 4: Extend the smoke test for dry-run and checksum behavior**

The test will create a temporary output directory, set a fake PostgreSQL URL,
run `-DryRun`, and assert that no dump file is created. It will also parse the
script with PowerShell's parser to catch syntax errors.

- [ ] **Step 5: Run the smoke test and the existing suite**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/backup-supabase.test.ps1`
Run: `npm test`

Expected: both commands exit 0.

### Task 2: Schedule the backup in GitHub Actions

**Files:**

- Create: `.github/workflows/supabase-backup.yml`

**Interfaces:**

- Consumes: repository secret `SUPABASE_DB_URL`.
- Produces: a private artifact named `supabase-public-backup-<run number>` containing the dump and checksum.

- [ ] **Step 1: Add the workflow**

Configure `schedule: cron: "0 5 * * *"`, `workflow_dispatch`, read-only contents
permissions, PostgreSQL client installation, the script invocation, and
`actions/upload-artifact` with `retention-days: 30`.

- [ ] **Step 2: Validate the workflow text locally**

Run: `git diff --check -- .github/workflows/supabase-backup.yml scripts/backup-supabase.ps1 scripts/backup-supabase.test.ps1`

Expected: no whitespace errors. Confirm the workflow references only
`secrets.SUPABASE_DB_URL` and does not contain a literal password.

### Task 3: Document operation and restoration

**Files:**

- Create: `docs/SUPABASE_BACKUP.md`

**Interfaces:**

- Documents: secret setup, manual execution, artifact retrieval, checksum
  verification, `pg_restore`, retention, and Storage/Auth limitations.

- [ ] **Step 1: Write operator documentation**

Include exact GitHub settings path and PowerShell restore examples using a
destination connection string supplied at runtime.

- [ ] **Step 2: Review documentation for secret leakage**

Run: `git grep -n -i "password\|postgresql://.*@" -- docs/SUPABASE_BACKUP.md .github/workflows/supabase-backup.yml scripts/backup-supabase.ps1`

Expected: no literal credentials; examples use placeholders or environment variables.
