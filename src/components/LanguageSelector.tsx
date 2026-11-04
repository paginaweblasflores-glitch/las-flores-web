import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const IDIOMAS = [
  { code: "ES", label: "Español" },
  { code: "EN", label: "English" },
];

/**
 * Selector de idioma del encabezado. Por ahora es solo visual: el sitio está únicamente en español, así que
 * elegir otro idioma cierra la lista y deja seleccionado Español.
 */
export function LanguageSelector({ solid }: { solid: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const idiomaActual = IDIOMAS[0];

  useEffect(() => {
    if (!abierto) return;
    const cerrarFuera = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const cerrarConEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", cerrarFuera);
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.removeEventListener("mousedown", cerrarFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  return (
    <div ref={contenedor} className="relative pointer-events-auto">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={`Idioma: ${idiomaActual.label}`}
        className={`flex items-center gap-1 text-[0.6875rem] md:text-sm font-semibold uppercase tracking-[0.15em] leading-none transition-colors hover:text-chilca cursor-pointer ${
          solid ? "text-nogal" : "text-piedra"
        }`}
      >
        {idiomaActual.code}
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          aria-hidden="true"
          className={`hidden sm:block transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
        />
      </button>

      {abierto && (
        <ul
          role="listbox"
          aria-label="Idioma"
          className="absolute left-0 top-full mt-3 min-w-36 overflow-hidden rounded-md bg-piedra text-nogal shadow-lg border border-nogal/10"
        >
          {IDIOMAS.map(({ code, label }) => {
            const seleccionado = code === idiomaActual.code;
            return (
              <li key={code} role="option" aria-selected={seleccionado}>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className={`block w-full px-4 py-2.5 text-left text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer hover:bg-nogal/10 ${
                    seleccionado ? "bg-nogal/10 font-bold" : "font-medium"
                  }`}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
