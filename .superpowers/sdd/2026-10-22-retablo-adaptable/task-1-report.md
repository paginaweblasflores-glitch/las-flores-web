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
