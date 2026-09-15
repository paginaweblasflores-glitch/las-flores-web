# Backup de Supabase - Diseño

## Objetivo

Crear un backup lógico automático de la base de datos pública de Las Flores,
sin guardar credenciales ni dumps dentro del repositorio.

## Alcance

- Ejecutar `pg_dump` contra la URL PostgreSQL guardada en el secreto `SUPABASE_DB_URL`.
- Respaldar el esquema `public`, incluyendo tablas, datos, funciones, triggers, índices y políticas RLS.
- Generar un archivo PostgreSQL en formato custom y un checksum SHA-256.
- Ejecutar el proceso diariamente mediante GitHub Actions y permitir ejecución manual.
- Conservar cada artifact durante 30 días.
- Documentar configuración, restauración y límites conocidos.

## Fuera de alcance

- No se subirán archivos de Storage; los objetos requieren un procedimiento separado.
- No se respaldará el esquema administrado `auth` mediante este flujo.
- No se añadirá una clave de base de datos al código, `.env` ni configuración de Vercel.

## Arquitectura

El workflow usa un runner Ubuntu con `pg_dump` instalado. El secreto de GitHub
se inyecta únicamente como variable de entorno del proceso. El script crea un
directorio temporal, ejecuta el dump con SSL obligatorio, genera el checksum y
expone las rutas como outputs del workflow. GitHub Actions publica ambos
archivos como artifact privado con retención de 30 días.

## Restauración

La restauración se realizará con `pg_restore` sobre una base de datos de
destino, usando una conexión administrativa y revisando primero el contenido.
Nunca se restaurará directamente sobre producción sin una copia previa y una
ventana de mantenimiento.

## Validación

- El modo `-DryRun` verifica que la variable exista, que la URL use PostgreSQL
  y que el directorio de salida sea válido sin conectarse ni crear un dump.
- El workflow falla si `pg_dump` o el checksum fallan.
- El checksum se verifica antes de una restauración.
