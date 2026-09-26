import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DiaItem } from "@/data/festividades";

interface DiaSwitcherProps {
  dias: DiaItem[];
}

const VISIBLES = 3;
const GAP = 20;

export function DiaSwitcher({ dias }: DiaSwitcherProps) {
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
      <span className="text-eucalipto text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 block">
        Los 10 días de Semana Santa
      </span>
      <div className="relative md:px-14">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={start === 0}
          aria-label="Días anteriores"
          className="absolute left-0 top-[38%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-piedra border-2 border-nogal rounded-md text-nogal hover:bg-nogal/5 transition-colors disabled:opacity-30 disabled:hover:bg-piedra"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={start === maxStart}
          aria-label="Días siguientes"
          className="absolute right-0 top-[38%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-piedra border-2 border-nogal rounded-md text-nogal hover:bg-nogal/5 transition-colors disabled:opacity-30 disabled:hover:bg-piedra"
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
                    alt={d.dia}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-ink/70 text-piedra text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                    Día {d.numero}
                  </span>
                </div>
                <figcaption className="mt-4">
                  <p className="font-serif text-lg">{d.dia}</p>
                  <p className="text-sm text-nogal/60 mt-1 leading-relaxed">{d.texto}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
