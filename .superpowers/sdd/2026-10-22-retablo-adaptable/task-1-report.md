# Informe — Task 1: pruebas de encaje responsivo del retablo

## Alcance

Se modificaron únicamente las pruebas solicitadas:

- `src/tests/retabloWrapper.test.ts`
- `src/tests/retabloContentLayout.test.ts`

No se implementaron ni modificaron estilos de producción. Se conservaron las comprobaciones existentes de perspectiva, puertas y contenido completo del retablo.

## Cambios en las pruebas

- La prueba del wrapper mantiene los requisitos de ancho de escritorio (`lg:w-[calc(50vw_-_40px)]` y `lg:max-w-[900px]`), rechaza el mínimo rígido `lg:min-h-[900px]` y requiere una regla de altura dependiente del viewport. La comprobación admite unidades `vh`, `dvh`, `svh` o `lvh`, `min-h-screen` y estilos inline equivalentes, sin exigir una única clase concreta.
- La prueba de la sección rechaza el padding inferior fijo `lg:pb-40` y requiere una clase de padding vertical de escritorio basada en unidades de viewport.
- Las pruebas existentes de perspectiva y apertura completa de puertas, así como las comprobaciones del relato, la fotografía y los enlaces de acción, siguen presentes y sin cambios de comportamiento.

## TDD — evidencia RED

Los selectores se ejecutaron tras escribir cada prueba, con los estilos de producción intactos:

| Comando | Resultado esperado y observado |
| --- | --- |
| `npm test -- src/tests/retabloWrapper.test.ts` | RED: 1 fallo nuevo por encontrar `lg:min-h-[900px]`; los otros 5 tests pasaron. |
| `npm test -- src/tests/retabloContentLayout.test.ts` | RED: 1 fallo nuevo por encontrar `lg:pb-40`; los otros 3 tests pasaron. |
| `npm test -- src/tests/retabloWrapper.test.ts src/tests/retabloContentLayout.test.ts` | RED esperado: 2 fallos nuevos y 8 tests pasaron. |

Las fallas corresponden a los mínimos y espacios fijos que esta tarea debe detectar; no son errores de configuración ni de sintaxis. El estado rojo es intencional: la implementación de producción corresponde a una tarea posterior.

## Validaciones

- `npx eslint src/tests/retabloWrapper.test.ts src/tests/retabloContentLayout.test.ts`: correcto.
- `npx prettier --check src/tests/retabloWrapper.test.ts src/tests/retabloContentLayout.test.ts`: correcto.
- `git diff --check`: correcto.
- No se ejecutó el build: no hubo cambios de producción y el objetivo de esta tarea es demostrar RED mediante los dos selectores de pruebas.

## Resultado

Task 1 queda implementada como pruebas de regresión; el checkout conserva deliberadamente dos fallos esperados hasta que se adapte el layout en la tarea correspondiente.

## FIX — ronda de revisión (base `253e65beb0b8332afc73334f4435ac4e11af2303`)

- Se sustituyó el rechazo puntual de `lg:pb-40` por una comprobación de límite sobre todas las utilidades de padding vertical de escritorio `lg:p-*`, `lg:py-*`, `lg:pt-*` y `lg:pb-*`. El límite acepta valores fijos de hasta 2 rem (escala Tailwind 8) y rechaza valores superiores, incluso cuando hay otra regla viewport. Se cubrieron expresamente los casos coexistentes `lg:pb-[10vh] lg:pb-48`, `lg:py-40 lg:pb-[10vh]` y `lg:p-40 lg:pb-[10vh]`; el padding pequeño `lg:pt-6` con la regla viewport se admite.
- El matcher de altura del wrapper ahora acepta `h-screen` y `h-dvh` además de las clases min-height, unidades viewport arbitrarias y estilo inline. Pruebas de regresión comprueban las dos clases equivalentes reportadas.
- No se modificó ningún archivo de producción.

### Comandos de la ronda FIX y resultados

| Comando | Resultado |
| --- | --- |
| `npm test -- src/tests/retabloContentLayout.test.ts` | 1 fallo intencional: la sección existente excede el límite por `lg:pb-40`; 4 de 5 tests pasan, incluidos los casos de `pb-48`, `py-40`, `p-40` coexistiendo con padding viewport. |
| `npm test -- src/tests/retabloWrapper.test.ts` | 1 fallo intencional: el wrapper todavía contiene `lg:min-h-[900px]`; 7 de 8 tests pasan, incluidas las comprobaciones de aceptación `h-screen` y `h-dvh`. |
| `npx eslint src/tests/retabloWrapper.test.ts src/tests/retabloContentLayout.test.ts` | Correcto. |
| `npx prettier --check src/tests/retabloWrapper.test.ts src/tests/retabloContentLayout.test.ts` | `All matched files use Prettier code style!` |
| `git diff --check` | Correcto. |

Las dos fallas que permanecen son las regresiones esperadas ante el layout de producción actual; no se buscaron resultados verdes porque esta tarea no incluye implementar el layout.

## FIX — falsa alarma de `lg:py-px`

- Se añadió una aserción de regresión que acepta `lg:py-px` aunque coexista con padding basado en viewport.
- El clasificador ahora reconoce el token de escala `px` como el padding mínimo de 1 px antes de intentar parsearlo como escala numérica o valor arbitrario. Sin ese caso, el token se clasificaba como valor desconocido y excesivo.
- No se modificó producción.

### Comandos y resultados

| Comando | Resultado |
| --- | --- |
| `npm test -- src/tests/retabloContentLayout.test.ts` | 1 fallo RED esperado: el layout actual sigue excediendo el límite por `lg:pb-40`; 4 de 5 tests pasan. La aserción nueva `lg:py-px` pasa. |
| `npx eslint src/tests/retabloContentLayout.test.ts src/tests/retabloWrapper.test.ts` | Correcto. |
| `npx prettier --check src/tests/retabloContentLayout.test.ts src/tests/retabloWrapper.test.ts` | `All matched files use Prettier code style!` |
| `git diff --check` | Correcto. |
