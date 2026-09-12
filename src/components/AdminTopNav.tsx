import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  Ticket,
  Briefcase,
  Store,
  BookOpen,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  UserCircle2,
} from "lucide-react";
import type { AdminTab } from "./AdminSidebar";

interface AdminTopNavProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  applicationsCount: number;
  complaintsCount?: number;
  onSignOut: () => void;
  userEmail?: string;
}

export function AdminTopNav({
  activeTab,
  onSelectTab,
  applicationsCount,
  complaintsCount = 0,
  onSignOut,
  userEmail,
}: AdminTopNavProps) {
  const menuItems = [
    { id: "analytics" as AdminTab, label: "Analítica", icon: BarChart3 },
    { id: "orders" as AdminTab, label: "Comandas", icon: ShoppingBag },
    { id: "reservations" as AdminTab, label: "Reservas de Mesas", icon: Calendar },
    { id: "menu" as AdminTab, label: "Carta", icon: UtensilsCrossed },
    { id: "coupons" as AdminTab, label: "Cupones Promocionales", icon: Ticket },
    { id: "jobs" as AdminTab, label: "Bolsa de Trabajo", icon: Briefcase, badge: applicationsCount },
    { id: "complaints" as AdminTab, label: "Libro de Reclamaciones", icon: BookOpen, badge: complaintsCount },
    { id: "zones" as AdminTab, label: "Zonas", icon: Store },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
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
    <nav className="bg-[#2D473C] text-[#F9F8F3] border-b border-[#D4AF37]/30 shadow-xl sticky top-0 z-40 font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center border-2 border-[#D4AF37] shadow-md shrink-0">
              <img src="/favicon.png" alt="Las Flores" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-serif font-black text-sm text-white tracking-tight flex items-center gap-1.5 leading-none">
                Las Flores
                <ShieldCheck size={12} className="text-[#D4AF37]" />
              </h2>
              <span className="text-[10px] font-sans uppercase font-extrabold text-emerald-200/80 tracking-wider block mt-0.5">
                Suite de Admin
              </span>
            </div>
          </div>

          {/* Desktop nav items */}
          <div className="hidden xl:flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                    isActive
                      ? "border-[#D4AF37] text-white bg-white/5"
                      : "border-transparent text-emerald-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-[#D4AF37]" : "text-emerald-300"} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                        isActive ? "bg-[#D4AF37] text-[#2D473C]" : "bg-emerald-400 text-[#2D473C]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side: account menu + mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
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
                  <div className="px-4 py-3 border-b border-gray-100">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider block">
                      Sesión Activa
                    </span>
                    <p className="text-xs font-bold text-gray-800 truncate">{userEmail || "Administrador"}</p>
                  </div>
                  <Link
                    to="/caja"
                    onClick={() => setAccountOpen(false)}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag size={15} className="text-[#2D473C]" />
                    <span>Ir a Panel de Caja</span>
                  </Link>
                  <Link
                    to="/panel-reservas"
                    onClick={() => setAccountOpen(false)}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar size={15} className="text-[#2D473C]" />
                    <span>Ir a Panel de Reservas</span>
                  </Link>
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="xl:hidden pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[#D4AF37] text-[#2D473C] font-black"
                      : "text-emerald-100/90 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-[#2D473C]" : "text-emerald-300"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? "bg-[#2D473C] text-white" : "bg-emerald-400 text-[#2D473C]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
