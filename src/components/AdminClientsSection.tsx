import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Search, Users, RefreshCw, AlertCircle, Mail, Phone, Calendar } from "lucide-react";
import { TablePagination } from "./TablePagination";

interface ClientProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export function AdminClientsSection() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchClients = async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, created_at")
        .eq("role", "client")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error("Error al cargar clientes:", err);
      setError("No se pudieron cargar los clientes registrados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();

    const channel = supabase
      .channel("admin-clients-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchClients(true))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (c.full_name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(search)
    );
  });

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const paginatedClients = filteredClients.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 flex items-center justify-between">
        <div>
          <h3 className="font-serif font-black text-lg text-[#2D473C]">Clientes Registrados</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Cuentas creadas por clientes al iniciar sesión (Google, Facebook o correo) — un registro único por cliente, creado la primera vez que inician sesión.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
            Total: {clients.length}
          </span>
          <button
            onClick={() => fetchClients()}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-[#2D473C]" : ""} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D473C]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <RefreshCw size={28} className="animate-spin mx-auto text-[#2D473C]" />
            <p className="text-sm font-bold text-gray-600">Cargando clientes registrados...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 space-y-2">
            <AlertCircle size={32} className="mx-auto" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Users size={36} className="mx-auto text-gray-300" />
            <p className="font-bold text-sm text-gray-700">
              {search ? "No hay clientes que coincidan con la búsqueda." : "Todavía no hay clientes registrados."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2D473C] text-white uppercase text-xs font-black tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Correo</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedClients.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#2D473C]/10 text-[#2D473C] flex items-center justify-center font-black text-xs shrink-0">
                          {(c.full_name || c.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900">{c.full_name || "Sin nombre"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        {c.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {c.phone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          {c.phone}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        {new Date(c.created_at).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredClients.length > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={filteredClients.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
