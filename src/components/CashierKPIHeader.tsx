import { useEffect, useRef, useState } from "react";
import { Volume2, BellOff, ShieldCheck, TrendingUp, ShoppingBag, Clock, LogOut, UserCircle2, ChevronDown } from "lucide-react";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#2D473C] text-[#F9F8F3] border-b border-[#D4AF37]/30 shadow-xl sticky top-0 z-40 font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-3 md:h-16 md:py-0">
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center border-2 border-[#D4AF37] shadow-md shrink-0">
              <img src="/favicon.png" alt="Las Flores" className="w-full h-full object-contain rounded-lg" />
            </div>
            <h1 className="font-serif text-sm font-black tracking-tight text-white leading-none">
              Panel de Caja
            </h1>
          </div>

          {/* Account Menu */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <UserCircle2 size={20} className="text-[#D4AF37]" />
              <ChevronDown size={14} className={`text-emerald-200 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 text-[#231A14]">
                <button
                  onClick={() => {
                    onToggleSound();
                    setAccountOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {soundEnabled ? <Volume2 size={15} className="text-emerald-600" /> : <BellOff size={15} className="text-red-600" />}
                  <span>{soundEnabled ? "Silenciar Alerta Sonora" : "Activar Alerta Sonora"}</span>
                </button>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setAccountOpen(false)}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ShieldCheck size={15} className="text-[#2D473C]" />
                    <span>Volver a Admin</span>
                  </Link>
                )}

                <button
                  onClick={onSignOut}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <LogOut size={15} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
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
