# Task 2 — Secure Card Checkout

**Status:** Implemented and committed; local validation complete. Deployment was not verified.
**Implementation commit:** `8f08afd102f33f16f0db36e9f3fa524d00ce8c97` — `fix: secure card checkout attempts`
**Branch:** `main`

## Scope

Implemented the approved Task 2 card-checkout brief on the existing branch. Task 1's server-owned `products.custom_options` pricing and admin-only option protection were preserved. Cash/Yape remain on the authenticated unpaid-order path. No branch or worktree was created, and unrelated Culqi-refund and Tesoros local changes were left unstaged and untouched.

## Implementation

- The Culqi endpoint validates the Supabase bearer token using `auth.getUser`; order identity and email come from that authenticated user, not caller-supplied identity fields. It fails closed when the Supabase service-role key is missing.
- The endpoint resolves custom-option labels to trusted catalog IDs and passes canonical options to SQL. Pending-order RPCs calculate product/custom-option pricing, delivery, coupon discount, and total on the server.
- A unique checkout-attempt ID is persisted with the pending order before the provider charge is submitted. Replays return the existing state and do not submit another charge. Ambiguous provider outcomes remain pending for reconciliation.
- Before completion, the endpoint fetches the charge from Culqi and verifies provider success, charge identity, paid state, exact PEN amount, checkout-attempt association, and order association. Only then does the service-role completion RPC mark the order paid.
- The browser no longer has a fallback charge path or creates a second card order. Cash/Yape still use the authenticated unpaid-order RPC. Cashier order queries and realtime notifications exclude pending, failed, and legacy unverified card orders.
- All four SQL scripts contain the pending/complete/fail RPCs and their service-role-only grants, payment-state storage and uniqueness, direct-write protections, and restrictions on the public unpaid-order RPC. Static tests check grant consistency and the checkout behavior across the scripts.

## TDD evidence

Focused tests were extended before the implementation changes.

**RED — initial focused security tests:** the observed run reported **42 tests, 22 failed** against the then-current implementation.

**RED — direct-write protection assertions:** before adding the SQL insert/payment-state protections, the focused run reported **4 failures** in those new assertions.

**GREEN — focused payment-security and pricing tests, after implementation (fresh run):**

```text
Test Files  2 passed (2)
      Tests  76 passed (76)
```

The earlier RED output was retained in the task session as counts rather than a complete raw terminal transcript; the exact observed failure counts are recorded above.

## Files changed in the implementation commit

- `api/culqi-charge.ts`
- `src/components/CartSidebar.tsx`
- `src/lib/supabase.ts`
- `src/routes/caja.tsx`
- `src/tests/orderPaymentSecurity.test.ts`
- `supabase/full_schema_v2.sql`
- `supabase/hardening_rls.sql`
- `supabase/migrate_custom_order_details.sql`
- `supabase/migrate_new_db.sql`

## Validation

- Focused payment-security and pricing tests: **2 files, 76 tests passed**.
- Full suite (`npm test`): **23 files, 167 tests passed**.
- TypeScript (`npx tsc --noEmit`): passed.
- Production build (`npm run build`): exited successfully.
- ESLint for `api/culqi-charge.ts` and `src/tests/orderPaymentSecurity.test.ts`: passed.
- `git diff --check`: passed.
- Targeted ESLint on `CartSidebar.tsx`, `supabase.ts`, and `caja.tsx` reports `any`/`prefer-const` findings and React hook dependency warnings. They were outside this change's scope and were not modified; no pre-change lint baseline was captured.

## Limitations and concerns

- Tests inspect migration/RPC grant definitions and mocked endpoint behavior; **they do not prove deployed Supabase permissions**. No live Culqi charge, live Supabase call, or production deployment was performed.
- SQL was reviewed for consistency across the four scripts, but no PostgreSQL parser/runtime was available to apply the migrations locally. Apply the appropriate migration and verify service-role grants in the target Supabase project before enabling card checkout.
- Production must have `SUPABASE_SERVICE_ROLE_KEY` configured server-side; absence intentionally causes the endpoint to fail closed.
- Pending ambiguous payments require reconciliation before the customer retries. This avoids duplicate charges but requires an operational reconciliation process.

## Commit

