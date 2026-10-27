# Final fix report: secure orders and payments

## Result

Implemented the final review fixes on the existing `main` checkout. No branch or worktree was created. The implementation commit is:

- **Commit:** `c52b8ffb9ec0d5b7a8776e06be4132f36ed373b3`
- **Subject:** `fix: secure order delivery pricing and customizations`

## Findings addressed

1. **Trusted delivery pricing:** All four active `create_order_secure` definitions now derive delivery distance and fee from destination coordinates and database-defined restaurant coordinates/rules. Caller-supplied `p_delivery_fee` and `p_distance_km` remain accepted for RPC compatibility but no longer determine the fee or persisted distance. Pickup remains free; missing/out-of-range coordinates and deliveries beyond 8 km are rejected. Fee rules match the existing API: S/ 5 base, S/ 1.5/km, rounded to one decimal.
2. **Structured customization data:** The cart retains option IDs separately from display labels. `buildOrderItem` and `createOrder` serialize those IDs in `customizations`; notes still contain human-readable labels. SQL resolves the IDs against `products.custom_options`, calculates the trusted catalog price, and rejects unknown options.
3. **Reliable cashier transition payload:** Every SQL installation path sets `orders` to `REPLICA IDENTITY FULL`. Notifications now require a card/Culqi payment to transition exactly from `pending` to `paid`.
4. **Unrelated updates:** Null/failed-to-paid, paid-to-paid, and missing-old-state payloads do not notify.

## Files in the implementation commit

- `src/components/BreakfastCustomizationModal.tsx`
- `src/context/CartContext.tsx`
- `src/lib/cashierNotifications.ts`
- `src/lib/orderItems.ts`
- `src/lib/supabase.ts`
- `src/tests/cart.test.ts`
- `src/tests/cashierNotifications.test.ts`
- `src/tests/orderPaymentSecurity.test.ts`
- `src/tests/orderPaymentSqlRuntime.test.ts`
- `supabase/full_schema_v2.sql`
- `supabase/hardening_rls.sql`
- `supabase/migrate_custom_order_details.sql`
- `supabase/migrate_new_db.sql`

## TDD evidence

**RED:** Before production edits, ran:

```text
npm test -- src/tests/cart.test.ts src/tests/cashierNotifications.test.ts src/tests/orderPaymentSecurity.test.ts src/tests/orderPaymentSqlRuntime.test.ts --reporter=dot
```

The new regressions failed: the cart helper omitted structured selections; failed/null-to-paid could notify; `createOrder` omitted customizations from RPC arguments; and SQL definitions lacked derived-distance handling and the new shared distance helper. The initial test setup also exposed a conflicting coupon-function stub (`cannot change return type of existing function`); the fixture was corrected to load the actual SQL function. Later, the new out-of-zone runtime assertion exposed a numeric overflow when distance was assigned before the zone check; fee validation was ordered before distance storage.

**GREEN:** After those corrections, the same focused command completed with:

```text
Test Files  4 passed (4)
Tests       72 passed (72)
Duration    23.46s
```

The PGlite regressions execute each SQL script's relevant functions and replica-identity statement. They verify forged fee/distance values cannot lower the order total or stored distance, option IDs are catalog-priced and invalid IDs rejected, pickup/delivery zones remain enforced, and `relreplident` is `f`.

## Final validation

| Command | Result |
| --- | --- |
| `npm test -- --reporter=dot` | Exit 0; 25 files passed, 182 tests passed. |
| `npx tsc --noEmit` | Exit 0; no diagnostics. |
| `npm run build` | Exit 0; client: 2,105 modules, built in 17.16s; SSR: 185 modules, built in 8.79s; static build script completed. |
| `git diff --check` | Exit 0; no whitespace errors. Git emitted only LF-to-CRLF working-copy warnings for existing Windows line-ending configuration. |

## Concerns and limits

- No live Supabase database or Realtime subscription was available, so live publication/old-row payload behavior was not verified. The SQL config is exercised in PGlite and notification predicate behavior is unit-tested against full, missing, null, and failed old-state payload shapes.
- PGlite tests execute the relevant extracted SQL functions and `REPLICA IDENTITY FULL` statement, not each entire deployment script against a live Supabase project.
- Delivery destination coordinates are necessarily supplied by the checkout client. The database now derives distance/fee from those coordinates against the fixed server-side restaurant location and policy; this does not independently geocode or verify the physical destination.
- Pre-existing Culqi-refund and Tesoros working-tree changes were not staged or committed.
