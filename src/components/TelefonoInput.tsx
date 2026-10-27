import { useEffect, useRef, useState } from "react";
import PE from "country-flag-icons/react/3x2/PE";
import AR from "country-flag-icons/react/3x2/AR";
import CL from "country-flag-icons/react/3x2/CL";
import CO from "country-flag-icons/react/3x2/CO";
import MX from "country-flag-icons/react/3x2/MX";
import US from "country-flag-icons/react/3x2/US";
import ES from "country-flag-icons/react/3x2/ES";

export const PAISES_TELEFONO = [
  { code: "+51", name: "Perú", Flag: PE },
  { code: "+54", name: "Argentina", Flag: AR },
  { code: "+56", name: "Chile", Flag: CL },
  { code: "+57", name: "Colombia", Flag: CO },
  { code: "+52", name: "México", Flag: MX },
  { code: "+1", name: "Estados Unidos", Flag: US },
  { code: "+34", name: "España", Flag: ES },
];

interface TelefonoInputProps {
  prefijo: string;
  numero: string;
  onPrefijoChange: (prefijo: string) => void;
  onNumeroChange: (numero: string) => void;
}

/** Prefijo (bandera + código) y número en un solo campo, como el de verificación de Google. */
export function TelefonoInput({ prefijo, numero, onPrefijoChange, onNumeroChange }: TelefonoInputProps) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const actual = PAISES_TELEFONO.find((p) => p.code === prefijo) ?? PAISES_TELEFONO[0];

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
    <div ref={contenedor} className="relative">
      <div className="flex w-full items-stretch rounded-lg border border-gray-300 bg-[#fdf8f0] focus-within:border-[#2e5339]">
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={abierto}
          aria-label={`Prefijo del país: ${actual.name} (${actual.code})`}
          className="flex shrink-0 items-center gap-2 rounded-l-lg border-r border-gray-300 bg-white px-3 text-sm text-gray-800 hover:bg-gray-50"
        >
          <actual.Flag className="h-4 w-6 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" aria-hidden="true" />
          <span className="tabular-nums">{actual.code}</span>
          <svg
            viewBox="0 0 12 12"
            className={`h-3 w-3 text-gray-500 transition-transform ${abierto ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          value={numero}
          onChange={(e) => onNumeroChange(e.target.value)}
          placeholder="999 654 321"
          className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none"
        />
      </div>

      {abierto && (
        <ul
          role="listbox"
          aria-label="Prefijo del país"
          className="absolute left-0 z-30 mt-1 max-h-64 w-64 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {PAISES_TELEFONO.map(({ code, name, Flag }) => (
            <li key={code} role="option" aria-selected={code === actual.code}>
              <button
                type="button"
                onClick={() => {
                  onPrefijoChange(code);
                  setAbierto(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[#f4efe3] ${
                  code === actual.code ? "bg-[#f4efe3] font-semibold" : ""
                }`}
              >
                <Flag className="h-4 w-6 shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" aria-hidden="true" />
                <span className="flex-1">{name}</span>
                <span className="tabular-nums text-gray-500">{code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
