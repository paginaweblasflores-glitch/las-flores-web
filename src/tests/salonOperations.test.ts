import { describe, expect, it } from "vitest";
import {
  addSalonDraftItem,
  buildSalonTables,
  canManageSalonCash,
  getSalonRequestId,
  partitionSalonItems,
  resolveSalonCustomPrice,
  searchSalonDishes,
  updateSalonDraftQuantity,
  type SalonOrderItem,
} from "../features/salon/operations";

describe("salon ordering operations", () => {
  it("searches dishes without being case- or accent-sensitive", () => {
    const dishes = [
      { id: "puca", name: "Puca Picante", category: "Típicos" },
      { id: "trucha", name: "Trucha Frita", category: "Especialidades" },
    ];

    expect(searchSalonDishes(dishes, "PUCA picánte")).toEqual([dishes[0]]);
  });

  it("routes drinks to the bar and all other dishes to the kitchen", () => {
    const items: SalonOrderItem[] = [
      { name: "Chicha de jora", category: "Bebidas", quantity: 2 },
      { name: "Puca picante", category: "Platos típicos", quantity: 1 },
    ];

    expect(partitionSalonItems(items)).toEqual({
      bar: [items[0]],
      kitchen: [items[1]],
    });
  });

  it("marks tables occupied only while they have an open salon account", () => {
    const tables = buildSalonTables(
      [{ id: "principal", name: "Salón Principal", max_tables_count: 2 }],
      [{ id: "order-1", zone_id: "principal", table_number: "1", status: "open" }],
    );

    expect(tables).toEqual([
      expect.objectContaining({ tableNumber: "1", isOccupied: true, accountId: "order-1" }),
      expect.objectContaining({ tableNumber: "2", isOccupied: false, accountId: null }),
    ]);
  });

  it("does not allow duplicate open accounts for one table when building status", () => {
    expect(() =>
      buildSalonTables(
        [{ id: "principal", name: "Salón Principal", max_tables_count: 1 }],
        [
          { id: "order-1", zone_id: "principal", table_number: "1", status: "open" },
          { id: "order-2", zone_id: "principal", table_number: "1", status: "open" },
        ],
      ),
    ).toThrow(/duplicate open account/i);
  });

  it("merges identical dish customizations but keeps different choices separate", () => {
    const first = {
      productId: "dish-1",
      name: "Pasta",
      category: "Pastas",
      quantity: 1,
      unitPrice: 40,
      customizations: { Proteína: "Pollo" },
    };
    const repeated = addSalonDraftItem([first], first);
    const alternate = addSalonDraftItem(repeated, {
      ...first,
      customizations: { Proteína: "Milanesa" },
      unitPrice: 42,
    });

    expect(alternate).toHaveLength(2);
    expect(alternate.map((item) => item.quantity)).toEqual([2, 1]);
  });

  it("removes a draft item when its quantity is decreased to zero", () => {
    const item = {
      productId: "dish-1",
      name: "Pasta",
      category: "Pastas",
      quantity: 1,
      unitPrice: 40,
      customizations: {},
    };
    expect(updateSalonDraftQuantity([item], "dish-1", {}, 0)).toEqual([]);
  });

  it("preserves the base price for free customization choices", () => {
    expect(
      resolveSalonCustomPrice(
        80,
        [
          {
            id: "side",
            title: "Acompañamiento",
            options: [{ id: "salad", name: "Ensalada", price: 0 }],
          },
        ],
        { side: "salad" },
      ),
    ).toBe(80);
  });

  it("allows only cashier and admin roles to access table payment actions", () => {
    expect(canManageSalonCash("cashier")).toBe(true);
    expect(canManageSalonCash("admin")).toBe(true);
    expect(canManageSalonCash("staff")).toBe(false);
  });

  it("reuses the same request ID for retries of an unchanged table order", () => {
    const first = getSalonRequestId(null, "order-a", () => "request-1");
    const retry = getSalonRequestId(first, "order-a", () => "request-2");
    const changed = getSalonRequestId(retry, "order-b", () => "request-3");

    expect(retry).toEqual({ signature: "order-a", id: "request-1" });
    expect(changed).toEqual({ signature: "order-b", id: "request-3" });
  });
});
