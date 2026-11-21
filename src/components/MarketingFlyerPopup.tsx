import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  getLatestMarketingFlyer,
  getMarketingFlyerPublicUrl,
  type MarketingFlyer,
} from "../features/marketing/api";

export function MarketingFlyerPopup() {
  const [flyer, setFlyer] = useState<MarketingFlyer | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("marketing-flyer-dismissed") === "true") {
      setDismissed(true);
      return;
    }

    let active = true;
    void getLatestMarketingFlyer()
      .then((latestFlyer) => {
        if (active) setFlyer(latestFlyer);
      })
      .catch((error: unknown) => {
        console.error("No se pudo cargar el flyer de portada.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!flyer || dismissed) return;

    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [flyer, dismissed]);

  const closePopup = () => {
    sessionStorage.setItem("marketing-flyer-dismissed", "true");
    setDismissed(true);
  };

  if (!flyer || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePopup();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Promoción de Restaurante Las Flores"
        className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#FAF6ED] shadow-2xl"
        style={{
          width: `${flyer.width_cm ?? 15}cm`,
          height: `${flyer.height_cm ?? 15}cm`,
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closePopup}
          aria-label="Cerrar flyer"
          className="absolute right-3 top-3 z-10 rounded-full bg-[#1b2a24]/85 p-2 text-white transition-colors hover:bg-[#1b2a24] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <X size={20} />
        </button>
        <img
          src={getMarketingFlyerPublicUrl(flyer.storage_path)}
          alt="Flyer promocional de Restaurante Las Flores"
          className="h-full w-full object-cover"
        />
      </section>
    </div>
  );
}
