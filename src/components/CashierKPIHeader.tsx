import { Volume2, BellOff, ShieldCheck, TrendingUp, ShoppingBag, Clock, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatCard } from "./StatCard";

interface CashierKPIHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  todayRevenue: number;
  activeOrdersCount: number;
  avgWaitMins: number;
  isAdmin: boolean;
  onSignOut: () => void;
}

export function CashierKPIHeader({
  soundEnabled,
  onToggleSound,
  todayRevenue,
  activeOrdersCount,
  avgWaitMins,
  isAdmin,
  onSignOut,
}: CashierKPIHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Upper Executive Operator Bar */}
      <header className="bg-[#2D473C] text-[#F9F8F3] rounded-2xl border border-[#D4AF37]/40 shadow-lg p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border-2 border-[#D4AF37] shadow-md shrink-0">
            <img src="/favicon.png" alt="Las Flores" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Panel de Caja y Recepción
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                TIMBRE EN VIVO
              </span>
            </h1>
            <p className="text-xs text-emerald-100/80 font-serif italic mt-0.5">
              Restaurante Las Flores — Centro de Control Operativo Gastronómico
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition-all shadow-2xs ${
              soundEnabled
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30 active:scale-98"
                : "bg-red-500/20 text-red-200 border-red-500/40 hover:bg-red-500/30 active:scale-98"
            }`}
            title="Activar / Silenciar Alerta Sonora"
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
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-extrabold flex items-center gap-2 transition-colors border border-red-500/40 shadow-2xs cursor-pointer"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Shift KPIs Metrics Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
        <StatCard
          icon={TrendingUp}
          accent="cochinilla"
          label="Ventas Hoy (S/)"
          value={`S/ ${todayRevenue.toFixed(2)}`}
        />
        <StatCard
          icon={ShoppingBag}
          accent="chilca"
          label="Comandas en Cola"
          value={activeOrdersCount}
        />
        <StatCard
          icon={Clock}
          accent="cielo"
          label={activeOrdersCount > 0 ? "Espera en Cola" : "Promedio Despacho"}
          value={`${avgWaitMins} min`}
        />
      </div>
    </div>
  );
}
