import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  ChefHat,
  CircleDollarSign,
  Clock3,
  LogOut,
  Minus,
  Plus,
  Search,
  ShoppingBasket,
  Utensils,
  Wine,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import type { Category, Dish } from "../components/MenuModal";
import type { SalonAccount, SalonStaff } from "../features/salon/api";
import {
  closeSalonAccount,
  getOpenSalonAccounts,
  getSalonMenu,
  getSalonStaff,
  getSalonZones,
  sendSalonTicket,
} from "../features/salon/api";
import {
  addSalonDraftItem,
  buildSalonTables,
  canManageSalonCash,
  getSalonDraftKey,
  getSalonRequestId,
  resolveSalonCustomPrice,
  searchSalonDishes,
  updateSalonDraftQuantity,
  type SalonDraftItem,
} from "../features/salon/operations";
import { supabase, signOut } from "../lib/supabase";
import type { RestaurantZone } from "../features/zones/types";

export const Route = createFileRoute("/salon")({
  component: SalonRoute,
});

type DraftItem = SalonDraftItem;

const money = (amount: number) =>
  `S/ ${amount.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function priceNumber(value: string | number): number {
  const parsed = Number(
    String(value)
      .replace(/[^\d.,-]/g, "")
      .replace(",", "."),
  );
  return Number.isFinite(parsed) ? parsed : 0;
}

function SalonRoute() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<SalonStaff | null>(null);
  const [zones, setZones] = useState<RestaurantZone[]>([]);
  const [accounts, setAccounts] = useState<SalonAccount[]>([]);
  const [activeZoneId, setActiveZoneId] = useState("");
  const [selectedTableNumber, setSelectedTableNumber] = useState("");
  const [search, setSearch] = useState("");
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [customizingDish, setCustomizingDish] = useState<{
    dish: Dish;
    category: string;
  } | null>(null);
  const [customizationSelections, setCustomizationSelections] = useState<Record<string, string>>(
    {},
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "pos">("cash");
  const [receiptType, setReceiptType] = useState<"boleta" | "factura">("boleta");
  const [customerName, setCustomerName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [menuError, setMenuError] = useState("");
  const pendingRequest = useRef<ReturnType<typeof getSalonRequestId> | null>(null);

  const isCashier = staff ? canManageSalonCash(staff.role) : false;

  const loadAccounts = useCallback(async () => {
    const data = await getOpenSalonAccounts();
    setAccounts(data);
  }, []);

  const loadMenu = useCallback(async () => {
    setMenuLoading(true);
    try {
      const menu = await getSalonMenu();
      setCategories(menu);
      setMenuError("");
    } catch (error) {
      setMenuError(
        error instanceof Error
          ? `No se pudo cargar la carta: ${error.message}`
          : "No se pudo cargar la carta.",
      );
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const [profile, restaurantZones, openAccounts] = await Promise.all([
          getSalonStaff(),
          getSalonZones(),
          getOpenSalonAccounts(),
        ]);
        if (!active) return;
        setStaff(profile);
        setZones(restaurantZones);
        setAccounts(openAccounts);
        setActiveZoneId((current) => current || restaurantZones[0]?.id || "");
        await loadMenu();
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "No se pudo verificar tu acceso.";
        if (message.includes("Inicia sesión")) {
          navigate({ to: "/staff-login" });
          return;
        }
        setErrorMessage(message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadMenu, navigate]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      void loadAccounts().catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : "No se actualizaron las mesas.");
      });
    }, 5000);

    const channel = supabase
      .channel("salon-account-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "salon_accounts" }, () => {
        void loadAccounts().catch((error: unknown) => {
          setErrorMessage(error instanceof Error ? error.message : "No se actualizaron las mesas.");
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "salon_tickets" }, () => {
        void loadAccounts().catch((error: unknown) => {
          setErrorMessage(
            error instanceof Error ? error.message : "No se actualizaron las comandas.",
          );
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        void loadMenu();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => {
        void loadMenu();
      })
      .subscribe();

    return () => {
      window.clearInterval(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [loadAccounts, loadMenu]);

  const activeZone = zones.find((zone) => zone.id === activeZoneId) || null;
  const tables = useMemo(() => buildSalonTables(zones, accounts), [zones, accounts]);
  const zoneTables = tables.filter((table) => table.zoneId === activeZoneId);
  const selectedTable =
    zoneTables.find((table) => table.tableNumber === selectedTableNumber) || null;
  const selectedAccount = selectedTable
    ? accounts.find((account) => account.id === selectedTable.accountId) || null
    : null;
  const flattenedDishes = useMemo(
    () =>
      categories.flatMap((category: Category) =>
        category.dishes.map((dish) => ({
          dish,
          category: category.label,
        })),
      ),
    [categories],
  );
  const matchingDishes = useMemo(() => {
    const searchable = flattenedDishes.map(({ dish, category }, index) => ({
      id: String(index),
      name: dish.name,
      category,
    }));
    return searchSalonDishes(searchable, search)
      .map(({ id }) => flattenedDishes[Number(id)])
      .filter((entry): entry is (typeof flattenedDishes)[number] => Boolean(entry));
  }, [flattenedDishes, search]);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const dismissMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const addDish = (
    dish: Dish,
    category: string,
    customizations: Record<string, string> = {},
    unitPrice?: number,
    selectedOptions: Record<string, string> = {},
  ) => {
    const price = unitPrice ?? priceNumber(dish.price);
    const newItem: DraftItem = {
      id: dish.id,
      productId: dish.id,
      name: dish.name,
      category,
      quantity: 1,
      unitPrice: price,
      customizations,
      selectedOptions,
    };
    setDraftItems((current) => addSalonDraftItem(current, newItem));
  };

  const updateDraftQuantity = (item: DraftItem, quantity: number) => {
    setDraftItems((current) =>
      updateSalonDraftQuantity(
        current,
        item.productId || item.id || item.name,
        item.customizations,
        quantity,
      ),
    );
  };

  const addSelectedDish = () => {
    if (!customizingDish) return;
    const sections = customizingDish.dish.custom_options || [];
    if (sections.some((section) => !customizationSelections[section.id || section.title])) return;

    const customizations: Record<string, string> = {};
    const selectedOptions: Record<string, string> = {};
    for (const section of sections) {
      const sectionId = section.id || section.title;
      const selectedId = customizationSelections[sectionId];
      const option = section.options.find(
        (item) => item.id === selectedId || item.name === selectedId,
      );
      if (!option) continue;
      customizations[section.title.replace(/^\d+\.\s*/, "")] = option.name;
      selectedOptions[sectionId] = option.id;
    }

    const selectedPrice = resolveSalonCustomPrice(
      priceNumber(customizingDish.dish.price),
      sections,
      customizationSelections,
    );
    addDish(
      customizingDish.dish,
      customizingDish.category,
      customizations,
      selectedPrice,
      selectedOptions,
    );
    setCustomizingDish(null);
    setCustomizationSelections({});
  };

  const submitOrder = async () => {
    if (!activeZone || !selectedTable || draftItems.length === 0) return;
    dismissMessages();
    setSaving(true);
    try {
      const signature = JSON.stringify({
        zoneId: activeZone.id,
        tableNumber: selectedTable.tableNumber,
        items: draftItems,
      });
      pendingRequest.current = getSalonRequestId(pendingRequest.current, signature, () =>
        crypto.randomUUID(),
      );
      await sendSalonTicket(
        activeZone.id,
        selectedTable.tableNumber,
        draftItems,
        pendingRequest.current.id,
      );
      setDraftItems([]);
      pendingRequest.current = null;
      setSuccessMessage(
        "Comanda guardada. La impresión automática está pendiente de conectar las impresoras del local.",
      );
      await loadAccounts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar la comanda.");
    } finally {
      setSaving(false);
    }
  };

  const chargeAccount = async () => {
    if (!selectedAccount || !selectedTable) return;
    dismissMessages();
    setSaving(true);
    try {
      await closeSalonAccount(
        selectedAccount.id,
        paymentMethod,
        receiptType,
        customerName.trim(),
        documentNumber.trim(),
      );
      setSuccessMessage(
        `Cuenta cobrada por ${paymentMethod === "cash" ? "efectivo" : "POS"} y mesa liberada. Emisión de ${receiptType} pendiente de configurar el facturador.`,
      );
      setSelectedTableNumber("");
      setCustomerName("");
      setDocumentNumber("");
      await loadAccounts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo cobrar la cuenta.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/staff-login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f1] p-8 text-center text-[#47584d]">
        Cargando salón...
      </div>
    );
  }

  if (!staff) {
    return (
      <main className="min-h-screen bg-[#f7f6f1] p-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-red-800">
          <AlertCircle className="mb-3" />
          {errorMessage || "No se pudo verificar el acceso al módulo de salón."}
          <button
            type="button"
            className="mt-4 block font-bold underline"
            onClick={() => navigate({ to: "/staff-login" })}
          >
            Volver al ingreso del personal
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-[#21372b]">
      <header className="sticky top-0 z-30 border-b border-[#dfe5dc] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#738477]">
              Restaurante Las Flores
            </p>
            <h1 className="font-serif text-xl font-black sm:text-2xl">Pedidos en salón</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-xs text-[#728174]">{isCashier ? "Caja" : "Mozo"}</span>
              <span className="block max-w-48 truncate text-sm font-bold">{staff.name}</span>
            </span>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex items-center gap-2 rounded-xl border border-[#dfe5dc] px-3 py-2 text-sm font-bold hover:bg-[#f4f6f0]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-7">
        {(errorMessage || successMessage) && (
          <div
            role={errorMessage ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-xl border p-3 text-sm font-semibold ${
              errorMessage
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            {errorMessage ? <AlertCircle size={18} /> : <Check size={18} />}
            <span>{errorMessage || successMessage}</span>
            <button type="button" className="ml-auto underline" onClick={dismissMessages}>
              Cerrar
            </button>
          </div>
        )}

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b887d]">
                Salones
              </p>
              <h2 className="font-serif text-xl font-bold">Selecciona un salón y una mesa</h2>
            </div>
            <div className="flex gap-3 text-xs font-semibold text-[#566659]">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Libre
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Ocupada
              </span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => {
                  setActiveZoneId(zone.id);
                  setSelectedTableNumber("");
                  setDraftItems([]);
                }}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                  activeZoneId === zone.id
                    ? "border-[#315d45] bg-[#315d45] text-white shadow-sm"
                    : "border-[#dde4da] bg-white text-[#304538] hover:border-[#75907a]"
                }`}
              >
                <span className="block text-sm font-bold">{zone.name}</span>
                <span
                  className={`mt-0.5 block text-xs ${activeZoneId === zone.id ? "text-white/75" : "text-[#78877a]"}`}
                >
                  {tables.filter((table) => table.zoneId === zone.id && !table.isOccupied).length}{" "}
                  libres ·{" "}
                  {tables.filter((table) => table.zoneId === zone.id && table.isOccupied).length}{" "}
                  ocupadas
                </span>
              </button>
            ))}
          </div>
          {activeZone && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {zoneTables.map((table) => (
                <button
                  key={`${table.zoneId}:${table.tableNumber}`}
                  type="button"
                  onClick={() => {
                    setSelectedTableNumber(table.tableNumber);
                    setDraftItems([]);
                    dismissMessages();
                  }}
                  className={`rounded-xl border p-3 text-left transition ${
                    selectedTableNumber === table.tableNumber
                      ? "border-[#315d45] ring-2 ring-[#315d45]/20"
                      : ""
                  } ${
                    table.isOccupied
                      ? "border-rose-200 bg-rose-50 hover:border-rose-400"
                      : "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
                  }`}
                >
                  <span className="block text-sm font-black">Mesa {table.tableNumber}</span>
                  <span
                    className={`mt-1 block text-xs font-bold ${table.isOccupied ? "text-rose-700" : "text-emerald-700"}`}
                  >
                    {table.isOccupied
                      ? money(Number(accounts.find((a) => a.id === table.accountId)?.subtotal || 0))
                      : "Libre"}
                  </span>
                </button>
              ))}
            </div>
          )}
          {zones.length === 0 && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              No hay salones activos configurados para tomar pedidos.
            </p>
          )}
        </section>

        {selectedTable && (
          <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b887d]">
                    {activeZone?.name}
                  </p>
                  <h2 className="font-serif text-2xl font-black">
                    Mesa {selectedTable.tableNumber}
                  </h2>
                </div>
                {selectedAccount && (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                    Cuenta abierta · {money(Number(selectedAccount.subtotal))}
                  </span>
                )}
              </div>

              {!isCashier && (
                <>
                  <label className="flex items-center gap-3 rounded-xl border border-[#dce3da] bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#315d45]/20">
                    <Search size={19} className="shrink-0 text-[#738477]" />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar un plato rápidamente..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-[#9aa59b]"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="text-xs font-bold text-[#55705e]"
                      >
                        Limpiar
                      </button>
                    )}
                  </label>

                  {menuLoading ? (
                    <p className="rounded-xl bg-white p-5 text-sm text-[#6a796d]">
                      Cargando la carta...
                    </p>
                  ) : menuError ? (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
                    >
                      {menuError}
                    </p>
                  ) : matchingDishes.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-[#d5ddd3] bg-white p-7 text-center text-sm text-[#68786c]">
                      {search
                        ? "No encontramos platos con esa búsqueda."
                        : "No hay platos disponibles en la carta."}
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {matchingDishes.map(({ dish, category }) => (
                        <article
                          key={`${category}:${dish.id || dish.name}`}
                          className="flex min-h-36 flex-col rounded-2xl border border-[#e1e5de] bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948a]">
                                {category}
                              </p>
                              <h3 className="mt-1 font-serif text-base font-bold">{dish.name}</h3>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#edf3e9] px-2.5 py-1 text-xs font-black text-[#345f46]">
                              {dish.price}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[#6d796e]">
                            {dish.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (dish.custom_options?.length) {
                                setCustomizingDish({ dish, category });
                                setCustomizationSelections({});
                              } else {
                                addDish(dish, category);
                              }
                            }}
                            disabled={!dish.id}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#315d45] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#244b35] disabled:cursor-not-allowed disabled:opacity-50"
                            title={
                              !dish.id
                                ? "Este producto aún no tiene identificador en el catálogo."
                                : undefined
                            }
                          >
                            <Plus size={16} />
                            {dish.custom_options?.length ? "Personalizar" : "Agregar"}
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}

              {isCashier && selectedAccount && <AccountDetails account={selectedAccount} />}
              {isCashier && !selectedAccount && (
                <p className="rounded-xl border border-dashed border-[#d5ddd3] bg-white p-7 text-center text-sm text-[#68786c]">
                  Esta mesa no tiene una cuenta abierta para cobrar.
                </p>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              {!isCashier && (
                <section className="rounded-2xl border border-[#dfe5dc] bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#edf0eb] px-4 py-4">
                    <div>
                      <h3 className="font-serif text-lg font-black">Comanda</h3>
                      <p className="text-xs text-[#768377]">
                        {activeZone?.name} · Mesa {selectedTable.tableNumber}
                      </p>
                    </div>
                    <ShoppingBasket className="text-[#597762]" size={21} />
                  </div>
                  <div className="max-h-[45vh] space-y-3 overflow-y-auto p-4">
                    {selectedAccount?.salon_tickets
                      .flatMap((ticket) => ticket.salon_ticket_items)
                      .map((item) => (
                        <div key={item.id} className="rounded-xl bg-[#f7f8f5] p-3">
                          <div className="flex justify-between gap-2 text-sm font-semibold">
                            <span>
                              {item.quantity} × {item.product_name}
                            </span>
                            <span>{money(Number(item.unit_price) * item.quantity)}</span>
                          </div>
                          {Object.entries(item.customizations || {}).map(([label, value]) => (
                            <p key={label} className="mt-1 text-xs text-[#758174]">
                              {label}: {value}
                            </p>
                          ))}
                        </div>
                      ))}
                    {draftItems.map((item) => {
                      const identity = getSalonDraftKey(item);
                      return (
                        <div key={identity} className="rounded-xl border border-[#dce5da] p-3">
                          <div className="flex justify-between gap-2 text-sm font-semibold">
                            <span>{item.name}</span>
                            <span>{money(item.unitPrice * item.quantity)}</span>
                          </div>
                          {Object.entries(item.customizations).map(([label, value]) => (
                            <p key={label} className="mt-1 text-xs text-[#758174]">
                              {label}: {value}
                            </p>
                          ))}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-[#68786c]">
                              {money(item.unitPrice)} c/u
                            </span>
                            <div className="flex items-center gap-2 rounded-lg bg-[#f2f4ef] p-1">
                              <button
                                type="button"
                                aria-label={`Quitar ${item.name}`}
                                onClick={() => updateDraftQuantity(item, item.quantity - 1)}
                                className="rounded p-1 hover:bg-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-5 text-center text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Agregar ${item.name}`}
                                onClick={() => updateDraftQuantity(item, item.quantity + 1)}
                                className="rounded p-1 hover:bg-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {!selectedAccount?.salon_tickets.length && draftItems.length === 0 && (
                      <p className="py-6 text-center text-sm text-[#839084]">
                        Agrega platos para comenzar la comanda.
                      </p>
                    )}
                  </div>
                  <div className="space-y-3 border-t border-[#edf0eb] p-4">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total de la mesa</span>
                      <span>{money(Number(selectedAccount?.subtotal || 0) + draftTotal)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void submitOrder()}
                      disabled={saving || draftItems.length === 0}
                      className="w-full rounded-xl bg-[#315d45] px-4 py-3 text-sm font-black text-white hover:bg-[#244b35] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Guardando..." : "Enviar comanda"}
                    </button>
                    <p className="text-center text-[11px] leading-relaxed text-[#7d887f]">
                      Las bebidas se separan para bar y los platos para cocina. La impresión queda
                      pendiente mientras se configura el conector del local.
                    </p>
                  </div>
                </section>
              )}

              {isCashier && selectedAccount && (
                <section className="space-y-4 rounded-2xl border border-[#dfe5dc] bg-white p-4 shadow-sm">
                  <div>
                    <h3 className="font-serif text-lg font-black">Cobrar mesa</h3>
                    <p className="text-sm text-[#6c796d]">
                      Total a cobrar: <strong>{money(Number(selectedAccount.subtotal))}</strong>
                    </p>
                  </div>
                  <fieldset>
                    <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-[#718074]">
                      Pago presencial
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(["cash", "pos"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`rounded-xl border p-3 text-sm font-bold ${paymentMethod === method ? "border-[#315d45] bg-[#eef4eb] text-[#315d45]" : "border-[#e0e5de]"}`}
                        >
                          {method === "cash" ? "Efectivo" : "POS físico"}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-[#718074]">
                      Comprobante
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(["boleta", "factura"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setReceiptType(type)}
                          className={`rounded-xl border p-3 text-sm font-bold capitalize ${receiptType === type ? "border-[#315d45] bg-[#eef4eb] text-[#315d45]" : "border-[#e0e5de]"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder={
                      receiptType === "factura" ? "Razón social" : "Nombre del cliente (opcional)"
                    }
                    className="w-full rounded-xl border border-[#dce3da] px-3 py-2.5 text-sm outline-none focus:border-[#315d45]"
                  />
                  {receiptType === "factura" && (
                    <input
                      value={documentNumber}
                      onChange={(event) => setDocumentNumber(event.target.value)}
                      placeholder="RUC"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-[#dce3da] px-3 py-2.5 text-sm outline-none focus:border-[#315d45]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => void chargeAccount()}
                    disabled={saving || (receiptType === "factura" && !documentNumber.trim())}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315d45] px-4 py-3 text-sm font-black text-white hover:bg-[#244b35] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CircleDollarSign size={17} />
                    {saving ? "Registrando cobro..." : "Registrar pago y liberar mesa"}
                  </button>
                  <p className="text-xs leading-relaxed text-amber-800">
                    El pago se registra como recibido en efectivo/POS físico. El comprobante quedará
                    pendiente hasta conectar el facturador electrónico.
                  </p>
                </section>
              )}

              {isCashier && !selectedAccount && (
                <div className="rounded-2xl border border-[#e4e8e1] bg-white p-5 text-sm text-[#728073]">
                  Selecciona una mesa ocupada para revisar su cuenta y registrar el cobro.
                </div>
              )}
            </aside>
          </section>
        )}

        {!selectedTable && (
          <section className="rounded-2xl border border-dashed border-[#d3ddd2] bg-white p-8 text-center text-sm text-[#768477]">
            Selecciona una mesa para{" "}
            {isCashier ? "consultar su cuenta y cobrarla" : "tomar el pedido"}.
          </section>
        )}
      </div>

      {customizingDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#16241c]/60 p-4"
          role="presentation"
          onClick={() => setCustomizingDish(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="salon-customization-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[#758478]">
              {customizingDish.category}
            </p>
            <h2 id="salon-customization-title" className="mt-1 font-serif text-xl font-black">
              {customizingDish.dish.name}
            </h2>
            <p className="mt-1 text-sm text-[#718074]">
              Elige las opciones del plato antes de agregarlo.
            </p>
            <div className="mt-4 space-y-4">
              {customizingDish.dish.custom_options?.map((section) => (
                <fieldset key={section.id || section.title}>
                  <legend className="mb-2 text-sm font-bold">{section.title}</legend>
                  <div className="space-y-2">
                    {section.options.map((option) => {
                      const sectionId = section.id || section.title;
                      const selected = customizationSelections[sectionId] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setCustomizationSelections((current) => ({
                              ...current,
                              [sectionId]: option.id,
                            }))
                          }
                          className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm ${selected ? "border-[#315d45] bg-[#eff5ed]" : "border-[#e1e5df]"}`}
                        >
                          <span className="font-semibold">{option.name}</span>
                          {option.price !== undefined && (
                            <span className="text-xs font-bold text-[#4c6c56]">
                              {money(priceNumber(option.price))}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setCustomizingDish(null)}
                className="flex-1 rounded-xl border border-[#dce3da] p-3 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addSelectedDish}
                disabled={customizingDish.dish.custom_options?.some(
                  (section) => !customizationSelections[section.id || section.title],
                )}
                className="flex-1 rounded-xl bg-[#315d45] p-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Agregar al pedido
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function AccountDetails({ account }: { account: SalonAccount }) {
  return (
    <section className="space-y-3">
      {account.salon_tickets.map((ticket) => {
        const StationIcon = ticket.station === "bar" ? Wine : ChefHat;
        return (
          <article
            key={ticket.id}
            className="rounded-2xl border border-[#dfe5dc] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#edf0eb] pb-3">
              <div className="flex items-center gap-2">
                <StationIcon size={17} className="text-[#52705b]" />
                <h3 className="font-bold">{ticket.station === "bar" ? "Bar" : "Cocina"}</h3>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#758276]">
                <Clock3 size={13} />
                {new Date(ticket.created_at).toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#748174]">Mozo: {ticket.waiter_name}</p>
            <div className="mt-3 space-y-2">
              {ticket.salon_ticket_items.map((item) => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between gap-3">
                    <span>
                      {item.quantity} × {item.product_name}
                    </span>
                    <span className="font-semibold">
                      {money(Number(item.unit_price) * item.quantity)}
                    </span>
                  </div>
                  {Object.entries(item.customizations || {}).map(([label, value]) => (
                    <p key={label} className="mt-1 text-xs text-[#758174]">
                      {label}: {value}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            {ticket.print_status !== "printed" && (
              <p
                className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${ticket.print_status === "failed" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}
              >
                {ticket.print_status === "failed"
                  ? `Impresión pendiente: ${ticket.print_error || "no se pudo conectar con la impresora"}`
                  : "Pendiente de impresión: falta conectar el servicio de impresoras del local."}
              </p>
            )}
          </article>
        );
      })}
      <p className="flex items-center gap-2 rounded-xl bg-[#eef3eb] p-3 text-xs text-[#526a57]">
        <Utensils size={15} />
        Consulta de cuenta abierta. El pago y cierre están disponibles desde el acceso de caja.
      </p>
    </section>
  );
}
