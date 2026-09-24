import { useState } from "react";
import type { MomentoItem } from "@/data/festividades";

interface CronologiaBatallaProps {
  momentos: MomentoItem[];
}

export function CronologiaBatalla({ momentos }: CronologiaBatallaProps) {
  const [activo, setActivo] = useState(0);
  const actual = momentos[activo];

  return (
    <section className="px-6 md:px-16 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
      <div className="flex flex-col">
        <span className="text-eucalipto text-[10px] uppercase tracking-[0.3em] font-semibold mb-10 block">
          Cronología del 9 de diciembre
        </span>
        <div className="relative flex flex-col gap-8">
          <span className="absolute left-4 top-4 bottom-4 -translate-x-1/2 w-px bg-nogal/15" />
          {momentos.map((m, i) => {
            const seleccionado = i === activo;
            return (
              <button
                key={m.momento}
                type="button"
                onClick={() => setActivo(i)}
                className="relative flex items-start gap-4 text-left w-full group"
              >
                <span
                  className={`relative z-10 shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-colors ${
                    seleccionado
                      ? "bg-eucalipto border-eucalipto text-piedra"
                      : "bg-piedra border-nogal/30 text-nogal/50 group-hover:border-nogal"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="pt-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-eucalipto font-semibold mb-1">
                    {m.hora}
                  </p>
                  <p
                    className={`font-serif text-xl md:text-2xl mb-2 transition-colors ${
                      seleccionado ? "text-ink" : "text-nogal/50 group-hover:text-nogal"
                    }`}
                  >
                    {m.momento}
                  </p>
                  <p
                    className={`text-sm md:text-base leading-relaxed transition-colors ${
                      seleccionado ? "text-nogal/70" : "text-nogal/40 group-hover:text-nogal/60"
                    }`}
                  >
                    {m.texto}
                  </p>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:sticky md:top-24 aspect-4/3 overflow-hidden">
        <img
          key={actual.imagen}
          src={actual.imagen}
          alt={actual.momento}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
