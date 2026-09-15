# Backup de Supabase

## Qué respalda

El workflow `.github/workflows/supabase-backup.yml` ejecuta diariamente
`pg_dump` sobre el esquema `public`. El dump incluye tablas, datos, funciones,
triggers, índices y políticas RLS. Cada ejecución también genera un checksum
SHA-256 y publica ambos archivos como artifact privado durante 30 días.

Este proceso no respalda los objetos binarios de Supabase Storage ni el
esquema administrado de Auth. Para recuperación ante desastre, habilita
también PITR en Supabase si el plan lo permite y conserva una estrategia
separada para los archivos de Storage.

## Configuración inicial

1. En GitHub abre `Settings -> Secrets and variables -> Actions`.
2. Crea un repository secret llamado `SUPABASE_DB_URL`.
3. Usa la conexión PostgreSQL de Supabase con `sslmode=require` o un modo TLS
   más estricto. No pegues esa URL en el repositorio, issues ni logs.
4. Abre `Actions -> Supabase database backup` y ejecuta `Run workflow` una vez.
5. Comprueba que el job termina correctamente y que aparece el artifact del
   número de ejecución.

El schedule corre diariamente a las 05:00 UTC. GitHub puede retrasar unos
minutos los workflows programados durante periodos de alta demanda.

## Ejecución local sin conectarse

El modo dry-run valida la variable y no crea archivos:

```powershell
$env:SUPABASE_DB_URL = "postgresql://<usuario>:<clave>@<host>:5432/postgres?sslmode=require"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/backup-supabase.ps1 -DryRun
Remove-Item Env:SUPABASE_DB_URL
```

## Restauración

Descarga el artifact desde la ejecución correspondiente y verifica primero el
checksum. En PowerShell:

```powershell
Get-FileHash .\las-flores-public-YYYYMMDD-HHMMSS.dump -Algorithm SHA256
Get-Content .\las-flores-public-YYYYMMDD-HHMMSS.dump.sha256
```

Después revisa el contenido en una base de datos de destino. Configura la
conexión solo en la sesión actual y nunca la escribas en un archivo:

```powershell
$env:RESTORE_DB_URL = "postgresql://<usuario>:<clave>@<host-destino>:5432/postgres?sslmode=require"
pg_restore --dbname=$env:RESTORE_DB_URL --clean --if-exists --no-owner --no-privileges .\las-flores-public-YYYYMMDD-HHMMSS.dump
Remove-Item Env:RESTORE_DB_URL
```

No ejecutes `pg_restore --clean` contra producción sin una copia previa,
aprobación y ventana de mantenimiento. La restauración de `public` no recupera
las imágenes de Storage ni usuarios administrados por Auth.

## Operación segura

- Mantén el repositorio privado porque los dumps contienen datos personales.
- No descargues artifacts a carpetas sincronizadas públicamente.
- Revoca y reemplaza `SUPABASE_DB_URL` si se expone.
- Comprueba periódicamente una restauración de prueba; un backup no verificado
  no es una recuperación garantizada.
