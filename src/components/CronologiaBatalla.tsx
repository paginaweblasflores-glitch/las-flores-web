import type { MomentoItem } from "@/data/festividades";

interface CronologiaBatallaProps {
  momentos: MomentoItem[];
  titulo?: string;
  texto?: string;
}

export function CronologiaBatalla({ momentos, titulo, texto }: CronologiaBatallaProps) {
  return (
    <section className="px-6 md:px-16 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <h2 className="font-serif text-3xl md:text-5xl leading-tight">
          {titulo ?? "Cronograma del 9 de diciembre"}
        </h2>
        {texto && (
          <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center max-w-[62ch]">{texto}</p>
        )}
      </div>
      <div
        className={`grid grid-cols-1 gap-5 ${momentos.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
      >
        {momentos.map((m, i) => (
          <figure key={m.momento}>
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src={m.imagen}
                alt={m.momento}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-ink/70 text-piedra text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                Momento {i + 1}
              </span>
            </div>
            <figcaption className="mt-4">
              <p className="font-serif text-lg">{m.momento}</p>
              <p className="text-sm text-nogal/60 mt-1 leading-relaxed max-w-[60ch]">{m.texto}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
