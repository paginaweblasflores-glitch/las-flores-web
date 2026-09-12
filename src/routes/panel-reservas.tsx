import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase, signOut } from "../lib/supabase";
import { playOrderChime } from "../utils/audioAlert";
import { CashierReservationCard } from "../components/CashierReservationCard";
import { StatCard } from "../components/StatCard";
import {
  Search,
  RefreshCw,
  Calendar,
  X,
  Volume2,
  BellOff,
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle2,
  History,
} from "lucide-react";

const getLocalYYYYMMDD = (d?: Date | string) => {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString("sv-SE");
};

export const Route = createFileRoute("/panel-reservas")({
  head: () => ({
    meta: [
      { title: "Panel de Reservas | Restaurante Las Flores" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PanelReservasRoute,
});

function PanelReservasRoute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>("today");
  const [resDateFrom, setResDateFrom] = useState<string>("");
  const [resDateTo, setResDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const setQuickDateRange = (type: "today" | "week" | "month" | "all") => {
    const today = new Date();
    const todayStr = getLocalYYYYMMDD(today);

    if (type === "today") {
      setResDateFrom(todayStr);
      setResDateTo(todayStr);
    } else if (type === "week") {
      const day = today.getDay();
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(today.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      setResDateFrom(getLocalYYYYMMDD(monday));
      setResDateTo(getLocalYYYYMMDD(sunday));
    } else if (type === "month") {
      const year = today.getFullYear();
      const month = today.getMonth();
      const lastDay = new Date(year, month + 1, 0);
      const fMonth = String(month + 1).padStart(2, "0");
      const lDay = String(lastDay.getDate()).padStart(2, "0");
      setResDateFrom(`${year}-${fMonth}-01`);
      setResDateTo(`${year}-${fMonth}-${lDay}`);
    } else if (type === "all") {
      setResDateFrom("");
      setResDateTo("");
    }
  };

  // Toast de notificaciones (máx. 2 visibles)
  interface NotificationItem {
    id: string;
    entityId: string;
    title: string;
    subtitle: string;
    detail: string;
  }
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const addNotification = (notif: Omit<NotificationItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    if (soundEnabledRef.current) playOrderChime();

    setNotifications((prev) => {
      if (prev.some((n) => n.entityId === notif.entityId)) return prev;
      return [{ ...notif, id }, ...prev.slice(0, 1)];
    });

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 7000);
  };

  const checkAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate({ to: "/staff-login" });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role?.toLowerCase();
      if (profileError || (userRole !== "admin" && userRole !== "ventas")) {
        console.warn("Acceso denegado al panel de reservas. Rol insuficiente:", userRole);
        navigate({ to: "/staff-login" });
        return;
      }

      setIsAdmin(userRole === "admin");
      setIsAuthorized(true);
      await fetchData();
    } catch (err) {
      console.error("Error al comprobar permisos del panel de reservas:", err);
      navigate({ to: "/staff-login" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/staff-login";
  };

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateFilter = sevenDaysAgo.toISOString();

      const { data: resData, error: resErr } = await supabase
        .from("reservations")
        .select("*")
        .gte("created_at", dateFilter)
        .order("reservation_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);

      if (!resErr && resData) {
        const todayStr = getLocalYYYYMMDD(new Date());
        const pastUnfulfilled = resData.filter(
          (res) =>
            (res.status === "pending" || res.status === "confirmed") &&
            res.reservation_date &&
            res.reservation_date < todayStr
        );

        if (pastUnfulfilled.length > 0) {
          pastUnfulfilled.forEach((res) => {
            supabase.from("reservations").update({ status: "cancelled" }).eq("id", res.id).then();
          });
        }

        const updatedResData = resData.map((res) =>
          pastUnfulfilled.some((p) => p.id === res.id) ? { ...res, status: "cancelled" } : res
        );

        setReservations((prev) => {
          if (prev.length > 0 && updatedResData.length > prev.length) {
            const prevIds = new Set(prev.map((r: any) => r.id));
            const newRes = updatedResData.filter((r: any) => !prevIds.has(r.id));
            newRes.forEach((newest: any) => {
              addNotification({
                entityId: newest.id,
                title: "¡NUEVA RESERVA DE MESA!",
                subtitle: newest.client_name || "Cliente Reserva",
                detail: `${newest.reservation_date || "Fecha"} • ${newest.reservation_time || ""} • ${newest.guest_count || 1} pers.`,
              });
            });
          }
          return updatedResData;
        });
      }
    } catch (err) {
      console.error("Error al obtener reservas:", err);
    } finally {
      setLoading(false);
      if (!isSilent) setRefreshing(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("panel-reservas-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const n = payload.new as any;
            addNotification({
              entityId: n.id,
              title: "¡NUEVA RESERVA DE MESA!",
              subtitle: n.client_name || "Cliente Reserva",
              detail: `${n.reservation_date || "Fecha"} • ${n.reservation_time || ""} • ${n.guest_count || 1} pers.`,
            });
          }
          fetchData(true);
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", reservationId);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error("Error updating reservation status:", err);
      alert(`No se pudo actualizar el estado de la reserva: ${err?.message || "Revisa la política RLS."}`);
    }
  };

  const todayStr = getLocalYYYYMMDD(new Date());

  const filteredReservations = reservations.filter((res) => {
    const matchSearch =
      (res.client_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.client_phone || "").includes(searchQuery) ||
      (res.reservation_date || "").includes(searchQuery);

    const resStatus = (res.status || "pending").toLowerCase().trim();
    const isCancelled = resStatus === "cancelled" || resStatus === "cancelada";

    let matchStatus = true;
    if (reservationStatusFilter === "today") {
      matchStatus = res.reservation_date === todayStr && !isCancelled;
    } else if (reservationStatusFilter === "pendiente") {
      matchStatus = resStatus === "pending" || resStatus === "pendiente";
    } else if (reservationStatusFilter === "confirmada") {
      matchStatus = resStatus === "confirmed" || resStatus === "confirmada";
    } else if (reservationStatusFilter === "completed") {
      matchStatus = resStatus === "completed" || resStatus === "completada" || resStatus === "asistio";
    }

    const matchDateRange =
      (!resDateFrom || res.reservation_date >= resDateFrom) &&
      (!resDateTo || res.reservation_date <= resDateTo);

    return matchSearch && matchStatus && matchDateRange;
  });

  const todayReservationsCount = reservations.filter((r) => {
    const s = (r.status || "").toLowerCase();
    return r.reservation_date === todayStr && s !== "cancelled" && s !== "cancelada";
  }).length;
  const pendingReservationsCount = reservations.filter((r) => {
    const s = (r.status || "pending").toLowerCase();
    return s === "pending" || s === "pendiente";
  }).length;
  const confirmedReservationsCount = reservations.filter((r) => {
    const s = (r.status || "").toLowerCase();
    return s === "confirmed" || s === "confirmada";
  }).length;

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F9F8F3] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <RefreshCw size={32} className="animate-spin text-[#2D473C] mx-auto" />
          <p className="text-sm font-bold text-gray-700">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doc-legible min-h-screen bg-[#F9F8F3] text-[#231A14] pb-20 font-sans selection:bg-[#D4AF37] selection:text-[#2D473C]">

      {/* Toast de notificaciones */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto p-4 rounded-2xl shadow-2xl border-2 flex items-center gap-3.5 animate-in slide-in-from-top-4 duration-300 bg-[#17382B] text-white border-[#10B981]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 animate-bounce">
              <Calendar size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-sans font-black uppercase tracking-wider block text-emerald-300">
                {notif.title}
              </span>
              <h4 className="font-serif font-black text-sm text-white truncate">{notif.subtitle}</h4>
              <p className="text-xs text-gray-300 truncate font-medium mt-0.5">{notif.detail}</p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 shrink-0 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Header */}
        <header className="bg-[#2D473C] text-[#F9F8F3] rounded-2xl border border-[#D4AF37]/40 shadow-lg p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border-2 border-[#D4AF37] shadow-md shrink-0">
              <img src="/favicon.png" alt="Las Flores" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Panel de Reservas
                <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  TIEMPO REAL
                </span>
              </h1>
              <p className="text-xs text-emerald-100/80 font-serif italic mt-0.5">
                Restaurante Las Flores — Gestión de Reservas de Mesas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playOrderChime();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition-all shadow-2xs ${
                soundEnabled
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30"
                  : "bg-red-500/20 text-red-200 border-red-500/40 hover:bg-red-500/30"
              }`}
            >
              {soundEnabled ? <Volume2 size={16} className="text-emerald-300" /> : <BellOff size={16} className="text-red-300" />}
              <span>{soundEnabled ? "Alerta Sonora Activa" : "Alerta Silenciada"}</span>
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-2 transition-colors border border-white/20 shadow-2xs"
              >
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span>Volver a Admin</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-extrabold flex items-center gap-2 transition-colors border border-red-500/40 shadow-2xs cursor-pointer"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={Calendar}
            accent="eucalipto"
            label="Reservas del Día"
            value={todayReservationsCount}
            sublabel="Programadas para HOY"
            badge="Hoy"
            active={reservationStatusFilter === "today"}
            onClick={() => setReservationStatusFilter("today")}
          />

          <StatCard
            icon={Clock}
            accent="chilca"
            label="Pendientes"
            value={pendingReservationsCount}
            sublabel="Por confirmar WhatsApp"
            badge="Por Confirmar"
            active={reservationStatusFilter === "pendiente"}
            onClick={() => setReservationStatusFilter("pendiente")}
          />

          <StatCard
            icon={CheckCircle2}
            accent="cielo"
            label="Confirmadas"
            value={confirmedReservationsCount}
            sublabel="Listas para recibir"
            badge="Confirmado"
            active={reservationStatusFilter === "confirmada"}
            onClick={() => {
              setReservationStatusFilter("confirmada");
              if (!resDateFrom && !resDateTo) setQuickDateRange("month");
            }}
          />

          <StatCard
            icon={History}
            accent="pacay"
            label="Todas / Historial"
            value={reservations.length}
            sublabel="Total de reservas"
            badge="Total"
            active={reservationStatusFilter === "all"}
            onClick={() => {
              setReservationStatusFilter("all");
              if (!resDateFrom && !resDateTo) setQuickDateRange("month");
            }}
          />
        </div>

        {/* Búsqueda y filtro de fechas */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente o teléfono..."
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D473C]"
              />
            </div>

            {(reservationStatusFilter === "all" || reservationStatusFilter === "confirmada") && (
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-serif font-bold text-gray-500 uppercase">Desde:</span>
                  <input
                    type="date"
                    value={resDateFrom}
                    onChange={(e) => setResDateFrom(e.target.value)}
                    className="text-xs bg-transparent font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-serif font-bold text-gray-500 uppercase">Hasta:</span>
                  <input
                    type="date"
                    value={resDateTo}
                    onChange={(e) => setResDateTo(e.target.value)}
                    className="text-xs bg-transparent font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => fetchData()}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0 w-full lg:w-auto justify-center"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-[#2D473C]" : ""} />
              <span>Actualizar Datos</span>
            </button>
          </div>
        </div>

        {/* Grilla de reservas */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw size={28} className="animate-spin text-[#2D473C] mx-auto" />
            <p className="text-sm font-bold text-gray-600">Cargando reservas en vivo...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
            <Calendar size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-base text-gray-800">No hay reservas registradas en este filtro</h3>
            <p className="text-xs text-gray-500 mt-1">Selecciona otro filtro de reserva o realiza una búsqueda diferente.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(
              reservationStatusFilter === "pendiente"
                ? { "ORDEN_LLEGADA": [...filteredReservations].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()) }
                : filteredReservations.reduce((acc, res) => {
                    const date = res.reservation_date || "Sin fecha";
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(res);
                    return acc;
                  }, {} as Record<string, typeof filteredReservations>)
            )
              .sort(([dateA], [dateB]) => {
                if (reservationStatusFilter === "pendiente") return 0;
                if (dateA === "Sin fecha") return 1;
                if (dateB === "Sin fecha") return -1;
                return new Date(dateA).getTime() - new Date(dateB).getTime();
              })
              .map(([dateStr, items]) => {
                let dateLabel = dateStr;
                if (dateStr === "ORDEN_LLEGADA") {
                  dateLabel = "Por orden de ingreso";
                } else if (dateStr !== "Sin fecha") {
                  const [yyyy, mm, dd] = dateStr.split("-");
                  const dateObj = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                  const isToday = dateStr === getLocalYYYYMMDD(new Date());
                  dateLabel = isToday
                    ? "HOY — " + dateObj.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })
                    : dateObj.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
                }
                return (
                  <div key={dateStr} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="font-serif font-black text-xl text-[#2D473C] uppercase tracking-widest">{dateLabel}</h3>
                      <div className="h-px bg-emerald-200/50 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {(items as any[]).map((reservation) => (
                        <CashierReservationCard
                          key={reservation.id}
                          reservation={reservation}
                          onStatusChange={handleUpdateReservationStatus}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
