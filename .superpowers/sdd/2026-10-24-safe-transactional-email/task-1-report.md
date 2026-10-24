# Task 1 Report: Server-Owned Transactional Email Templates

## Status

Implemented and committed on the existing `main` branch. No branch or worktree was created.

**Implementation commit:** `542d136` — `fix: move transactional email templates server-side`

## Changes

- Added `api/_lib/emailTemplates.ts`, a server-side renderer for `order`, `reservation`, `contact`, `eventQuote`, `complaint`, `complaintResponse`, and `reviewRequest`.
- Added template-specific data validation, field allowlists, required-field checks, email validation, and bounded order item/customization counts.
- Fixed all internal destinations to `contacto@restaurantelasflores.com`; customer delivery uses only validated email fields in the corresponding operation data. Sender identities and reply-to policies are server-owned.
- Escaped interpolated HTML text, restricted the order tracking URL to a fixed origin and validated order identifier, and rejected unknown template names or extra destination/markup/URL fields.
- Reworked `src/lib/emailService.ts` so every request to `/api/send-email` and the Supabase fallback contains only `{ template, data }`. The renderer is not imported by browser code.
- Added `src/tests/emailTemplates.test.ts` for the allowlist, each template's required fields, recipients, invalid email/destination inputs, and escaping.

### Caller coverage

Existing public helper signatures remain intact, so all call sites continue using their established workflows:

- `sendOrderEmails`: `src/components/CartSidebar.tsx` — customer receipt and fixed internal notification, with their distinct subjects.
- `sendReservationEmail`: `src/routes/reservas.tsx` — customer confirmation and fixed internal notification.
- `sendContactEmail`: `src/routes/contacto.tsx` — fixed internal destination and validated customer reply-to.
- `sendEventQuoteEmail`: `src/routes/eventos.tsx` — fixed internal destination and validated customer reply-to.
- `sendComplaintEmail`: `src/routes/libro-de-reclamaciones.tsx` — customer receipt and fixed internal notification.
- `sendComplaintResponseEmail`: `src/components/AdminComplaintsSection.tsx` — customer response.
- `sendReviewRequestEmail`: `src/routes/caja.tsx` and `src/components/AdminOrderDetailModal.tsx` — customer review request.

## TDD Evidence

- **RED:** Before the renderer existed, `npm test -- --run src\tests\emailTemplates.test.ts` failed because Vitest could not resolve `../../api/_lib/emailTemplates`; the expected server-side renderer was absent.
- **GREEN:** After implementation, the focused test run passed: **1 test file, 22 tests passed**.

## Verification

- `npm test -- --run src\tests\emailTemplates.test.ts` — passed, 22 tests.
- `npm test -- --run` — passed, 26 files and 204 tests.
- `npx tsc --noEmit` — passed.
- `npx eslint api\_lib\emailTemplates.ts src\lib\emailService.ts src\tests\emailTemplates.test.ts` — passed.
- `npm run build` — passed.
- Searched generated `dist\assets` for `Invalid transactional email data`, `INTERNAL_RECIPIENT`, and `renderTransactionalEmail`; no renderer strings were present in browser assets.
- `git diff --check` — passed before commit. Only the three Task 1 implementation/test files were staged for the implementation commit.

## Concerns / Handoff

- This task intentionally did not change `api/send-email.ts` or the Supabase Edge Function. They still need the follow-up Tasks 2–3 to accept and render `{ template, data }`; until those changes land, the newly migrated client contract is not yet end-to-end compatible with the existing handlers.
- Template validation checks customer email syntax and the narrow operation-data shape, but does not prove that an address belongs to a persisted order/reservation. Server-side authorization, rate limiting, and any transaction-to-recipient association remain for the endpoint/security tasks.
- `npm run test:functions` was not run because no API handler changed in Task 1; run it after handler imports are changed in the later endpoint task.
