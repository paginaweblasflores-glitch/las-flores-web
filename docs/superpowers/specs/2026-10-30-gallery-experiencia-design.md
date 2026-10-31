# Diseño: nuevas imágenes en la galería «Experiencia»

## Objetivo

Mostrar en la galería pública las 24 imágenes agregadas recientemente a
`public/imagenes-reales/galeria/eventos`, junto a las cuatro imágenes que ya
aparecen en la categoría «Experiencia».

## Enfoque

Se mantiene la categoría «Experiencia» existente y se agregan las 24 imágenes
sin mover, renombrar ni volver a procesar sus archivos. Las referencias deben
conservar los nombres exactos, incluidos los sufijos `.jpg.webp` y el espacio
en `DSC09791 - copia.jpg.webp`. Las imágenes existentes permanecen intactas.

Cada foto tendrá un texto alternativo y un título neutral, sin inferir detalles
que no estén confirmados. Se conservan el filtro de categorías, la cuadrícula
y el visor modal actuales; no se cambia la página de eventos ni otras partes
de la web.

## Verificación

- Confirmar que las 24 rutas de imagen están registradas en «Experiencia».
- Confirmar que cada archivo referenciado existe en la carpeta de eventos.
- Ejecutar la prueba enfocada de galería y las validaciones de tipos/build
  disponibles para el proyecto.
