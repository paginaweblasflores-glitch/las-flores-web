# Control de disponibilidad de platos en caja Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer visible el control de disponibilidad de platos para todos los usuarios autorizados del panel de caja.

**Architecture:** Reutilizar `CashierStockModal`, que ya actualiza `products.is_available` y sincroniza cambios. Modificar solo la condición de renderizado del botón en `src/routes/caja.tsx`.

**Tech Stack:** React 19, TypeScript, TanStack Router, Supabase, Vitest.

## Global Constraints

- Mantener los roles autorizados actuales: `admin`, `cashier` y `staff`.
- No modificar el flujo de autenticación ni la persistencia de `is_available`.
- No crear permisos nuevos ni afectar el panel administrativo.

---

### Task 1: Exponer el control de stock en caja

**Files:**
- Modify: `src/routes/caja.tsx`
- Test: `src/tests/cashierStockAccess.test.ts`

**Interfaces:**
- Consumes: `isAuthorized` y `isAdmin` del estado existente de `CashierDashboardRoute`.
- Produces: botón `Control de Stock` visible para cualquier usuario que haya superado `checkAuth`.

- [ ] **Step 1: Write the failing test**

Assert that the caja route does not guard the `Control de Stock` button with `isAdmin`, because all authorized cashier roles must reach the existing modal.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npx vitest run src/tests/cashierStockAccess.test.ts`

Expected: FAIL while the route still wraps the button in `{isAdmin && (...)}`.

- [ ] **Step 3: Remove the admin-only render guard**

Render the existing stock button directly inside the authorized caja view, preserving its click handler and the `CashierStockModal` wiring.

- [ ] **Step 4: Run the focused test and TypeScript check**

Run: `npx vitest run src/tests/cashierStockAccess.test.ts` and `npx tsc --noEmit`.

Expected: PASS with no TypeScript errors.