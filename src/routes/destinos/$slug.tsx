import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { AyacuchoMiniMap } from "@/components/AyacuchoMiniMap";
import { lugares } from "@/data/lugares";

export const Route = createFileRoute("/destinos/$slug")({
  loader: ({ params }) => {
    const lugar = lugares.find((l) => l.slug === params.slug);
    if (!lugar) throw notFound();
    return lugar;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nombre} — Las Flores | Lugares para Visitar` },
          { name: "description", content: loaderData.descripcion },
          { property: "og:title", content: `${loaderData.nombre} — Las Flores` },
          { property: "og:description", content: loaderData.descripcion },
        ]
      : [],
  }),
  component: LugarDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-piedra text-nogal gap-4">
      <p className="font-serif text-2xl">Destino no encontrado</p>
      <Link to="/" className="text-eucalipto underline text-sm">
        Volver al inicio
      </Link>
    </div>
  ),
});

function LugarDetailPage() {
  const lugar = Route.useLoaderData();
  const consejoImagen = lugar.imagenSecundaria || lugar.imagen;
  const clipsPool = Array.from(
    new Set([lugar.imagen, lugar.imagenSecundaria, ...(lugar.galeria?.map((g) => g.imagen) ?? [])])
  );
  const clips = Array.from({ length: 4 }, (_, i) => clipsPool[i % clipsPool.length]);

  return (
    <div className="bg-piedra text-nogal font-sans selection:bg-chilca/30">
      <SiteHeader />

      {/* HERO — título evocador, no repite el nombre literal del lugar */}
      <header className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-eucalipto">
        <img
          key={lugar.slug}
          src={lugar.imagen}
          alt={lugar.nombre}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover animate-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-black/20" />

        <div className="relative z-10 h-full w-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-20">
          <h1 className="font-serif italic text-4xl md:text-6xl text-piedra leading-tight max-w-3xl">
            {lugar.heroTitulo}
          </h1>
        </div>
      </header>

      <main>
        {/* SECCIÓN — Título y descripción del lugar (izq) + mapa de Ayacucho (der) */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div
            className="flex items-start px-6 md:px-16 py-16 md:py-24 md:order-2"
          >
            <div className="max-w-lg">
              <span className="text-eucalipto text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
                {lugar.categoria}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-5">{lugar.nombre}</h2>
              <p className="text-nogal/80 text-base md:text-lg leading-relaxed">{lugar.descripcion}</p>
            </div>
          </div>
          <div
            className={`flex items-start justify-center px-6 md:px-10 pt-16 md:pt-24 pb-6 md:pb-10 md:order-1 ${lugar.mapaImagen ? "h-[410px] md:h-[550px]" : "h-[380px] md:h-[520px]"}`}
          >
            {lugar.mapaImagen ? (
              <img
                src={lugar.mapaImagen}
                alt={`Ubicación de ${lugar.nombre} en el mapa de Ayacucho`}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <AyacuchoMiniMap lat={lugar.mapLat} lng={lugar.mapLng} nombre={lugar.nombre} />
            )}
          </div>
        </section>

        {/* SECCIÓN — Galería (solo cuando hay suficiente material fotográfico real) */}
        {lugar.galeria && lugar.galeria.length > 0 && (
          <section className="px-6 md:px-16 py-16 md:py-24">
            <div
              className={`grid grid-cols-1 gap-x-3 gap-y-10 md:gap-x-5 ${
                lugar.galeria.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {lugar.galeria.map((item) => (
                <figure key={item.imagen + item.titulo}>
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-serif text-lg">{item.titulo}</p>
                    <p className="text-sm text-nogal/60 mt-1 leading-relaxed">{item.descripcion}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* SECCIÓN — Solo imagen/clip a pantalla completa (aquí irá el video de 5s) */}
        <section className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden">
          <img
            src={lugar.imagen}
            alt={lugar.nombre}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/10" />
          <span className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-piedra text-[10px] uppercase tracking-[0.35em] font-semibold drop-shadow">
            {lugar.nombre}
          </span>
        </section>

        {/* SECCIÓN — Adelanto en video: distintos clips del mismo lugar */}
        <section className="px-6 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">
              Siente el lugar antes de llegar
            </h2>
            <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center">
              {lugar.escenas}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {clips.map((src, i) => (
              <div key={i}>
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={src}
                    alt={lugar.clipTags[i]}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nogal/60 mt-3">
                  {lugar.clipTags[i]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN — Consejo de visita: foto a pantalla completa + panel sólido superpuesto */}
        <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
          <img
            src={consejoImagen}
            alt={lugar.nombre}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full max-w-md bg-eucalipto text-piedra px-8 py-10 md:px-10 md:py-12">
            <span className="text-chilca text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
              Consejo de visita
            </span>
            <p className="font-serif italic text-xl md:text-2xl leading-snug mb-4">{lugar.frase}</p>
            <p className="text-sm md:text-base leading-relaxed text-piedra/90">{lugar.consejo}</p>
          </div>
        </section>

        {/* CTA — vuelve la narrativa hacia Las Flores */}
        <section className="px-6 md:px-16 py-20 md:py-28 text-center">
          <h2 className="font-serif text-3xl md:text-4xl max-w-2xl mx-auto leading-tight mb-5">
            Vive Ayacucho y luego siéntate a la mesa
          </h2>
          <p className="text-nogal/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Cada rincón que conoces en Ayacucho tiene un sabor esperándote en Las Flores. Reserva tu
            mesa y cierra el día como se merece.
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
              hash="lugares-para-visitar"
              className="inline-flex items-center gap-3 text-nogal text-[11px] uppercase tracking-[0.25em] font-bold border-2 border-nogal rounded-md hover:bg-nogal/5 transition-colors px-7 py-4"
            >
              <ArrowLeft size={14} /> Volver a Lugares para Visitar
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
