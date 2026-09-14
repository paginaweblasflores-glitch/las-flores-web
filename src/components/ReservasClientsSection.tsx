import { useEffect, useState } from "react";
import { Download, Search, Users, Calendar, CalendarRange, CalendarClock } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";
import { getRecentMonths, formatMonthLabel, getMonthDateRange } from "../lib/monthUtils";
import { TablePagination } from "./TablePagination";

interface ReservasClientsSectionProps {
  reservations: any[];
}

type FilterMode = "hoy" | "dia" | "mes";

const getYYYYMMDD = (d?: Date | string) => {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString("sv-SE");
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  pendiente: "Pendiente",
  confirmed: "Confirmada",
  confirmada: "Confirmada",
  completed: "Cliente Llegó",
  completada: "Cliente Llegó",
  asistio: "Cliente Llegó",
  cancelled: "Cancelada",
  cancelada: "Cancelada",
};

export function ReservasClientsSection({ reservations }: ReservasClientsSectionProps) {
  const todayStr = getYYYYMMDD(new Date());
  const eligibleMonths = getRecentMonths();

  const [filterMode, setFilterMode] = useState<FilterMode>("hoy");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMonth, setSelectedMonth] = useState(eligibleMonths[0]?.value || "");
  const [search, setSearch] = useState("");
  const [fetchedReservations, setFetchedReservations] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getMonthDateRangeAsDate = (monthStr: string) => {
    const { start, end } = getMonthDateRange(monthStr);
    return { start: start.slice(0, 10), end: end.slice(0, 10) };
  };

  useEffect(() => {
    // "Hoy", y "Por Día" cuando la fecha elegida es hoy, ya están en memoria
    // (últimas reservas cargadas). Cualquier otro día o un mes completo se
    // consulta aparte porque `reservations` solo trae lo creado en los
    // últimos 7 días — no cubre fechas de reserva fuera de esa ventana.
    if (filterMode === "hoy" || (filterMode === "dia" && selectedDate === todayStr)) {
      setFetchedReservations(null);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    const run = async () => {
      const { start, end } =
        filterMode === "dia"
          ? { start: selectedDate, end: selectedDate }
          : getMonthDateRangeAsDate(selectedMonth);

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .gte("reservation_date", start)
        .lte("reservation_date", end)
        .order("reservation_date", { ascending: false });

      if (cancelled) return;
      if (error) {
        setLoadError("No se pudo cargar las reservas.");
        setFetchedReservations([]);
      } else {
        setFetchedReservations(data || []);
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [filterMode, selectedDate, selectedMonth, todayStr]);

  const baseReservations =
    filterMode === "hoy"
      ? reservations.filter((r) => r.reservation_date === todayStr)
      : filterMode === "dia" && selectedDate === todayStr
      ? reservations.filter((r) => r.reservation_date === selectedDate)
      : fetchedReservations || [];

  const sorted = [...baseReservations].sort((a, b) => {
    const dateCmp = (b.reservation_date || "").localeCompare(a.reservation_date || "");
    if (dateCmp !== 0) return dateCmp;
    return (b.reservation_time || "").localeCompare(a.reservation_time || "");
  });

  const filtered = sorted.filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (r.client_name || "").toLowerCase().includes(q) ||
      (r.client_phone || "").includes(search)
    );
  });

  useEffect(() => {
    setPage(1);
  }, [filterMode, selectedDate, selectedMonth, search, pageSize]);

  const totalFiltered = filtered.length;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const periodLabel =
    filterMode === "hoy"
      ? "Hoy — " +
        new Date(`${todayStr}T00:00:00`).toLocaleDateString("es-PE", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : filterMode === "dia"
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("es-PE", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : formatMonthLabel(selectedMonth);

  const handleExportExcel = () => {
    const rows = filtered.map((r) => ({
      Cliente: r.client_name || "Cliente",
      Teléfono: r.client_phone || "",
      Email: r.client_email || "",
      Fecha: r.reservation_date || "",
      Hora: r.reservation_time || "",
      Servicio: (r.service_type || "almuerzo").toUpperCase(),
      Personas: Number(r.guest_count || 1),
      "Mesa/Sector": r.table_number || r.zone_id || "",
      Estado: STATUS_LABELS[(r.status || "pending").toLowerCase().trim()] || "Pendiente",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 24 },
      { wch: 14 },
      { wch: 24 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 10 },
      { wch: 14 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");

    const suffix = filterMode === "hoy" ? todayStr : filterMode === "dia" ? selectedDate : selectedMonth;
    XLSX.writeFile(workbook, `Reservas_Las_Flores_${suffix}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
          <button
            onClick={() => setFilterMode("hoy")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMode === "hoy" ? "bg-[#2D473C] text-white shadow-sm" : "text-black/50 hover:text-black/70"
            }`}
          >
            <CalendarClock size={13} />
            Hoy
          </button>
          <button
            onClick={() => setFilterMode("dia")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMode === "dia" ? "bg-[#2D473C] text-white shadow-sm" : "text-black/50 hover:text-black/70"
            }`}
          >
            <Calendar size={13} />
            Por Día
          </button>
          <button
            onClick={() => setFilterMode("mes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMode === "mes" ? "bg-[#2D473C] text-white shadow-sm" : "text-black/50 hover:text-black/70"
            }`}
          >
            <CalendarRange size={13} />
            Por Mes
          </button>
        </div>

        {filterMode === "dia" && (
          <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
            <Calendar size={15} className="text-[#2D473C]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#2D473C] focus:outline-none cursor-pointer"
            />
          </div>
        )}

        {filterMode === "mes" && (
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
            placeholder="Buscar cliente o teléfono..."
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
              <p className="font-medium text-sm">No hay reservas que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2D473C] text-white font-extrabold uppercase tracking-wider text-xs">
                    <th className="p-3.5 pl-4">Cliente</th>
                    <th className="p-3.5">Fecha / Hora</th>
                    <th className="p-3.5">Servicio</th>
                    <th className="p-3.5">Personas</th>
                    <th className="p-3.5">Mesa/Sector</th>
                    <th className="p-3.5 pr-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-medium text-black/80">
                  {paginated.map((r) => {
                    const statusKey = (r.status || "pending").toLowerCase().trim();
                    return (
                      <tr key={r.id} className="hover:bg-[#2D473C]/5 transition-colors">
                        <td className="p-3.5 pl-4 font-bold text-black">
                          {r.client_name || "Cliente"}
                          <span className="block text-xs text-black/50 font-normal">{r.client_phone}</span>
                        </td>
                        <td className="p-3.5 text-black/60 whitespace-nowrap">
                          {r.reservation_date || "-"} {r.reservation_time || ""}
                        </td>
                        <td className="p-3.5 uppercase font-bold text-black/70">
                          {(r.service_type || "almuerzo").toUpperCase()}
                        </td>
                        <td className="p-3.5">{r.guest_count || 1}</td>
                        <td className="p-3.5 text-black/70">{r.table_number || r.zone_id || "-"}</td>
                        <td className="p-3.5 pr-4 uppercase font-extrabold text-xs text-gray-800">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 inline-block">
                            {STATUS_LABELS[statusKey] || "Pendiente"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalFiltered > 0 && (
          <div className="mt-3">
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={totalFiltered}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div className="text-xs text-black/60 font-medium">
          {filtered.length} {filtered.length === 1 ? "reserva" : "reservas"} — descarga la lista en Excel.
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
