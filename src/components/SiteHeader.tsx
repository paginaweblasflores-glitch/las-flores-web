import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { SiteNavigationMenu } from "./SiteNavigationMenu";
import { AnimatedCartButton } from "./AnimatedCartButton";
import { useCart } from "../context/CartContext";
import { getDeliveryButtonVisibilityClass } from "../utils/siteHeader";

const LOGO_BLANCO = "/imagenes-reales/logo/logo-las-flores-white.webp";
const LOGO_COLOR = "/imagenes-reales/logo/logo-las-flores-black.webp";

interface SiteHeaderProps {
  isAlwaysSolid?: boolean;
  onDeliveryClick?: () => void;
  showReservar?: boolean;
  showDelivery?: boolean;
  showDeliveryOnMobile?: boolean;
}

export function SiteHeader({
  isAlwaysSolid = false,
  onDeliveryClick,
  showReservar = true,
  showDelivery = false,
  showDeliveryOnMobile = false,
}: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();

  useEffect(() => {
    if (isAlwaysSolid) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAlwaysSolid]);

  const solid = isAlwaysSolid || isScrolled;

  // Precarga la versión que aún no se muestra para que el cambio al hacer scroll sea instantáneo.
  useEffect(() => {
    new Image().src = solid ? LOGO_BLANCO : LOGO_COLOR;
  }, [solid]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 md:px-10 py-2 md:py-3 transition-all duration-300 pointer-events-none ${
        solid
          ? "bg-piedra/95 backdrop-blur-md text-nogal shadow-sm border-b border-nogal/10"
          : "bg-transparent text-piedra border-b border-transparent"
      }`}
    >
      {/* ── Izquierda: Menú Hamburguesa + Perfil de Usuario ── */}
      <div className="flex items-center">
        <SiteNavigationMenu isScrolled={solid} />
      </div>

      {/* ── Centro: Logo Las Flores ── */}
      <Link
        to="/"
        className="flex-1 flex justify-center items-center pointer-events-auto"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Ir al inicio de Restaurante Las Flores"
      >
        <img
          src={solid ? LOGO_COLOR : LOGO_BLANCO}
          alt="Restaurante Las Flores Logo"
          className={`w-auto object-contain transition-all duration-300 ${
            solid ? "h-8" : "h-10 md:h-12"
          }`}
        />
      </Link>

      {/* ── Derecha: Botones de Acción (Delivery, Reservar, Carrito) ── */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-[11px] md:text-sm uppercase tracking-[0.15em] font-semibold pointer-events-auto">
        {(showDelivery || onDeliveryClick) && (
          <button
            onClick={onDeliveryClick}
            className={`${getDeliveryButtonVisibilityClass(showDeliveryOnMobile)} transition-colors leading-none hover:text-chilca cursor-pointer ${
              solid ? "text-nogal" : "text-piedra"
            }`}
          >
            Delivery
          </button>
        )}

        {showReservar && (
          <Link
            to="/reservas"
            className={`pointer-events-auto px-4.5 py-1.5 md:px-5 md:py-2 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 rounded-md border ${
              solid
                ? "border-nogal/50 text-nogal hover:border-nogal hover:bg-nogal/10"
                : "border-piedra/50 text-piedra hover:border-piedra/80 hover:bg-piedra/15"
            }`}
          >
            Reservar
          </Link>
        )}

        {totalItems > 0 && (
          <AnimatedCartButton
            onClick={() => setIsOpen(true)}
            className={`pointer-events-auto transition-colors ${
              solid ? "hover:text-chilca text-nogal" : "hover:text-chilca text-piedra"
            }`}
            size={20}
            color={solid ? "#8B7355" : "#F5F5DC"}
          />
        )}
      </div>
    </nav>
  );
}
