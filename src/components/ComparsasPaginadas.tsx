import { useState } from "react";
import type { ComparsaItem } from "@/data/festividades";

interface ComparsasPaginadasProps {
  comparsas: ComparsaItem[];
  titulo?: string;
  texto?: string;
}

const POR_PAGINA = 2;

export function ComparsasPaginadas({ comparsas, titulo, texto }: ComparsasPaginadasProps) {
  const [page, setPage] = useState(0);
  const totalPaginas = Math.ceil(comparsas.length / POR_PAGINA);
  const visibles = comparsas.slice(page * POR_PAGINA, page * POR_PAGINA + POR_PAGINA);

  return (
    <section className="px-6 md:px-16 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <h2 className="font-serif text-3xl md:text-5xl leading-tight">{titulo ?? "Comparsas del Carnaval"}</h2>
        {texto && (
          <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center max-w-[62ch]">{texto}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 mb-10">
        {visibles.map((c) => (
          <figure key={c.nombre}>
            <div className="aspect-4/3 overflow-hidden">
              <img
                src={c.imagen}
                alt={c.nombre}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="mt-4">
              <p className="font-serif text-lg">{c.nombre}</p>
              <p className="text-sm text-nogal/60 mt-1 leading-relaxed max-w-[60ch]">{c.descripcion}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPage(i)}
            aria-label={`Ver comparsas ${i + 1}`}
            className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
              i === page
                ? "border-eucalipto bg-eucalipto text-piedra"
                : "border-nogal text-nogal/60 hover:bg-nogal/5"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
