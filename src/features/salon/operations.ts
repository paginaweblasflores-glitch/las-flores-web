export interface SalonDish {
  id?: string;
  name: string;
  category: string;
}

export interface SalonOrderItem {
  id?: string;
  productId?: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice?: number;
  customizations?: Record<string, string>;
  selectedOptions?: Record<string, string>;
  notes?: string;
}

export interface SalonZone {
  id: string;
  name: string;
  max_tables_count: number;
}

export interface OpenSalonAccount {
  id: string;
  zone_id: string;
  table_number: string;
  status: string;
}

export interface SalonTable {
  zoneId: string;
  zoneName: string;
  tableNumber: string;
  isOccupied: boolean;
  accountId: string | null;
}

export interface SalonDraftItem extends SalonOrderItem {
  productId?: string;
  quantity: number;
  unitPrice: number;
  customizations: Record<string, string>;
}

export interface SalonRequestIdentity {
  signature: string;
  id: string;
}

export function canManageSalonCash(role: string): boolean {
  return role === "admin" || role === "cashier";
}

export function getSalonRequestId(
  current: SalonRequestIdentity | null,
  signature: string,
  createId: () => string,
): SalonRequestIdentity {
  if (current?.signature === signature) return current;
  return { signature, id: createId() };
}

function customizationKey(customizations: Record<string, string>): string {
  return JSON.stringify(
    Object.entries(customizations).sort(([first], [second]) => first.localeCompare(second)),
  );
}

export function getSalonDraftKey(item: SalonDraftItem): string {
  return `${item.productId || item.id || item.name}:${customizationKey(item.customizations)}`;
}

export function addSalonDraftItem(
  items: SalonDraftItem[],
  newItem: SalonDraftItem,
): SalonDraftItem[] {
  const key = getSalonDraftKey(newItem);
  const existing = items.find((item) => getSalonDraftKey(item) === key);
  if (!existing) return [...items, newItem];

  return items.map((item) =>
    getSalonDraftKey(item) === key ? { ...item, quantity: item.quantity + newItem.quantity } : item,
  );
}

export function updateSalonDraftQuantity(
  items: SalonDraftItem[],
  productId: string,
  customizations: Record<string, string>,
  quantity: number,
): SalonDraftItem[] {
  const key = getSalonDraftKey({
    productId,
    name: "",
    category: "",
    quantity: 0,
    unitPrice: 0,
    customizations,
  });

  return quantity < 1
    ? items.filter((item) => getSalonDraftKey(item) !== key)
    : items.map((item) => (getSalonDraftKey(item) === key ? { ...item, quantity } : item));
}

export function resolveSalonCustomPrice(
  basePrice: number,
  sections: Array<{
    id?: string;
    title: string;
    options: Array<{ id: string; name: string; price?: string | number }>;
  }>,
  selections: Record<string, string>,
): number {
  let price = basePrice;

  for (const section of sections) {
    const sectionId = section.id || section.title;
    const option = section.options.find(
      (candidate) =>
        candidate.id === selections[sectionId] || candidate.name === selections[sectionId],
    );
    if (!option || option.price === undefined) continue;

    const optionPrice = Number(
      String(option.price)
        .replace(/[^\d.,-]/g, "")
        .replace(",", "."),
    );
    if (Number.isFinite(optionPrice) && optionPrice > 0) price = optionPrice;
  }

  return price;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchSalonDishes<T extends SalonDish>(dishes: T[], query: string): T[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return dishes;

  return dishes.filter((dish) => {
    const searchableText = normalizeText(`${dish.name} ${dish.category}`);
    return terms.every((term) => searchableText.includes(term));
  });
}

export function partitionSalonItems<T extends SalonOrderItem>(
  items: T[],
): { bar: T[]; kitchen: T[] } {
  const bar: T[] = [];
  const kitchen: T[] = [];

  for (const item of items) {
    if (normalizeText(item.category).includes("bebida")) {
      bar.push(item);
    } else {
      kitchen.push(item);
    }
  }

  return { bar, kitchen };
}

export function buildSalonTables(
  zones: SalonZone[],
  openAccounts: OpenSalonAccount[],
): SalonTable[] {
  const accountsByTable = new Map<string, OpenSalonAccount>();

  for (const account of openAccounts) {
    if (account.status !== "open") continue;

    const key = `${account.zone_id}:${account.table_number}`;
    if (accountsByTable.has(key)) {
      throw new Error(`Duplicate open account for table ${key}`);
    }
    accountsByTable.set(key, account);
  }

  return zones.flatMap((zone) =>
    Array.from({ length: Math.max(0, Math.floor(zone.max_tables_count)) }, (_, index) => {
      const tableNumber = String(index + 1);
      const account = accountsByTable.get(`${zone.id}:${tableNumber}`);
      return {
        zoneId: zone.id,
        zoneName: zone.name,
        tableNumber,
        isOccupied: Boolean(account),
        accountId: account?.id ?? null,
      };
    }),
  );
}
