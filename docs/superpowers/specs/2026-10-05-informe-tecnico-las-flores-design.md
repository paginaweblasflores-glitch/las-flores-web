# Diseño: informe técnico del proyecto Las Flores

## Propósito

Preparar un documento Word editable, en español técnico, que desarrolle las secciones solicitadas sobre el sitio web y sistema operativo del Restaurante Las Flores. El contenido se basará en el estado actual del repositorio y distinguirá los resultados verificables de las actividades que requieren comprobación en el entorno productivo o con usuarios.

## Audiencia y presentación

- Audiencia: lectores técnicos o académicos que necesitan comprender la solución implementada.
- Formato: `.docx`, con títulos jerárquicos, tablas legibles, numeración de secciones y anexos prácticos.
- Sin portada académica ni datos personales.
- Ubicación acordada: `docs/Informe_Tecnico_Las_Flores.docx`.

## Estructura y contenido

1. **3.1.4 Descripción de tablas, llaves y relaciones**
   - Resumir las entidades del esquema Supabase/PostgreSQL, sus claves primarias, claves foráneas y reglas de borrado relevantes.
   - Explicar las relaciones de perfiles, catálogo, zonas, bloqueos, reservas, pedidos, detalle de pedidos, cupones, PIN de repartidor y mensajes de contacto.
   - Identificar por separado los módulos SQL complementarios (por ejemplo, bolsa de trabajo y cierres de caja), sin presentarlos como si fueran parte del mismo archivo base.
2. **3.1.5 Conexión de BD**
   - Describir `@supabase/supabase-js`, la configuración desde variables de entorno, persistencia/actualización de sesión, RLS y funciones RPC de operaciones sensibles.
   - Indicar nombres de variables sin valores secretos.
3. **3.2 IMPLEMENTACIÓN**
   - **3.2.1 Modelo de Interfaces:** describir interfaces públicas y operativas (carta, reservas, pedidos/seguimiento, administración y caja) con rutas del proyecto.
   - **3.2.2 Código fuente:** documentar el stack real según `package.json` y la separación en rutas, componentes, utilidades, funciones API y SQL; no repetir afirmaciones obsoletas de la documentación existente.
   - **3.2.3 Despliegue:** documentar build y configuración de publicación observables en scripts y configuración de Vercel, distinguiendo configuración de evidencia de despliegue real.
4. **4. CIERRE DEL PROYECTO**
   - **4.1.1 Pruebas:** ejecutar el conjunto de pruebas automatizadas del repositorio y registrar resultados reales.
   - **4.1.2 Validación:** describir la cobertura demostrada por pruebas y las verificaciones manuales/operativas que no puedan demostrarse localmente.
   - **4.1.3 Entrega y puesta en marcha:** documentar requisitos, variables, compilación, configuración y lista de comprobación de operación.
5. **Conclusiones:** sintetizar el alcance técnico y los límites de la evidencia disponible.
6. **Anexos:** inventario de rutas y tablas, variables de entorno (nombres únicamente), comandos de puesta en marcha y resultados de pruebas.

## Fuentes de verdad

- Código y dependencias actuales en `package.json`, `src/`, `api/` y `scripts/`.
- Esquema base en `supabase/full_schema_v2.sql`; scripts SQL complementarios para funcionalidades adicionales.
- Configuración de entorno de muestra en `.env.example` y configuración de publicación en `vercel.json`.
- Pruebas automatizadas en `src/tests/`.
- Documentos Markdown existentes se usarán como contexto de negocio, no como autoridad cuando discrepen con la implementación actual.

## Criterio de evidencia y exactitud

- No incluir claves, tokens, direcciones de conexión privadas ni valores de entorno.
- No declarar como ejecutada una publicación productiva, aceptación de usuarios o prueba manual sin evidencia.
- Las pruebas del repositorio se identificarán como automatizadas y se informará el resultado de la ejecución realizada para este informe.
- Si dos fuentes discrepan, prevalece la implementación actual y se explicará el alcance de los módulos SQL complementarios.
- No añadir capturas de pantalla que no se hayan obtenido de una instancia verificable.

## Criterios de aceptación

- El `.docx` contiene todos los encabezados solicitados y está redactado en español claro y formal.
- Las tablas de base de datos distinguen columnas/llaves y explican las relaciones principales.
- La conexión y el despliegue describen la arquitectura real sin exponer secretos ni confundir configuración con producción validada.
- Las pruebas y validaciones reflejan evidencia observada, y las limitaciones quedan explícitas.
- El documento puede editarse en Microsoft Word y mantiene estructura legible de secciones, tablas y anexos.
