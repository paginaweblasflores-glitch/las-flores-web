# Cashier Audit Separate Report Design

## Goal

Make the cashier audit modal show dish and delivery totals independently and print them independently or together.

## Calculations

- Dish amount: sum of `subtotal - discount_amount` for non-cancelled orders on the selected date.
- Delivery amount: sum of `delivery_fee` for non-cancelled delivery orders on the selected date.
- Complete audit: preserve the existing cash, online, delivery fee, net sales, delivery count, and pickup count totals.
- Cancelled orders are excluded.

## Modal

Add a clear dish-sales KPI and retain the existing delivery-fee KPI. Use the existing selected-date filter.

## Printing

Provide three print actions:

1. `Imprimir solo platos`
2. `Imprimir solo delivery`
3. `Imprimir arqueo completo`

The separate reports include the selected date and the corresponding total. The complete report retains the existing cash, online, fee, net sales, and command counts.

## Scope

This change is limited to `CashierAuditModal`. It does not change order state, monthly closures, or general cashier columns.
