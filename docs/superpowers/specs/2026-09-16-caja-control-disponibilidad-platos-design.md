# Control de disponibilidad de platos en caja

## Objetivo

Permitir que cualquier usuario autorizado del panel de caja pueda marcar platos como disponibles o agotados desde el control de stock.

## Diseño

El panel `/caja` ya autoriza los roles `admin`, `cashier` y `staff`. El componente `CashierStockModal` ya consulta los productos, actualiza `products.is_available` y refleja los cambios en tiempo real. Se cambiará únicamente la visibilidad del botón `Control de Stock` para que dependa de la autorización al panel y no de `isAdmin`.

## Flujo y errores

- El usuario autorizado abre `Control de Stock` desde la pestaña de seguimiento.
- El modal muestra los platos y su estado actual.
- El botón del plato invierte `is_available` y actualiza la lista local.
- Si Supabase devuelve un error, se conserva el estado anterior y se muestra el aviso existente.

## Verificación

- Confirmar que el botón ya no está condicionado por `isAdmin`.
- Ejecutar el chequeo de TypeScript sin emitir archivos.