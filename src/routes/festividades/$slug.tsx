import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { DiaSwitcher } from "@/components/DiaSwitcher";
import { ComparsasPaginadas } from "@/components/ComparsasPaginadas";
import { CronologiaBatalla } from "@/components/CronologiaBatalla";
import { FestividadVideo } from "@/components/FestividadVideo";
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
  // Acordeón de preguntas: solo una respuesta abierta a la vez; al elegir otra, la anterior se cierra.
  const [preguntaAbierta, setPreguntaAbierta] = useState<string | null>(null);
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
        <FestividadVideo
          key={fest.slug}
          src={fest.video.hero}
          poster={fest.video.poster}
          alt={fest.nombre}
          priority
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />

        <div className="relative z-10 h-full w-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-20">
          <h1 className="font-serif text-4xl md:text-6xl text-piedra leading-tight max-w-3xl">
            {fest.heroTitulo}
          </h1>
        </div>
      </header>

      <main>
        {/* SECCIÓN — Descripción (izq) + Datos clave, sin mapa (no aplica a una festividad) */}
        <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[100svh]">
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
        {fest.dias && (
          <DiaSwitcher dias={fest.dias} titulo={fest.diasTitulo} texto={fest.diasTexto} />
        )}

        {fest.comparsas && (
          <ComparsasPaginadas
            comparsas={fest.comparsas}
            titulo={fest.comparsasTitulo}
            texto={fest.comparsasTexto}
          />
        )}

        {fest.cronologia && <CronologiaBatalla momentos={fest.cronologia} />}

        {/* SECCIÓN — Solo imagen/clip a pantalla completa (aquí irá el video de 5-15s) */}
        <section className="relative h-[115svh] min-h-[34rem] w-full overflow-hidden">
          {fest.videoSeccion ? (
            <FestividadVideo
              key={fest.slug}
              src={fest.videoSeccion.src}
              srcMobile={fest.videoSeccion.srcMobile}
              poster={fest.videoSeccion.poster}
              alt={fest.videoSeccion.etiqueta ?? fest.nombre}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <img
                src={fest.imagen}
                alt={fest.nombre}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/10" />
            </>
          )}
          <span className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-piedra text-[10px] uppercase tracking-[0.35em] font-semibold drop-shadow">
            {fest.videoSeccion?.etiqueta ?? fest.nombre}
          </span>
        </section>

        {/* SECCIÓN — Preguntas y respuestas de la festividad (opcional) */}
        {fest.preguntas && fest.preguntas.length > 0 && (
          <section className="px-6 md:px-16 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16">
              <div className="md:sticky md:top-28 md:self-start">
                <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5">
                  {fest.preguntasTitulo ?? "Preguntas frecuentes"}
                </h2>
                {fest.preguntasTexto && (
                  <p className="text-nogal/70 text-base md:text-lg leading-relaxed max-w-md">
                    {fest.preguntasTexto}
                  </p>
                )}
                {fest.preguntasImagen && (
                  <img
                    src={fest.preguntasImagen.src}
                    alt={fest.preguntasImagen.alt}
                    loading="lazy"
                    decoding="async"
                    className="mt-8 md:mt-10 w-full aspect-[3/2] object-cover"
                  />
                )}
              </div>
              <div className="border-t border-nogal/25">
                {fest.preguntas.map((item) => (
                  <details
                    key={item.pregunta}
                    open={preguntaAbierta === item.pregunta}
                    className="group border-b border-nogal/25"
                  >
                    <summary
                      onClick={(e) => {
                        e.preventDefault();
                        setPreguntaAbierta((actual) => (actual === item.pregunta ? null : item.pregunta));
                      }}
                      className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 md:py-6 [&::-webkit-details-marker]:hidden"
                    >
                      <span className="font-serif text-lg md:text-2xl leading-snug">{item.pregunta}</span>
                      <span
                        aria-hidden
                        className="shrink-0 text-2xl leading-none text-nogal/60 transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="pb-6 pr-10">
                      <p className="text-nogal/70 text-base md:text-lg leading-relaxed">{item.respuesta}</p>
                      {item.carta && (
                        <Link
                          to="/carta"
                          className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-eucalipto hover:text-nogal transition-colors"
                        >
                          Ver la carta <span aria-hidden>→</span>
                        </Link>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN — Cuatro imágenes verticales pegadas, a ancho completo y sin texto */}
        <section className="grid grid-cols-2 lg:grid-cols-4">
          {clips.map((src, i) => {
            const clip = fest.escenasClips?.[i];
            return (
              <div key={i} className="relative aspect-[3/4] overflow-hidden">
                {clip ? (
                  <FestividadVideo
                    src={clip.video}
                    poster={clip.imagen}
                    alt={clip.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={src}
                    alt={fest.clipTags[i]}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
