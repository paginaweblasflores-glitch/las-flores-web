# Cashier Pending Order Cancellation

## Goal

Allow a cashier to cancel only pending orders from the order card in the caja panel.

## Behavior

- Show a red “Cancelar pedido” button in the footer action area for cards whose canonical status is `pendiente`.
- Do not show the button for `en_preparacion`, `en_camino`, `entregado`, or `cancelado` cards.
- Before cancelling, show the existing browser confirmation dialog.
- Confirmed cancellation calls the existing `onStatusChange(orderId, "cancelled")` status update.
- The existing realtime polling/status refresh removes the cancelled card from the active Kanban columns.
- Preserve the order record and its history; do not delete the order or its items.

## Copy

- Button: `Cancelar pedido`
- Confirmation: `¿Cancelar el pedido #<order_number or id>? Esta acción cambiará el pedido a cancelado.`
- During update: `Cancelando...`

## Verification

Add a focused source-level test covering:
- the cancellation button is guarded by pending status;
- the button asks for confirmation;
- confirmed cancellation updates the status to `cancelled`;
- non-pending cards do not expose cancellation.
