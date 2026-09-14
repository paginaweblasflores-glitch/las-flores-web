import { useEffect, useState } from "react";
import { Download, Search, Users, Truck, Store, Calendar, CalendarRange } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";
import { getRecentMonths, formatMonthLabel, getMonthDateRange } from "../lib/monthUtils";

interface CashierClientsSectionProps {
  orders: any[];
}

type FilterMode = "day" | "month";

const getYYYYMMDD = (d?: Date | string) => {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString("sv-SE");
};

export function CashierClientsSection({ orders }: CashierClientsSectionProps) {
  const todayStr = getYYYYMMDD(new Date());
  const eligibleMonths = getRecentMonths();

  const [filterMode, setFilterMode] = useState<FilterMode>("day");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMonth, setSelectedMonth] = useState(eligibleMonths[0]?.value || "");
  const [search, setSearch] = useState("");
  const [fetchedOrders, setFetchedOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // El día de hoy ya viene cargado en memoria (prop `orders`), así que se
    // usa directo sin ir a la base de datos. Cualquier otro día, o un mes
    // completo, se consulta aparte porque `orders` solo trae los últimos 7 días.
    if (filterMode === "day" && selectedDate === todayStr) {
      setFetchedOrders(null);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    const run = async () => {
      const { start, end } =
        filterMode === "day"
          ? { start: `${selectedDate}T00:00:00`, end: `${selectedDate}T23:59:59` }
          : getMonthDateRange(selectedMonth);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setLoadError("No se pudo cargar los pedidos.");
        setFetchedOrders([]);
      } else {
        setFetchedOrders(data || []);
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [filterMode, selectedDate, selectedMonth, todayStr]);

  const baseOrders =
    filterMode === "day" && selectedDate === todayStr
      ? orders.filter((o) => getYYYYMMDD(o.created_at) === selectedDate)
      : fetchedOrders || [];

  const sorted = [...baseOrders].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  const filtered = sorted.filter((o) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (o.order_number || "").toString().toLowerCase().includes(q) ||
      (o.client_name || "").toLowerCase().includes(q) ||
      (o.client_phone || "").includes(search)
    );
  });

  const periodLabel =
    filterMode === "day"
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("es-PE", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : formatMonthLabel(selectedMonth);

  const handleExportExcel = () => {
    const rows = filtered.map((o) => ({
      "N° Orden": o.order_number || o.id?.slice(0, 8) || "",
      "Fecha/Hora": o.created_at ? new Date(o.created_at).toLocaleString("es-PE") : "",
      Cliente: o.client_name || "Cliente",
      Teléfono: o.client_phone || "",
      Modalidad: o.order_type === "delivery" ? "Delivery" : "Recojo",
      Estado: o.status || "pendiente",
      "Total (S/)": Number(o.total || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 24 },
      { wch: 14 },
      { wch: 12 },
      { wch: 14 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

    const suffix = filterMode === "day" ? selectedDate : selectedMonth;
    XLSX.writeFile(workbook, `Clientes_Las_Flores_${suffix}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
          <button
            onClick={() => setFilterMode("day")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMode === "day" ? "bg-[#2D473C] text-white shadow-sm" : "text-black/50 hover:text-black/70"
            }`}
          >
            <Calendar size={13} />
            Por Día
          </button>
          <button
            onClick={() => setFilterMode("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMode === "month" ? "bg-[#2D473C] text-white shadow-sm" : "text-black/50 hover:text-black/70"
            }`}
          >
            <CalendarRange size={13} />
            Por Mes
          </button>
        </div>

        {filterMode === "day" ? (
          <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
            <Calendar size={15} className="text-[#2D473C]" />
            <input
              type="date"
              value={selectedDate}
              max={todayStr}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#2D473C] focus:outline-none cursor-pointer"
            />
          </div>
        ) : (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer text-[#2D473C]"
          >
            {eligibleMonths.map((mo) => (
              <option key={mo.value} value={mo.value}>
                {mo.label}
              </option>
            ))}
          </select>
        )}

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por # de orden, cliente o teléfono..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D473C]"
          />
        </div>
      </div>

      {/* Tabla */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-black/60 capitalize">{periodLabel}</p>
          {loading && <p className="text-xs font-medium text-black/40">Cargando...</p>}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          {loadError ? (
            <div className="p-10 text-center text-red-600 space-y-2">
              <p className="font-medium text-sm">{loadError}</p>
            </div>
          ) : !loading && filtered.length === 0 ? (
            <div className="p-10 text-center text-black/40 space-y-2">
              <Users size={36} className="mx-auto text-black/20" />
              <p className="font-medium text-sm">No hay clientes que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2D473C] text-white font-extrabold uppercase tracking-wider text-xs">
                    <th className="p-3.5 pl-4">Orden</th>
                    <th className="p-3.5">Fecha / Hora</th>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Modalidad</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right pr-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-medium text-black/80">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-[#2D473C]/5 transition-colors">
                      <td className="p-3.5 pl-4 font-serif font-bold text-[#2D473C]">
                        #{o.order_number || o.id?.slice(0, 8)}
                      </td>
                      <td className="p-3.5 text-black/60 whitespace-nowrap">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleString("es-PE", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="p-3.5 font-bold text-black">
                        {o.client_name || "Cliente General"}
                        <span className="block text-xs text-black/50 font-normal">{o.client_phone}</span>
                      </td>
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
                      <td className="p-3.5 uppercase font-extrabold text-xs text-gray-800">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 inline-block">
                          {o.status || "pendiente"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right pr-4 font-bold text-[#2D473C]">
                        S/ {Number(o.total || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div className="text-xs text-black/60 font-medium">
          {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"} — descarga la lista en Excel.
        </div>

        <button
          onClick={handleExportExcel}
          disabled={filtered.length === 0}
          className="py-2.5 px-4 rounded-xl bg-white border border-black/20 hover:bg-black/5 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Download size={16} className="text-[#2D473C]" />
          <span>Exportar Excel</span>
        </button>
      </div>
    </div>
  );
}
