import { useState } from "react";
import { X, Download, Search, Users, Truck, Store } from "lucide-react";

interface CashierClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
}

export function CashierClientsModal({ isOpen, onClose, orders }: CashierClientsModalProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  const filtered = sorted.filter((o) => {
    const q = search.toLowerCase();
    return (
      (o.order_number || "").toString().toLowerCase().includes(q) ||
      (o.client_name || "").toLowerCase().includes(q) ||
      (o.client_phone || "").includes(search)
    );
  });

  const handleExportCSV = () => {
    const headers = ["N° Orden", "Fecha/Hora", "Cliente", "Teléfono", "Modalidad", "Estado", "Total (S/)"];

    const rows = filtered.map((o) => [
      `"${o.order_number || o.id?.slice(0, 8)}"`,
      `"${o.created_at ? new Date(o.created_at).toLocaleString("es-PE") : ""}"`,
      `"${(o.client_name || "Cliente").replace(/"/g, '""')}"`,
      `"${o.client_phone || ""}"`,
      `"${o.order_type === "delivery" ? "Delivery" : "Recojo"}"`,
      `"${o.status || "pendiente"}"`,
      Number(o.total || 0).toFixed(2),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,﻿" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Clientes_Las_Flores_${new Date().toLocaleDateString("sv-SE")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-[#2c4a3e]/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-[#fbf5e6] w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-[#2c4a3e]/20 flex flex-col overflow-hidden"
      >
        {/* Encabezado */}
        <div className="bg-[#2c4a3e] text-white p-5 px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/40">
              <Users size={22} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight tracking-wide text-[#fbf5e6]">
                Clientes y Pedidos
              </h2>
              <p className="text-xs text-white/70">
                Historial de comandas para consulta y exportación
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Búsqueda */}
        <div className="p-4 px-6 bg-white border-b border-black/10">
          <div className="relative w-full sm:w-80">
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-black/40 space-y-2">
                <Users size={36} className="mx-auto text-black/20" />
                <p className="font-medium text-sm">No hay clientes que coincidan con la búsqueda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#2c4a3e] text-white font-extrabold uppercase tracking-wider text-xs">
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
                      <tr key={o.id} className="hover:bg-[#2c4a3e]/5 transition-colors">
                        <td className="p-3.5 pl-4 font-serif font-bold text-[#2c4a3e]">
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
                        <td className="p-3.5 text-right pr-4 font-bold text-[#2c4a3e]">
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
        <div className="p-4 px-6 bg-white border-t border-black/10 flex items-center justify-between">
          <div className="text-xs text-black/60 font-medium">
            {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"} — descarga la lista en Excel/CSV.
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="py-2.5 px-4 rounded-xl bg-white border border-black/20 hover:bg-black/5 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download size={16} className="text-[#2c4a3e]" />
            <span>Exportar Excel (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
