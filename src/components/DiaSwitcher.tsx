import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DiaItem } from "@/data/festividades";

interface DiaSwitcherProps {
  dias: DiaItem[];
  titulo?: string;
  texto?: string;
}

const VISIBLES = 3;
const GAP = 20;

export function DiaSwitcher({ dias, titulo, texto }: DiaSwitcherProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const maxStart = Math.max(dias.length - VISIBLES, 0);
  const [start, setStart] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const medir = () => {
      const card = trackRef.current?.children[0] as HTMLElement | undefined;
      if (card) setCardWidth(card.getBoundingClientRect().width);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const mover = (dir: 1 | -1) => {
    setStart((s) => Math.min(Math.max(s + dir, 0), maxStart));
  };

  return (
    <section className="px-6 md:px-16 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <h2 className="font-serif text-3xl md:text-5xl leading-tight">{titulo ?? "Los días de Semana Santa"}</h2>
        {texto && (
          <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center max-w-[62ch]">{texto}</p>
        )}
      </div>
      <div className="relative md:px-14">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={start === 0}
          aria-label="Días anteriores"
          className="absolute left-0 top-[38%] -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-piedra border border-nogal/40 rounded-md text-nogal hover:border-nogal hover:bg-nogal/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:border-nogal/40 disabled:hover:bg-piedra"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={start === maxStart}
          aria-label="Días siguientes"
          className="absolute right-0 top-[38%] -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-piedra border border-nogal/40 rounded-md text-nogal hover:border-nogal hover:bg-nogal/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:border-nogal/40 disabled:hover:bg-piedra"
        >
          <ChevronRight size={18} />
        </button>
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${start * (cardWidth + GAP)}px)` }}
          >
            {dias.map((d) => (
              <figure key={d.numero} className="shrink-0 basis-full md:basis-[calc(33.333%-0.834rem)]">
                <div className="aspect-4/3 overflow-hidden relative">
                  <img
                    src={d.imagen}
                    alt={d.titulo ?? d.dia}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-ink/70 text-piedra text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                    Día {d.numero}
                  </span>
                </div>
                <figcaption className="mt-4">
                  {d.titulo && (
                    <p className="text-eucalipto text-[10px] uppercase tracking-[0.25em] font-semibold mb-1">
                      {d.dia}
                    </p>
                  )}
                  <p className="font-serif text-lg">{d.titulo ?? d.dia}</p>
                  <p className="text-sm text-nogal/60 mt-1 leading-relaxed max-w-[60ch]">
                    {d.texto.split(/\*(.+?)\*/g).map((trozo, j) => (j % 2 === 1 ? <em key={j}>{trozo}</em> : trozo))}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
