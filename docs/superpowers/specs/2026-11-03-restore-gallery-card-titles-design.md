# Restaurar títulos en las tarjetas de galería

## Objetivo

Volver a mostrar el título de cada imagen superpuesto en su tarjeta de la
galería.

## Alcance

En `src/routes/galeria.tsx`, restaurar la etiqueta anterior dentro de cada
tarjeta, en la esquina superior derecha y con el título de `img.titulo`.
Conservar la imagen, su texto alternativo, las categorías y el pie de foto del
visor sin cambios. No modificar otras páginas ni rediseñar la etiqueta.

## Verificación

Actualizar la prueba enfocada de las etiquetas para comprobar que la tarjeta
renderiza el título y conserva el texto alternativo, y que el visor mantiene su
pie de foto. Ejecutar esa prueba y las pruebas relacionadas de la galería.
