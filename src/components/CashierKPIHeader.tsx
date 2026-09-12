import { Volume2, BellOff, ShieldCheck, TrendingUp, ShoppingBag, Clock, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatCard } from "./StatCard";

interface CashierTopBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  isAdmin: boolean;
  onSignOut: () => void;
}

export function CashierTopBar({
  soundEnabled,
  onToggleSound,
  isAdmin,
  onSignOut,
}: CashierTopBarProps) {
  return (
    <header className="bg-[#2D473C] text-[#F9F8F3] border-b border-[#D4AF37]/30 shadow-xl sticky top-0 z-40 font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-3 md:h-16 md:py-0">
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center border-2 border-[#D4AF37] shadow-md shrink-0">
              <img src="/favicon.png" alt="Las Flores" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h1 className="font-serif text-sm font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                Panel de Caja y Recepción
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  TIMBRE EN VIVO
                </span>
              </h1>
              <p className="text-[10px] text-emerald-200/80 font-sans uppercase font-extrabold tracking-wider mt-0.5">
                Centro de Control Operativo Gastronómico
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
        </div>
      </div>
    </header>
  );
}

interface CashierKPIHeaderProps {
  todayRevenue: number;
  activeOrdersCount: number;
  avgWaitMins: number;
}

export function CashierKPIHeader({
  todayRevenue,
  activeOrdersCount,
  avgWaitMins,
}: CashierKPIHeaderProps) {
  return (
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
  );
}
