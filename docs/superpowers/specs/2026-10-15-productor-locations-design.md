# Procedencia de productos de temporada

## Objetivo

En la página “Tesoros de Ayacucho”, reemplazar las etiquetas que describen usos
de los productos por su principal procedencia productora, en el formato
“Nombre - Lugar”. La procedencia debe ser comprobable; usar una ciudad cuando
las fuentes la confirmen y, si no, la región productora verificada.

## Alcance

- Actualizar los 20 productos mostrados en las cuatro temporadas del catálogo
  activo: Verano (6), Otoño (6), Invierno (3) y Primavera (5).
- Mostrar el nombre y el lugar productor juntos en el título de cada tarjeta.
- Retirar de las tarjetas las etiquetas de usos; no sustituirlas por otra lista
  de usos o descripciones.
- Conservar temporadas, meses, imágenes, colores, tipografías, dimensiones,
  grilla, filtros y demás distribución actual.
- No modificar la carta del restaurante ni datos de productos fuera de esta
  página. `productosPorTemporadaAnterior` no es la fuente del catálogo visible.

## Diseño

Añadir el lugar productor a los datos de cada producto del catálogo activo y
componer el título como `nombre - lugarProductor`. Eliminar del render de las
tarjetas las etiquetas generadas desde `usos`; mantener la etiqueta de temporada
y la presentación existente. Las procedencias no requieren un nuevo servicio,
dependencia ni cambio de base de datos.

La asignación de cada lugar se verificará con fuentes agrícolas o institucionales
confiables. Si una fuente solo permite confirmar una región, se mostrará esa
región, no una ciudad inferida. Las fuentes consultadas y el criterio aplicado
a cada producto se registrarán en el cambio para que la selección sea auditable,
sin añadir elementos visuales a las tarjetas.

## Validación

- Prueba de catálogo: los 20 productos de la colección activa tienen un lugar
  productor no vacío y siguen distribuidos en las cuatro temporadas.
- Prueba de presentación: cada tarjeta muestra el patrón `Nombre - Lugar` y no
  presenta sus etiquetas de usos.
- Ejecutar la prueba específica de la página y el build existente para validar
  el tipado y evitar regresiones de presentación o recursos.
- Revisar el diff para confirmar que no cambiaron imágenes ni clases/estilos de
  la grilla, tarjetas, colores o tipografías.
