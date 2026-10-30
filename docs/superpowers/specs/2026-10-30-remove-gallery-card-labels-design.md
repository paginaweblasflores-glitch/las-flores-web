# Diseño: quitar rótulos de las tarjetas de galería

## Objetivo

Eliminar el rótulo superpuesto que muestra el título en cada tarjeta de la
galería.

## Alcance

Quitar únicamente el elemento visual de texto superpuesto de cada tarjeta en
`src/routes/galeria.tsx`. Conservar el texto alternativo de las imágenes y el
pie de foto que aparece en el visor modal. No cambiar las categorías, imágenes,
estilos de la cuadrícula ni otras páginas.

## Verificación

Agregar una prueba que confirme que la cuadrícula ya no renderiza el rótulo y
que el visor sigue mostrando el título. Ejecutar la prueba enfocada y el build.
