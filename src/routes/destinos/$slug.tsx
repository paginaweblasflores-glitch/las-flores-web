import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { AyacuchoMiniMap } from "@/components/AyacuchoMiniMap";
import { FestividadVideo } from "@/components/FestividadVideo";
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
  // Imagen a pantalla completa con el Consejo de visita: la del lugar (`seccionImagen`) o su foto secundaria con el nombre como etiqueta.
  const imagenConsejo = lugar.seccionImagen ?? { imagen: lugar.imagenSecundaria || lugar.imagen, etiqueta: lugar.nombre };
  const otrosLugares = lugares.filter((l) => l.slug !== lugar.slug);
  const clipsPool = Array.from(
    new Set([lugar.imagen, lugar.imagenSecundaria, ...(lugar.galeria?.map((g) => g.imagen) ?? [])])
  );
  const clips = Array.from({ length: 4 }, (_, i) => clipsPool[i % clipsPool.length]);

  // Sección "Siente el lugar antes de llegar": va arriba, antes de la imagen con el Consejo; con tarjetas verticales y a la altura de la pantalla (igual en todos los lugares; con clips si el lugar los tiene, con fotos si no).
  const escenasSection = (
          <section className="px-6 md:px-16 py-16 md:py-24 md:min-h-[100svh] md:flex md:flex-col md:justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                Siente el lugar antes de llegar
              </h2>
              <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center">
                {lugar.escenas}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {lugar.escenasCards
                ? lugar.escenasCards.map((item) => (
                    <figure key={item.titulo}>
                      <div className="relative aspect-3/4 overflow-hidden">
                        {item.video ? (
                          <FestividadVideo
                            src={item.video}
                            poster={item.imagen}
                            alt={item.titulo}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.imagen}
                            alt={item.titulo}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <figcaption className="mt-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nogal/60">
                          {item.titulo}
                        </p>
                        <p className="text-sm text-nogal/60 mt-1 leading-relaxed">{item.descripcion}</p>
                      </figcaption>
                    </figure>
                  ))
                : clips.map((src, i) => (
                    <div key={i}>
                      <div className="aspect-3/4 overflow-hidden">
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
  );

  return (
    <div className="bg-piedra text-nogal font-sans selection:bg-chilca/30">
      <SiteHeader />

      {/* HERO — título evocador, no repite el nombre literal del lugar */}
      <header className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-eucalipto">
        {lugar.video ? (
          <>
            <FestividadVideo
              key={lugar.slug}
              src={lugar.video.hero}
              srcMobile={lugar.video.heroMobile}
              poster={lugar.video.poster}
              alt={lugar.nombre}
              priority
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" />
          </>
        ) : (
          <>
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
          </>
        )}

        <div className="relative z-10 h-full w-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-20">
          <h1 className="font-serif text-4xl md:text-6xl text-piedra leading-tight max-w-3xl">
            {lugar.heroTitulo}
          </h1>
        </div>
      </header>

      <main>
        {/* SECCIÓN — Título y descripción del lugar (izq) + mapa de Ayacucho (der) */}
        <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[100svh] md:content-center">
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
            ) : lugar.mapLat !== undefined && lugar.mapLng !== undefined ? (
              <AyacuchoMiniMap lat={lugar.mapLat} lng={lugar.mapLng} nombre={lugar.nombre} />
            ) : null}
          </div>
        </section>

        {escenasSection}

        {/* SECCIÓN — Imagen a pantalla completa con etiqueta (entre el mapa y la galería) */}
        {(lugar.seccionImagen || (lugar.consejo && lugar.frase)) && (
          <section className="relative h-[115svh] min-h-[34rem] w-full overflow-hidden">
            <img
              src={imagenConsejo.imagen}
              alt={imagenConsejo.etiqueta}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {lugar.consejo && lugar.frase && (
              <div className="absolute bottom-0 left-4 right-4 md:right-auto md:left-10 md:w-[30rem] md:h-[min(38rem,78svh)] flex flex-col justify-center gap-6 bg-eucalipto text-piedra px-6 py-8 md:px-10 md:py-12 overflow-y-auto">
                <div>
                  <span className="text-chilca text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
                    Consejo de visita
                  </span>
                  <p className="font-serif text-xl md:text-3xl leading-snug">{lugar.frase}</p>
                </div>
                <p className="text-sm md:text-lg leading-relaxed text-piedra/90">{lugar.consejo}</p>
              </div>
            )}
            <span
              className={`absolute bottom-6 md:bottom-10 text-piedra text-[10px] uppercase tracking-[0.35em] font-semibold drop-shadow ${
                lugar.consejo && lugar.frase ? "right-6 md:right-10" : "left-6 md:left-10"
              }`}
            >
              {imagenConsejo.etiqueta}
            </span>
          </section>
        )}

        {/* SECCIÓN — Galería (solo cuando hay suficiente material fotográfico real) */}
        {lugar.galeria && lugar.galeria.length > 0 && (
          <section className="px-6 md:px-16 py-16 md:py-24">
            {lugar.galeriaTitulo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <h2 className="font-serif text-3xl md:text-5xl leading-tight">{lugar.galeriaTitulo}</h2>
                {lugar.galeriaTexto && (
                  <p className="text-nogal/70 text-base md:text-lg leading-relaxed self-center">
                    {lugar.galeriaTexto}
                  </p>
                )}
              </div>
            )}
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
        <section className="relative h-[115svh] min-h-[34rem] w-full overflow-hidden">
          {lugar.videoSeccion ? (
            <FestividadVideo
              key={lugar.slug}
              src={lugar.videoSeccion.src}
              srcMobile={lugar.videoSeccion.srcMobile}
              poster={lugar.videoSeccion.poster}
              alt={lugar.videoSeccion.etiqueta ?? lugar.nombre}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <img
                src={lugar.imagenPantalla ?? lugar.imagen}
                alt={lugar.nombre}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/10" />
            </>
          )}
          <span className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-piedra text-[10px] uppercase tracking-[0.35em] font-semibold drop-shadow">
            {lugar.videoSeccion?.etiqueta ?? lugar.nombre}
          </span>
        </section>

        {/* SECCIÓN — Explora más lugares: enlaces a los otros destinos (de más cerca a más lejos) + volver al inicio */}
        <section className="px-6 md:px-16 py-16 md:py-24">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-12 md:mb-16">
            Explora más lugares para visitar
          </h2>
          <ul className="border-t border-nogal/25">
            {otrosLugares.map((otro) => (
              <li key={otro.slug} className="border-b border-nogal/25">
                <Link
                  to="/destinos/$slug"
                  params={{ slug: otro.slug }}
                  className="group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_16rem_auto] items-center gap-x-6 gap-y-1 py-5 md:py-7 transition-colors hover:bg-nogal/[0.03]"
                >
                  <span className="font-serif text-xl md:text-3xl leading-snug transition-transform duration-300 group-hover:translate-x-2">
                    {otro.nombre}
                  </span>
                  <span className="hidden md:block text-[11px] uppercase tracking-[0.2em] font-semibold text-nogal/60">
                    {otro.categoria}
                  </span>
                  <span
                    aria-hidden
                    className="text-nogal/60 text-xl transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
