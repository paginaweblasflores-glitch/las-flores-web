# Task 1 Report: Secure Order Pricing

## Status

**Complete.** Implemented Task 1 only on `main`. No branch or worktree was created. Existing Culqi authorization and Tesoros changes were not staged or committed.

## Changes

- `supabase/hardening_rls.sql`
- `supabase/migrate_new_db.sql`
- `supabase/migrate_custom_order_details.sql`
- `supabase/full_schema_v2.sql`
- `src/tests/orderPaymentSecurity.test.ts`

The four SQL paths now add `products.custom_options`, backfill the approved choices from `src/lib/liveProducts.ts` for products whose server-side choices are empty, and reject unrecognized submitted option IDs. Every active `create_order_secure` definition ignores item `unit_price`, uses the database product price and matched server-owned option price, stores the resolved prices in a server-built item list, and reuses those exact values for subtotal and `order_items`. The functions also validate order type/payment method, enforce at most 100 items and quantities 1–99, and retain product availability checks.

No charge/order API, CartSidebar, or other client integration was changed.

## TDD evidence

### RED — before changing SQL

Command: `npm test -- --run src/tests/orderPaymentSecurity.test.ts`

Exact output:

```text
> test
> vitest run --run src/tests/orderPaymentSecurity.test.ts


 RUN  v4.1.10 C:/Users/alcar/las-flores-web

 ❯ src/tests/orderPaymentSecurity.test.ts (12 tests | 12 failed) 18ms
     × ignores caller prices and validates server-owned options in 'supabase/hardening_rls.sql' 8ms
     × ignores caller prices and validates server-owned options in 'supabase/migrate_new_db.sql' 1ms
     × ignores caller prices and validates server-owned options in 'supabase/migrate_custom_order_details…' 2ms
     × ignores caller prices and validates server-owned options in 'supabase/full_schema_v2.sql' 1ms
     × stores the approved server-owned customization catalog in 'supabase/hardening_rls.sql' 1ms
     × stores the approved server-owned customization catalog in 'supabase/migrate_new_db.sql' 1ms
     × stores the approved server-owned customization catalog in 'supabase/migrate_custom_order_details…' 1ms
     × stores the approved server-owned customization catalog in 'supabase/full_schema_v2.sql' 1ms
     × bounds and validates order inputs in 'supabase/hardening_rls.sql' 1ms
     × bounds and validates order inputs in 'supabase/migrate_new_db.sql' 1ms
     × bounds and validates order inputs in 'supabase/migrate_custom_order_details…' 0ms
     × bounds and validates order inputs in 'supabase/full_schema_v2.sql' 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 12 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > ignores caller prices and validates server-owned options in 'supabase/hardening_rls.sql'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > ignores caller prices and validates server-owned options in 'supabase/migrate_new_db.sql'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > ignores caller prices and validates server-owned options in 'supabase/migrate_custom_order_details…'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > ignores caller prices and validates server-owned options in 'supabase/full_schema_v2.sql'
 AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/tests/orderPaymentSecurity.test.ts:29:97
     27|     const definition = getCreateOrderSecure(sql);
     28|
     29|     expect(/v_(?:product_)?price\s*:=\s*COALESCE\(\(v_item->>'unit_pri…
       |                                                                                                 ^
     30|     expectMatch(definition, /SELECT\s+name,\s*price,\s*custom_options,…
     31|     expect(definition.match(/jsonb_each_text\s*\(\s*COALESCE\(v_item->…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/12]⎯

 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > stores the approved server-owned customization catalog in 'supabase/hardening_rls.sql'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > stores the approved server-owned customization catalog in 'supabase/migrate_new_db.sql'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > stores the approved server-owned customization catalog in 'supabase/migrate_custom_order_details…'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > stores the approved server-owned customization catalog in 'supabase/full_schema_v2.sql'
 AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ expectMatch src/tests/orderPaymentSecurity.test.ts:22:32
     20|
     21| function expectMatch(source: string, pattern: RegExp) {
     22|   expect(pattern.test(source)).toBe(true);
       |                                ^
     23| }
     24|
 ❯ src/tests/orderPaymentSecurity.test.ts:38:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/12]⎯

 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > bounds and validates order inputs in 'supabase/hardening_rls.sql'
 AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ expectMatch src/tests/orderPaymentSecurity.test.ts:22:32
     20|
     21| function expectMatch(source: string, pattern: RegExp) {
     22|   expect(pattern.test(source)).toBe(true);
       |                                ^
     23| }
     24|
 ❯ src/tests/orderPaymentSecurity.test.ts:49:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/12]⎯

 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > bounds and validates order inputs in 'supabase/migrate_new_db.sql'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > bounds and validates order inputs in 'supabase/migrate_custom_order_details…'
 FAIL  src/tests/orderPaymentSecurity.test.ts > secure order pricing SQL > bounds and validates order inputs in 'supabase/full_schema_v2.sql'
 AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ expectMatch src/tests/orderPaymentSecurity.test.ts:22:32
     20|
     21| function expectMatch(source, pattern) {
     22|   expect(pattern.test(source)).toBe(true);
       |                                ^
     23| }
     24|
 ❯ src/tests/orderPaymentSecurity.test.ts:47:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/12]⎯

 Test Files  1 failed (1)
      Tests  12 failed (12)
   Start at  14:48:58
   Duration  560ms (transform 31ms, setup 0ms, import 54ms, tests 18ms, environment 0ms)
```

The failures reproduce the existing client-authoritative `unit_price` assignments and missing server-side catalog/validation behavior.

### GREEN — after the SQL changes

Command: `npm test -- --run src/tests/orderPaymentSecurity.test.ts`

Exact final output:

```text
> test
> vitest run --run src/tests/orderPaymentSecurity.test.ts


 RUN  v4.1.10 C:/Users/alcar/las-flores-web


 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  14:55:01
   Duration  901ms (transform 89ms, setup 0ms, import 148ms, tests 35ms, environment 0ms)
```

Additional check: `npx eslint src/tests/orderPaymentSecurity.test.ts` exited 0 with no output.

## Commit

- SHA: `cab253cebd1845426d167e96a69584478b9ad546`
- Subject: `fix: secure order prices from database catalog`

Only the four Task 1 SQL files and regression test were staged in this commit.

## Concerns

- No `psql` or `pg_format` executable was available, so the SQL was reviewed and regression-tested as source but was not executed against a live PostgreSQL/Supabase database.
- The migration backfill seeds products that exist when the SQL runs and preserves nonempty admin-managed `custom_options`. New products added later must have their approved server-side choices populated in `products.custom_options`.
