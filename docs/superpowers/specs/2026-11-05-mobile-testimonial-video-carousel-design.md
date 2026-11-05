# Carrusel móvil de videos de testimonios

## Objetivo

En la sección “Recomendado por quienes nos visitan”, mostrar cada video de forma
individual en móvil y comunicar una sola vez que hay más videos disponibles al
deslizar horizontalmente.

## Diseño aprobado

- Solo en móvil, el carrusel muestra una tarjeta de video completa a la vez.
- Cada tarjeta ocupa el ancho disponible del carrusel; no se deja visible una
  parte de la siguiente tarjeta.
- El desplazamiento horizontal conserva el ajuste (snap) para que cada gesto
  lleve a una tarjeta individual.
- Una indicación “Desliza para ver más” aparece una vez al inicio y se oculta
  cuando el usuario empieza a desplazar el carrusel.
- En escritorio se conserva la cuadrícula existente, sin carrusel ni indicación.
- Cada video mantiene su poster, botón de sonido y funcionamiento independiente.

## Implementación prevista

Actualizar la sección `ClientVideosSection` en `src/routes/restaurante.tsx`.
Mantener el punto de quiebre de escritorio existente, ajustar el ancho móvil de
las tarjetas para ocupar el carrusel, y agregar estado local para ocultar la
indicación en el primer desplazamiento horizontal. No se modificarán los
controles ni la lógica compartida de reproducción de `FestividadVideo`.

## Verificación

- Revisar que la sección mantenga la cuadrícula de cuatro columnas en escritorio.
- Revisar que en móvil una tarjeta ocupe el área completa y que el snap avance
  entre videos individualmente.
- Verificar que la indicación solo aparezca antes de la primera interacción de
  desplazamiento y luego desaparezca.
- Ejecutar la validación disponible para el cambio (build y/o pruebas dirigidas).
