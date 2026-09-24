import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { DiaSwitcher } from "@/components/DiaSwitcher";
import { ComparsasPaginadas } from "@/components/ComparsasPaginadas";
import { CronologiaBatalla } from "@/components/CronologiaBatalla";
import { festividades } from "@/data/festividades";

export const Route = createFileRoute("/festividades/$slug")({
  loader: ({ params }) => {
    const festividad = festividades.find((f) => f.slug === params.slug);
    if (!festividad) throw notFound();
    return festividad;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nombre} — Las Flores | Festividades de Huamanga` },
          { name: "description", content: loaderData.descripcion },
          { property: "og:title", content: `${loaderData.nombre} — Las Flores` },
          { property: "og:description", content: loaderData.descripcion },
        ]
      : [],
  }),
  component: FestividadDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-piedra text-nogal gap-4">
      <p className="font-serif text-2xl">Festividad no encontrada</p>
      <Link to="/" className="text-eucalipto underline text-sm">
        Volver al inicio
      </Link>
    </div>
  ),
});

function FestividadDetailPage() {
  const fest = Route.useLoaderData();
  const invertido = fest.id % 2 === 0;
  const consejoImagen = fest.imagenSecundaria || fest.imagen;
  const clipsPool = Array.from(
    new Set([
      fest.imagen,
      fest.imagenSecundaria,
      ...(fest.dias?.map((d) => d.imagen) ?? []),
      ...(fest.comparsas?.map((c) => c.imagen) ?? []),
      ...(fest.cronologia?.map((m) => m.imagen) ?? []),
    ])
  );
  const clips = Array.from({ length: 4 }, (_, i) => clipsPool[i % clipsPool.length]);

  return (
    <div className="bg-piedra text-nogal font-sans selection:bg-chilca/30">
      <SiteHeader />

      {/* HERO — título evocador, no repite el nombre literal de la festividad */}
      <header className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-eucalipto">
        <img
          key={fest.slug}
          src={fest.imagen}
          alt={fest.nombre}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover animate-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-black/20" />

        <div className="relative z-10 h-full w-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-20">
          <h1 className="font-serif italic text-4xl md:text-6xl text-piedra leading-tight max-w-3xl">
            {fest.heroTitulo}
          </h1>
        </div>
      </header>

      <main>
        {/* SECCIÓN — Descripción (izq) + Datos clave, sin mapa (no aplica a una festividad) */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div
            className={`flex items-center px-6 md:px-16 py-16 md:py-24 ${invertido ? "md:order-2" : "md:order-1"}`}
          >
            <div className="max-w-lg">
              <span className="text-eucalipto text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
                {fest.categoria}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-5">{fest.nombre}</h2>
              <p className="text-nogal/80 text-base md:text-lg leading-relaxed">{fest.descripcion}</p>
            </div>
          </div>
          <div
            className={`flex items-center px-6 md:px-16 py-16 md:py-24 bg-cafe/[0.03] ${invertido ? "md:order-1" : "md:order-2"}`}
          >
            <div className="max-w-lg w-full">
              <span className="text-eucalipto text-[10px] uppercase tracking-[0.3em] font-semibold mb-6 block">
                Datos clave
              </span>
              <dl className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-nogal/10 pb-3">
                  <dt className="text-nogal/60 text-sm">Cuándo</dt>
                  <dd className="font-serif text-lg">{fest.fecha}</dd>
                </div>
                <div className="flex justify-between border-b border-nogal/10 pb-3">
                  <dt className="text-nogal/60 text-sm">Dónde</dt>
                  <dd className="font-serif text-lg text-right max-w-[20ch]">{fest.lugarPrincipal}</dd>
                </div>
                <div className="flex justify-between border-b border-nogal/10 pb-3">
                  <dt className="text-nogal/60 text-sm">Reconocimiento</dt>
                  <dd className="font-serif text-lg text-right max-w-[20ch]">{fest.reconocimiento}</dd>
                </div>
              </dl>
              <div className="border-l-2 border-eucalipto pl-5 py-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-eucalipto font-semibold mb-1">
                  Dato curioso
                </p>
                <p className="text-sm md:text-base text-nogal/70 leading-relaxed">{fest.dato}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN — Estructura propia de cada festividad (no una galería genérica) */}
        {fest.dias && <DiaSwitcher dias={fest.dias} />}

        {fest.comparsas && <ComparsasPaginadas comparsas={fest.comparsas} />}

        {fest.cronologia && <CronologiaBatalla momentos={fest.cronologia} />}

        {/* SECCIÓN — Solo imagen/clip a pantalla completa (aquí irá el video de 5-15s) */}
        <section className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden">
          <img
            src={fest.imagen}
            alt={fest.nombre}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/10" />
          <span className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-piedra text-[10px] uppercase tracking-[0.35em] font-semibold drop-shadow">
            {fest.nombre}
          </span>
        </section>

        {/* SECCIÓN — Adelanto en video: distintos clips de la misma festividad */}
        <section className="px-6 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">
              Siente la festividad antes de vivirla
            </h2>
            <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center">
              {fest.escenas}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {clips.map((src, i) => (
              <div key={i}>
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={src}
                    alt={fest.clipTags[i]}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nogal/60 mt-3">
                  {fest.clipTags[i]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN — Consejo de visita: foto a pantalla completa + panel sólido superpuesto */}
        <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
          <img
            src={consejoImagen}
            alt={fest.nombre}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full max-w-md bg-eucalipto text-piedra px-8 py-10 md:px-10 md:py-12">
            <span className="text-chilca text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
              Consejo de visita
            </span>
            <p className="font-serif italic text-xl md:text-2xl leading-snug mb-4">{fest.frase}</p>
            <p className="text-sm md:text-base leading-relaxed text-piedra/90">{fest.consejo}</p>
          </div>
        </section>

        {/* CTA — vuelve la narrativa hacia Las Flores */}
        <section className="px-6 md:px-16 py-20 md:py-28 text-center">
          <h2 className="font-serif text-3xl md:text-4xl max-w-2xl mx-auto leading-tight mb-5">
            Vive la festividad y luego siéntate a la mesa
          </h2>
          <p className="text-nogal/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Cada tradición que conoces en Ayacucho tiene un sabor esperándote en Las Flores. Reserva
            tu mesa y cierra el día como se merece.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reservas"
              className="inline-flex items-center gap-3 bg-cochinilla text-piedra text-[11px] uppercase tracking-[0.25em] font-bold px-7 py-4 rounded-md hover:bg-cochinilla/90 transition-colors"
            >
              Reservar una mesa <ArrowRight size={14} />
            </Link>
            <Link
              to="/"
              hash="festividades-de-huamanga"
              className="inline-flex items-center gap-3 text-nogal text-[11px] uppercase tracking-[0.25em] font-bold border-2 border-nogal rounded-md hover:bg-nogal/5 transition-colors px-7 py-4"
            >
              <ArrowLeft size={14} /> Volver a Festividades de Huamanga
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
