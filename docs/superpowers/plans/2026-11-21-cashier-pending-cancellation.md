# Cashier Pending Order Cancellation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a confirmed cancellation action to pending cashier order cards while preserving order history.

**Architecture:** Reuse the card's existing status update callback and `cancelled` canonical status. Keep all cancellation logic in `CashierOrderCard`; the route and Kanban view already refresh and group status changes.

**Tech Stack:** React, TypeScript, TanStack Router, Supabase, Vitest.

## Global Constraints

- The cancellation button is shown only for normalized pending cards.
- Cancellation preserves the order record and must set status to `cancelled`.
- Cancellation requires user confirmation.
- Do not delete orders or order items.
- No unrelated caja layout or status behavior changes.

---

### Task 1: Add the Pending Cancellation Test

**Files:**
- Modify: `src/tests/cashierOrdersAccess.test.ts`
- Read: `src/components/CashierOrderCard.tsx`

- [ ] **Step 1: Replace or extend the test file with a cancellation source contract**

```ts
describe("cashier pending order cancellation", () => {
  it("shows cancellation only for pending cards and updates cancelled status after confirmation", () => {
    const cardPath = resolve(process.cwd(), "src/components/CashierOrderCard.tsx");
    const card = readFileSync(cardPath, "utf8");

    expect(card).toContain('normalizedStatus === "pendiente"');
    expect(card).toContain('window.confirm');
    expect(card).toContain('onStatusChange(order.id, "cancelled")');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- src/tests/cashierOrdersAccess.test.ts`

Expected: FAIL because `CashierOrderCard.tsx` does not yet contain the cancellation implementation.

### Task 2: Implement the Pending Cancellation Button

**Files:**
- Modify: `src/components/CashierOrderCard.tsx:1-345`

- [ ] **Step 1: Add a handler beside `handleNextStatus`**

```ts
const handleCancel = async () => {
  const orderLabel = order.order_number
    ? `#${order.order_number}`
    : `#${order.id?.slice(0, 8) || "pedido"}`;
  if (!window.confirm(`¿Cancelar el pedido ${orderLabel}? Esta acción cambiará el pedido a cancelado.`)) {
    return;
  }

  setUpdating(true);
  try {
    await onStatusChange(order.id, "cancelled");
  } finally {
    setUpdating(false);
  }
};
```

- [ ] **Step 2: Add the red cancellation button in the existing footer action row**

Place it before `{currentStatus.nextAction && (`):

```tsx
{normalizedStatus === "pendiente" && (
  <button
    onClick={handleCancel}
    disabled={updating}
    className="py-2.5 px-3 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 font-sans text-xs font-black shadow-2xs transition-all disabled:opacity-50"
  >
    {updating ? "Cancelando..." : "Cancelar pedido"}
  </button>
)}
```

- [ ] **Step 3: Run the focused test**

Run: `npm test -- src/tests/cashierOrdersAccess.test.ts`

Expected: PASS.

- [ ] **Step 4: Build the application**

Run: `npm run build`

Expected: Production build passes.

- [ ] **Step 5: Review the diff**

Run: `git diff --stat; git diff -- src/components/CashierOrderCard.tsx src/tests/cashierOrdersAccess.test.ts`

Expected: Only the pending cancellation UI/test and no unrelated changes.
