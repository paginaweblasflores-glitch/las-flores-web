import { useEffect, useRef, useState } from "react";
import {
  X,
  Printer,
  Lock,
  Banknote,
  CreditCard,
  Truck,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Store,
} from "lucide-react";
import { isCancelledStatus } from "../lib/orderStatus";
import { supabase } from "../lib/supabase";

interface CashierAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
}

interface MonthlyClosure {
  month: string;
  total_online: number;
  total_delivery_fees: number;
  total_net: number;
  order_count: number;
}

const getYYYYMMDD = (d?: Date | string) => {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString("sv-SE");
};

// Últimos 12 meses ya cerrados (sin incluir el mes en curso, que aún no terminó)
const getEligibleClosureMonths = () => {
  const months: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    months.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return months;
};

const formatMonthLabel = (monthStr: string) => {
  const [y, m] = monthStr.split("-").map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString("es-PE", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export function CashierAuditModal({ isOpen, onClose, orders }: CashierAuditModalProps) {
  const todayStr = getYYYYMMDD(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const eligibleMonths = getEligibleClosureMonths();
  const [printMode, setPrintMode] = useState<"daily" | "monthly">("daily");
  const [monthlyPopoverOpen, setMonthlyPopoverOpen] = useState(false);
  const [selectedClosureMonth, setSelectedClosureMonth] = useState(eligibleMonths[0]?.value || "");
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);
  const [monthlyClosure, setMonthlyClosure] = useState<MonthlyClosure | null>(null);
  const monthlyPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (monthlyPopoverRef.current && !monthlyPopoverRef.current.contains(e.target as Node)) {
        setMonthlyPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filtrar órdenes por la fecha seleccionada
  const filteredOrders = orders.filter((o) => {
    if (!o.created_at) return false;
    const orderDate = getYYYYMMDD(o.created_at);
    return orderDate === selectedDate && !isCancelledStatus(o.status);
  });

  // Cálculos de montos
  let totalCash = 0;
  let totalOnline = 0;
  let totalDeliveryFees = 0;
  let totalDiscounts = 0;
  let countDelivery = 0;
  let countPickup = 0;

  filteredOrders.forEach((o) => {
    const total = Number(o.total || 0);
    const fee = Number(o.delivery_fee || 0);
    const discount = Number(o.discount_amount || o.discount || 0);
    const pm = (o.payment_method || "").toLowerCase().trim();
    const isCash = pm.includes("efectivo") || pm.includes("cash");
    const isCulqi = pm === "culqi";

    if (isCash) {
      totalCash += total;
    } else {
      totalOnline += total; // Incluye Yape, Plin, Culqi y otros pagos digitales
    }

    totalDeliveryFees += fee;
    totalDiscounts += discount;

    const isDelivery = (o.order_type || "delivery").toLowerCase().includes("delivery");
    if (isDelivery) countDelivery++;
    else countPickup++;
  });

  const totalSales = totalCash + totalOnline;

  // Busca el cierre mensual ya guardado; si no existe, lo calcula UNA VEZ desde
  // las órdenes reales de ese mes y lo graba. De ahí en adelante siempre se lee
  // el mismo registro — nunca se recalcula ni se puede editar desde la app.
  const getOrCreateMonthlyClosure = async (monthStr: string): Promise<MonthlyClosure> => {
    const { data: existing, error: selErr } = await supabase
      .from("monthly_cash_closures")
      .select("month, total_online, total_delivery_fees, total_net, order_count")
      .eq("month", monthStr)
      .maybeSingle();

    if (selErr) throw selErr;
    if (existing) return existing as MonthlyClosure;

    const [y, m] = monthStr.split("-").map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const startDate = `${monthStr}-01T00:00:00`;
    const endDate = `${monthStr}-${String(lastDay).padStart(2, "0")}T23:59:59`;

    const { data: monthOrders, error: ordErr } = await supabase
      .from("orders")
      .select("total, delivery_fee, payment_method, status")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (ordErr) throw ordErr;

    let cash = 0;
    let online = 0;
    let fees = 0;
    let count = 0;

    (monthOrders || []).forEach((o: any) => {
      if (isCancelledStatus(o.status)) return;
      const total = Number(o.total || 0);
      const pm = (o.payment_method || "").toLowerCase().trim();
      const isCash = pm.includes("efectivo") || pm.includes("cash");
      if (isCash) cash += total;
      else online += total;
      fees += Number(o.delivery_fee || 0);
      count++;
    });

    const payload = {
      month: monthStr,
      total_online: online,
      total_delivery_fees: fees,
      total_net: cash + online,
      order_count: count,
    };

    const { data: inserted, error: insErr } = await supabase
      .from("monthly_cash_closures")
      .insert(payload)
      .select("month, total_online, total_delivery_fees, total_net, order_count")
      .single();

    if (insErr) {
      // Carrera: otra sesión insertó el mismo mes justo antes. Se relee el
      // registro ya grabado en vez de fallar.
      const { data: raceExisting } = await supabase
        .from("monthly_cash_closures")
        .select("month, total_online, total_delivery_fees, total_net, order_count")
        .eq("month", monthStr)
        .maybeSingle();
      if (raceExisting) return raceExisting as MonthlyClosure;
      throw insErr;
    }

    return inserted as MonthlyClosure;
  };

  const handlePrintMonthly = async () => {
    setMonthlyError(null);
    setMonthlyLoading(true);
    try {
      const closure = await getOrCreateMonthlyClosure(selectedClosureMonth);
      setMonthlyClosure(closure);
      setPrintMode("monthly");
      setMonthlyPopoverOpen(false);
      requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    } catch (err: any) {
      setMonthlyError(err?.message || "No se pudo generar el cierre mensual.");
    } finally {
      setMonthlyLoading(false);
    }
  };

  // Función para imprimir reporte
  const handlePrint = () => {
    setPrintMode("daily");
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };

  return (
    <div id="cashier-audit-print-area" className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Tamaño de página para impresora de ticketera (80mm), no A4/Carta.
          El resto de la app (Kanban, botones de fondo) también vive en el
          documento, así que hay que ocultarlo explícitamente: no basta con
          "print:hidden" dentro del propio modal. */}
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 3mm; }
          html, body { width: 80mm; }
          body * { visibility: hidden !important; }
          #cashier-audit-print-area, #cashier-audit-print-area * { visibility: visible !important; }
          /* Mantiene "fixed" (para no heredar el espacio en blanco que dejan
             los elementos ocultos con visibility:hidden en el flujo normal),
             pero alineado arriba a la izquierda en vez de centrado. */
          #cashier-audit-print-area {
            position: fixed !important;
            inset: 0 !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            padding: 0 !important;
          }
          /* La tarjeta del modal pierde fondo/sombra/bordes: solo queda el ticket */
          #cashier-audit-card {
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: none !important;
            max-height: none !important;
            width: auto !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2c4a3e]/80 backdrop-blur-md cursor-pointer print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="cashier-audit-card"
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-[#fbf5e6] w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-[#2c4a3e]/20 flex flex-col overflow-hidden"
      >
        {/* Encabezado del Modal */}
        <div className="bg-[#2c4a3e] text-white p-5 px-6 flex items-center justify-between shadow-md print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/40">
              <TrendingUp size={22} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight tracking-wide text-[#fbf5e6]">
                Arqueo y Cierre de Caja
              </h2>
              <p className="text-xs text-white/70">
                Resumen contable y rendimiento diario de comandas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filtro de Fecha */}
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
              <Calendar size={15} className="text-[#d4af37]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cierre / Arqueo — Contenido Imprimible */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
          {/* Tarjetas de KPI (no se imprimen: la versión de ticketera de abajo ya resume esto) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            {/* Total Efectivo a Rendir */}
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-black/50 tracking-wider">
                  Efectivo a Rendir
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
                  <Banknote size={18} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-serif font-extrabold text-emerald-800 block">
                  S/ {totalCash.toFixed(2)}
                </span>
                <span className="text-xs text-black/50 font-medium">
                  Cobrado en efectivo por motorizados
                </span>
              </div>
            </div>

            {/* Total Pagado Online */}
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-black/50 tracking-wider">
                  Cobrado Online
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/60">
                  <CreditCard size={18} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-serif font-extrabold text-purple-800 block">
                  S/ {totalOnline.toFixed(2)}
                </span>
                <span className="text-xs text-black/50 font-medium">
                  Yape, Plin y Tarjeta de Crédito
                </span>
              </div>
            </div>

            {/* Total Comisiones Delivery */}
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-black/50 tracking-wider">
                  Fletes Delivery
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60">
                  <Truck size={18} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-serif font-extrabold text-blue-800 block">
                  S/ {totalDeliveryFees.toFixed(2)}
                </span>
                <span className="text-xs text-black/50 font-medium">
                  Suma total de costos de envío
                </span>
              </div>
            </div>

            {/* Venta Total Bruta */}
            <div className="bg-[#2c4a3e] text-white p-5 rounded-2xl border border-[#2c4a3e] shadow-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-[#d4af37] tracking-wider">
                  Venta Total Neto
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center border border-[#d4af37]/40">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-serif font-extrabold text-[#fbf5e6] block">
                  S/ {totalSales.toFixed(2)}
                </span>
                <span className="text-xs text-white/70 font-medium">
                  {filteredOrders.length} comandas ({countDelivery} delivery / {countPickup} recojo)
                </span>
              </div>
            </div>
          </div>

          {/* Tabla de Detalle de Comandas (no se imprime, ver ticket compacto abajo) */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden print:hidden">
            <div className="p-4 bg-black/3 border-b border-black/10 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#2c4a3e] flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#2c4a3e]" />
                <span>Detalle de Comandas ({filteredOrders.length})</span>
              </h3>
              <span className="text-xs text-black/50 font-medium">
                Fecha: <strong>{selectedDate}</strong>
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center text-black/40 space-y-2">
                <Calendar size={36} className="mx-auto text-black/20" />
                <p className="font-medium text-sm">No hay comandas registradas para el {selectedDate}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#2c4a3e]/5 text-[#2c4a3e] font-extrabold uppercase tracking-wider text-xs border-b border-black/10">
                      <th className="p-3.5 pl-4">Orden</th>
                      <th className="p-3.5">Hora</th>
                      <th className="p-3.5">Cliente</th>
                      <th className="p-3.5">Tipo</th>
                      <th className="p-3.5">Método Pago</th>
                      <th className="p-3.5 text-right">Subtotal</th>
                      <th className="p-3.5 text-right">Envío</th>
                      <th className="p-3.5 text-right pr-4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 font-medium text-black/80">
                    {filteredOrders.map((o) => {
                      const pm = (o.payment_method || "").toLowerCase().trim();
                      const isCash = pm.includes("efectivo") || pm.includes("cash");
                      const createdTime = new Date(o.created_at).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={o.id} className="hover:bg-[#2c4a3e]/5 transition-colors">
                          <td className="p-3.5 pl-4 font-serif font-bold text-[#2c4a3e]">
                            #{o.order_number || o.id?.slice(0, 8)}
                          </td>
                          <td className="p-3.5 text-black/60">{createdTime}</td>
                          <td className="p-3.5 font-bold text-black">{o.client_name || "Cliente"}</td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
                                o.order_type === "delivery"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/80"
                              }`}
                            >
                              {o.order_type === "delivery" ? (
                                <>
                                  <Truck size={12} /> Delivery
                                </>
                              ) : (
                                <>
                                  <Store size={12} /> Recojo
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
                                isCash
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                                  : "bg-purple-50 text-purple-800 border border-purple-200/80"
                              }`}
                            >
                              {isCash ? (
                                <>
                                  <Banknote size={12} /> EFECTIVO
                                </>
                              ) : (
                                <>
                                  <CreditCard size={12} /> ONLINE
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-3.5 text-right text-black/70">
                            S/ {Number(o.subtotal || 0).toFixed(2)}
                          </td>
                          <td className="p-3.5 text-right text-black/70">
                            S/ {Number(o.delivery_fee || 0).toFixed(2)}
                          </td>
                          <td className="p-3.5 text-right pr-4 font-bold text-[#2c4a3e]">
                            S/ {Number(o.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Ticket compacto del día — lo único que se imprime, en ancho de ticketera */}
          {printMode === "daily" && (
            <div className="hidden print:block font-mono font-bold text-[11px] leading-snug text-black w-[72mm]">
              <p className="text-center">RESTAURANTE LAS FLORES</p>
              <p className="text-center">Delivery de la Página Web</p>
              <p className="text-center">Arqueo y Cierre de Caja</p>
              <p className="text-center mb-2">Fecha: {selectedDate}</p>
              <div className="border-t border-black my-1" />
              <div className="flex justify-between"><span>Efectivo a rendir</span><span>S/ {totalCash.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Cobrado online</span><span>S/ {totalOnline.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Fletes delivery</span><span>S/ {totalDeliveryFees.toFixed(2)}</span></div>
              <div className="border-t border-black my-1" />
              <div className="flex justify-between"><span>VENTA TOTAL NETO</span><span>S/ {totalSales.toFixed(2)}</span></div>
              <p>{countDelivery} delivery / {countPickup} recojo</p>
              <div className="border-t border-black my-1" />
              <p>Detalle de Delivery</p>
              {filteredOrders.map((o) => {
                const createdTime = new Date(o.created_at).toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={o.id} className="flex justify-between">
                    <span>#{o.order_number || o.id?.slice(0, 8)} {createdTime}</span>
                    <span>S/ {Number(o.total || 0).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="border-t border-black my-1" />
            </div>
          )}

          {/* Ticket compacto del cierre mensual (grabado en la BD, inmutable) */}
          {printMode === "monthly" && monthlyClosure && (
            <div className="hidden print:block font-mono font-bold text-[11px] leading-snug text-black w-[72mm]">
              <p className="text-center">RESTAURANTE LAS FLORES</p>
              <p className="text-center">Delivery de la Página Web</p>
              <p className="text-center">Cierre Mensual</p>
              <p className="text-center mb-2">Mes: {formatMonthLabel(monthlyClosure.month)}</p>
              <div className="border-t border-black my-1" />
              <div className="flex justify-between"><span>Cobrado online</span><span>S/ {Number(monthlyClosure.total_online).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Fletes delivery</span><span>S/ {Number(monthlyClosure.total_delivery_fees).toFixed(2)}</span></div>
              <div className="border-t border-black my-1" />
              <div className="flex justify-between"><span>VENTA TOTAL NETO</span><span>S/ {Number(monthlyClosure.total_net).toFixed(2)}</span></div>
              <p>{monthlyClosure.order_count} comandas del mes</p>
              <div className="border-t border-black my-1" />
            </div>
          )}
        </div>

        {/* Acciones de Footer del Modal */}
        <div className="p-4 px-6 bg-white border-t border-black/10 flex items-center justify-between print:hidden">
          <div className="text-xs text-black/60 font-medium">
            Imprime el ticket del día o el cierre mensual (una sola vez, no editable).
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={monthlyPopoverRef}>
              <button
                onClick={() => setMonthlyPopoverOpen((v) => !v)}
                className="py-2.5 px-4 rounded-xl bg-white border border-black/20 hover:bg-black/5 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Lock size={16} className="text-[#2c4a3e]" />
                <span>Cierre Mensual</span>
              </button>

              {monthlyPopoverOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-black/10 p-4 space-y-3 z-20">
                  <p className="text-xs font-bold text-black/70 leading-relaxed">
                    Imprime lo cobrado online, los fletes y la venta neta de un mes ya cerrado.
                    Se calcula y se graba una sola vez: no se puede editar después.
                  </p>
                  <select
                    value={selectedClosureMonth}
                    onChange={(e) => setSelectedClosureMonth(e.target.value)}
                    className="w-full text-xs font-bold border border-black/20 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    {eligibleMonths.map((mo) => (
                      <option key={mo.value} value={mo.value}>{mo.label}</option>
                    ))}
                  </select>
                  {monthlyError && (
                    <p className="text-xs text-red-600 font-bold">{monthlyError}</p>
                  )}
                  <button
                    onClick={handlePrintMonthly}
                    disabled={monthlyLoading}
                    className="w-full py-2.5 rounded-xl bg-[#2c4a3e] hover:bg-[#2c4a3e]/90 text-[#fbf5e6] font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Printer size={15} className="text-[#d4af37]" />
                    <span>{monthlyLoading ? "Generando…" : "Imprimir Cierre de Mes"}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              disabled={filteredOrders.length === 0}
              className="py-2.5 px-5 rounded-xl bg-[#2c4a3e] hover:bg-[#2c4a3e]/90 text-[#fbf5e6] font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Printer size={16} className="text-[#d4af37]" />
              <span>Imprimir Ticket de Cierre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