`8f08afd102f33f16f0db36e9f3fa524d00ce8c97` — `fix: secure card checkout attempts`

## Task 2 review fix round — 2026-10-24

**Fix commit:** `6b973b83348e26959466fe2134098c9d1a5d26d7` — `fix: release failed checkout coupon reservations`

### Findings addressed

- All four SQL scripts serialize coupon-use checks with a row lock in both public unpaid-order creation and pending card-order creation. A pending order stores a coupon code only if it actually reserved a valid coupon. `fail_card_order_attempt` releases that reservation only when it changes the order from `pending` to `failed`; repeated failures and failures for an order that never reserved a coupon leave the use count unchanged. Pending/ambiguous attempts retain their reservation, and paid attempts retain the consumed use.
- Added PGlite runtime coverage that extracts and executes the pending/complete/fail RPC definitions from each SQL script against a minimal PostgreSQL-compatible fixture. It verifies catalog/custom-option pricing and totals despite a caller-supplied price, max-use reservation behavior, invalid amount/currency rejection without completing payment, reservation release exactly once, retry on a new ID, pending replay, and paid completion replay.
- Cashier notifications now include the transition of an unready card order to `paid`, while unrelated updates to an already-paid order do not notify. Realtime refresh remains unconditional as before.

### TDD evidence

**RED — coupon release:** `npm test -- --run src/tests/orderPaymentSqlRuntime.test.ts` reported **4 tests failed**; each showed `current_uses: 1` after a definitive failure where `0` was expected.

**RED — invalid coupon ownership:** the same command reported **4 tests failed** after adding the case for an attempt that reached the coupon-use limit. A failure on that order incorrectly reduced another pending order's reservation (`expected current_uses: 1, received 0`).

**RED — cashier transition:** `npm test -- --run src/tests/cashierNotifications.test.ts` reported **1 test failed** because the route did not yet use the transition notification predicate.

The implementation followed those failures. The final focused suite passed:

```text
npm test -- --run src/tests/orderPaymentSecurity.test.ts src/tests/pricing.test.ts src/tests/orderPaymentSqlRuntime.test.ts src/tests/cashierNotifications.test.ts
Test Files  4 passed (4)
     Tests  85 passed (85)
```

### Validation

- `npm test`: **25 test files passed, 176 tests passed**.
- `npx tsc --noEmit`: passed.
- `npm run build`: exited successfully.
- `npx eslint src/lib/cashierNotifications.ts src/tests/cashierNotifications.test.ts src/tests/orderPaymentSecurity.test.ts src/tests/orderPaymentSqlRuntime.test.ts`: passed.
- `npx prettier --check src/tests/orderPaymentSqlRuntime.test.ts src/tests/cashierNotifications.test.ts src/lib/cashierNotifications.ts src/tests/orderPaymentSecurity.test.ts src/routes/caja.tsx`: passed.
- `git diff --check`: passed.
- Targeted ESLint including `src/routes/caja.tsx` still reports its existing `any` and React hook-dependency findings; no unrelated lint cleanup was made.

### Runtime-test scope and limitations

PGlite executes the relevant PL/pgSQL function definitions, with a minimal fixture schema, for all four scripts; coupon validation uses each script's own definition when present and the full-schema definition otherwise. This exercises the SQL function bodies and guards instead of only regex-checking them or mocking RPC results. Static tests additionally check that both order-creation paths lock coupon rows in all four scripts.

This environment test does **not** apply each complete migration, prove the target Supabase project's grants/RLS or schema compatibility, test simultaneous transactions across separate database connections, or contact live Supabase/Culqi services. The row-lock concurrency behavior is verified by the SQL definition and sequential max-use regression, not by an interleaved multi-connection runtime test. Production deployment remains unverified.

### Files changed in this fix round

- `package.json`
- `package-lock.json`
- `src/lib/cashierNotifications.ts`
- `src/routes/caja.tsx`
- `src/tests/cashierNotifications.test.ts`
- `src/tests/orderPaymentSecurity.test.ts`
- `src/tests/orderPaymentSqlRuntime.test.ts`
- `supabase/full_schema_v2.sql`
- `supabase/hardening_rls.sql`
- `supabase/migrate_custom_order_details.sql`
- `supabase/migrate_new_db.sql`
