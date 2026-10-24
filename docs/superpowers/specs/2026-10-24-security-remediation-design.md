# Security Remediation Design

## Goal

Remediate confirmed repository-level vulnerabilities in order creation/payment
integrity, email delivery, and driver tracking while preserving the existing
customer checkout, transactional email, and driver PIN workflows.

## Scope and constraints

- The user requested fixes for all identified issues.
- The Culqi refund authorization fix already exists locally and must remain in
  place; it requires a valid Supabase user with `admin` or `staff` role.
- Do not add CAPTCHA or another bot-verification service.
- Do not replace, lengthen, or throttle the existing driver PIN.
- Preserve legitimate customer and internal transactional email workflows.
- Live Supabase/Vercel state is not available for verification; SQL changes must
  be documented for deployment and apply to repository installation paths.

## Design

### Orders and payment integrity

Make the database the source of truth for product prices and order totals.
Ignore caller-supplied unit prices and payment status. Preserve legitimate
customizable product price variants only when they can be matched to an
authoritative server-side option; otherwise use the catalog price.

The public order RPC must not create a card/Culqi order that appears paid without
a verified payment. Use a server-controlled verification and order-creation
path that confirms the Culqi charge ID, amount, currency, and successful status
before storing the charge reference and paid method. Direct public RPC calls
must not bypass this check. Keep non-card payment methods available as pending
or unverified payments according to the existing cashier process.

### Email endpoints

Keep legitimate order, reservation, complaint, event, and contact notifications,
but stop accepting arbitrary recipient addresses and raw HTML for delivery.
Use named server-side templates with validated data, escape interpolated text,
fixed internal destinations, and customer addresses derived from the relevant
operation. Apply persistent per-source rate limits without CAPTCHA. Update both
the Vercel API and Supabase Edge Function paths so the fallback is not a weaker
relay.

### Driver tracking

Keep the existing PIN and entry experience. Do not return address, coordinates,
customer contact details, or item information until the server verifies the PIN
for that order. The initial tracking request must not reveal sensitive fields
using only an order UUID. Preserve server-side PIN checks for delivery-status
updates. Per the user’s direction, do not add attempt lockout or rate limiting
for PIN verification; brute-force resistance of the existing short PIN remains
a residual risk.

### Refund authorization

Retain the local fix that validates the Supabase access token with Supabase Auth
and checks the caller’s server-side profile role before making a Culqi refund.
Do not trust client UI checks as authorization.

## Data flow and errors

- Reject malformed, unauthorized, unpaid, or inconsistent operations before
  creating/updating payment-bearing order records.
- Never return customer delivery information before server-side PIN validation.
- Email handlers should reject unknown template names, malformed fields, and
  requests exceeding the persistent rate limit; do not expose provider details.
- Never log access tokens, payment credentials, PIN values, or full sensitive
  payloads.

## Validation

- Add regression tests that demonstrate unauthorized or unverified payment
  orders cannot be recorded as paid and caller-supplied prices are ignored.
- Verify the email routes accept intended templates, reject arbitrary HTML or
  recipients, escape user-controlled content, and enforce rate limits.
- Verify driver tracking does not return private fields before a valid PIN and
  continues to return the intended fields after valid verification.
- Keep the existing Culqi refund authorization test passing.
- Run the focused tests, full test suite, formatting/lint checks for changed
  files, and production build.
- Review every SQL installation/migration script that can create the affected
  RPCs or policies so later database setup does not reintroduce the issue.

## Residual risks and deployment

No CAPTCHA means automated abuse can still occur below or around configured
rate limits. The existing four-digit PIN remains susceptible to guessing
because the user requested no PIN throttling. SQL source changes do not update
the live Supabase project automatically; production remediation requires
applying the reviewed migration and verifying deployed function definitions,
grants, and policies.
