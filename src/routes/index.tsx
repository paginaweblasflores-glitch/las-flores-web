import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Star,
  MapPin,
  ChefHat,
  Info,
  ArrowLeft,
  ArrowRight,
  ArrowRightCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
const ayacuchoHero = "/imagenes-reales/premios/ayacucho.webp";
const culturaImg = "/imagenes-reales/ARTE Y CULTURA LISTO/CERAMICA/CERAMICA-AYACUCHANA.webp";
const retabloImg = "/imagenes-reales/ARTE Y CULTURA LISTO/RETABLO AYACUCHANO/LopezA.webp";
const platoPucaImg = "/imagenes-reales/seccion-gastronomia/puca-picante.webp";
const platoCuyImg = "/imagenes-reales/seccion-gastronomia/cuy-frito-ayacuchano.webp";
const platoMondongoImg = "/imagenes-reales/seccion-gastronomia/mondongo ayacuchano.webp";
const platoMaizImg = "/imagenes-reales/seccion-gastronomia/chorizo-ayacuchano.webp";
import { SiteFooter } from "@/components/site-footer";
import { LocationSelector } from "../components/LocationSelector";
import RetabloWrapper, { AyacuchoFlowerInline } from "../components/RetabloWrapper";
import { MenuModal } from "@/components/MenuModal";
import { FamiliaLasFloresSection } from "../components/FamiliaLasFloresSection";
import { getFestividadesDestacadas } from "../lib/festividadesLayout";
import { FaunaAndina } from "@/components/FaunaAndina";
import { FestividadVideo } from "@/components/FestividadVideo";
import { HeroVideo } from "@/components/HeroVideo";
import { lugares } from "@/data/lugares";
import { festividades } from "@/data/festividades";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Restaurante Las Flores Ayacucho — Dónde Comer en Ayacucho | Carta & Reservas" },
      {
        name: "description",
        content:
          "¿Dónde comer en Ayacucho? Disfruta la mejor gastronomía tradicional ayacuchana (Puca Picante, Cuy Frito, Pachamanca) y parrillas en Restaurante Las Flores. Jr. José Olaya 106, Huamanga. ¡Reserva online o pide delivery!",
      },
      {
        name: "keywords",
        content:
          "restaurante las flores, restaurante las flores ayacucho, restaurantes ayacucho, restaurantes en ayacucho, donde comer en ayacucho, mejor restaurante ayacucho, restaurante turistico ayacucho, puca picante ayacucho, cuy frito ayacucho, desayunos ayacucho, delivery ayacucho, reservas restaurante ayacucho",
      },
      {
        property: "og:title",
        content: "Restaurante Las Flores Ayacucho — Dónde Comer en Ayacucho",
      },
      {
        property: "og:description",
        content:
          "Disfruta la verdadera gastronomía ayacuchana en Restaurante Las Flores. Ubicados en Jr. José Olaya 106, Huamanga — Ayacucho.",
      },
      {
        property: "og:image",
        content: "https://www.restaurantelasflores.com/images.png",
      },
      {
        name: "twitter:image",
        content: "https://www.restaurantelasflores.com/images.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.restaurantelasflores.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Restaurante Las Flores",
          alternateName: ["Las Flores Ayacucho", "Restaurante Turístico Las Flores"],
          url: "https://www.restaurantelasflores.com",
          logo: "https://www.restaurantelasflores.com/images.png",
          image: "https://www.restaurantelasflores.com/images.png",
          telephone: "+51980723422",
          priceRange: "S/ 30 - S/ 80",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jr. José Olaya 106",
            addressLocality: "Huamanga",
            addressRegion: "Ayacucho",
            postalCode: "05001",
            addressCountry: "PE",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -13.1628496,
            longitude: -74.2178801,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "07:00",
              closes: "17:30",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday", "Sunday"],
              opens: "07:00",
              closes: "18:00",
            },
          ],
          servesCuisine: [
            "Peruana",
            "Ayacuchana",
            "Tradicional",
            "Parrillas",
            "Desayunos",
            "Almuerzos",
            "Cenas",
          ],
          acceptsReservations: "True",
          hasMenu: "https://www.restaurantelasflores.com/carta",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.0",
            bestRating: "5",
            reviewCount: "1564",
          },
          sameAs: [
            "https://www.facebook.com/restaurantelasfloressac",
            "https://www.instagram.com/restaurantelasflores/",
            "https://www.tiktok.com/@lasfloresayacucho",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Cuál es el mejor lugar para comer en Ayacucho?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Restaurante Las Flores es uno de los mejores y más emblemáticos lugares para comer en Ayacucho. Ofrece gastronomía típica ayacuchana como Puca Picante, Cuy Frito, Mondongo y Parrillas en un ambiente tradicional en Jr. José Olaya 106, Huamanga.",
              },
            },
            {
              "@type": "Question",
              name: "¿Dónde tomar desayuno en Ayacucho?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "En Restaurante Las Flores servimos desayunos tradicionales ayacuchanos con pan chapla, queso ayacuchano, caldos tradicionales y café artesanal todos los días desde las 07:00 a.m.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cuáles son los platos típicos de Ayacucho?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Los platos típicos de Ayacucho incluyen el Puca Picante, Cuy Frito, Mondongo Ayacuchano, Pachamanca y Qapchi, todos preparados con insumos autóctonos en Restaurante Las Flores.",
              },
            },
            {
              "@type": "Question",
              name: "¿Qué restaurantes hay cerca de la Plaza de Armas de Ayacucho?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Restaurante Las Flores se encuentra en Jr. José Olaya 106, Huamanga — Ayacucho, a siete minutos de la Plaza Mayor.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

// ─── COMPONENTES ──────────────────────────────────────────────────────────────

// ─── PLATOS TÍPICOS — Nombre, ocasión y descripción siempre visibles bajo la foto ───

function PlatosTipicosGrid({
  platos,
}: {
  platos: { img: string; nombre: string; ocasion: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
      {platos.map((p) => (
        <article key={p.nombre} className="flex flex-col group">
          <div className="aspect-[5/4] overflow-hidden bg-black">
            <img
              src={p.img}
              alt={p.nombre}
              width={1000}
              height={800}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="pt-5">
            <span className="block text-chilca font-bold text-[0.6875rem] uppercase tracking-[0.25em] mb-2">
              {p.ocasion}
            </span>
            <h3 className="font-serif text-xl md:text-2xl leading-tight">{p.nombre}</h3>
            <p className="mt-2 text-sm text-piedra/80 leading-relaxed">{p.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

// ─── SECCIÓN FESTIVIDADES — Carrusel / Slider ───────────────────────────────────

function FestividadesSlider() {
  const cards = getFestividadesDestacadas(festividades);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
        {cards.map((fest) => (
          <Link
            key={fest.id}
            to="/festividades/$slug"
            params={{ slug: fest.slug }}
            className="group block text-left transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative isolate overflow-hidden min-h-[17.5rem] md:min-h-[22.5rem] lg:min-h-[25rem]">
              <FestividadVideo
                src={fest.video.card}
                poster={fest.video.poster}
                alt={fest.nombre}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 bg-ink/70 text-piedra text-[0.6875rem] uppercase tracking-[0.25em] px-3 py-1.5">
                {fest.fecha}
              </span>
            </div>
            <div className="pt-5">
              <h3 className="font-serif text-2xl md:text-3xl leading-tight">{fest.nombre}</h3>
              <span className="mt-4 inline-block border-b border-piedra pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-piedra transition-colors group-hover:border-chilca group-hover:text-chilca">
                Descubrir más
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── SECCIÓN LUGARES — Tarjetas grandes con flechas ───────────────────────

// Dónde quedó la lista de lugares al salir del inicio. Al volver atrás el slider se monta de nuevo y, sin esto,
// empezaría otra vez en la primera tarjeta. Vive fuera del componente para sobrevivir a la navegación, y una
// recarga completa de la página la reinicia.
let posicionGuardadaLugares = 0;

function LugaresSlider() {
  const listaRef = useRef<HTMLUListElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);
  // Indicación "Desliza para ver más" (solo celular): se oculta apenas la persona desliza.
  const [mostrarIndicacion, setMostrarIndicacion] = useState(posicionGuardadaLugares === 0);

  // Antes de pintar, vuelve a la tarjeta donde estaba la persona.
  useLayoutEffect(() => {
    const lista = listaRef.current;
    if (lista && posicionGuardadaLugares > 0) lista.scrollLeft = posicionGuardadaLugares;
  }, []);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;

    const actualizar = () => {
      posicionGuardadaLugares = lista.scrollLeft;
      setAlInicio(lista.scrollLeft <= 2);
      setAlFinal(lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 2);
    };
    actualizar();
    lista.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      lista.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, []);

  // Cada clic avanza una tarjeta completa (su ancho más el espacio entre tarjetas).
  const mover = (direccion: 1 | -1) => {
    const lista = listaRef.current;
    const primera = lista?.querySelector("li");
    if (!lista || !primera) return;

    const espacio = parseFloat(getComputedStyle(lista).columnGap) || 0;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lista.scrollBy({
      left: direccion * (primera.getBoundingClientRect().width + espacio),
      behavior: reducir ? "auto" : "smooth",
    });
  };

  const flecha =
    "lugares-slider__flecha absolute z-10 hidden h-[3.625rem] w-[3.625rem] items-center justify-center bg-[#f3f3f3] text-nogal shadow-sm transition-opacity duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-chilca disabled:pointer-events-none disabled:opacity-40 md:flex";

  return (
    <div
      role="region"
      aria-label="Lugares para visitar en Ayacucho"
      aria-roledescription="carrusel"
      className="lugares-slider relative"
    >
      {mostrarIndicacion && (
        <p
          className="mb-6 inline-flex items-center gap-1 text-sm text-nogal/65 md:hidden"
          style={{ marginInline: "var(--margen)" }}
        >
          Desliza para ver más <ChevronRight size={16} aria-hidden="true" />
        </p>
      )}

      <ul
        ref={listaRef}
        onScroll={() => setMostrarIndicacion(false)}
        className="lugares-slider__lista flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {lugares.map((lugar) => {
          const titulo = lugar.nombreLista ?? lugar.nombre;

          return (
            <li key={lugar.id} className="w-[78%] shrink-0 snap-start sm:w-[22rem] lg:w-[25.8rem]">
              <Link
                to="/destinos/$slug"
                params={{ slug: lugar.slug }}
                className="group flex h-full flex-col"
              >
                <div className="aspect-[413/502] overflow-hidden bg-nogal/10">
                  <img
                    src={lugar.imagenTarjeta ?? lugar.imagen}
                    style={lugar.posicionTarjeta ? { objectPosition: lugar.posicionTarjeta } : undefined}
                    alt={titulo}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-[1.875rem] font-serif text-[1.625rem] leading-tight text-balance">{titulo}</h3>
                <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-nogal/70">
                  {lugar.categoria}
                </p>
                <p className="mt-5 text-sm leading-[1.7] text-nogal/80">
                  {lugar.resumen ?? lugar.metaDescripcion}
                </p>
                <span className="mt-6">
                  <span className="inline-block border-b border-nogal pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.04em] transition-colors group-hover:border-cochinilla group-hover:text-cochinilla">
                    Descubrir más
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        aria-label="Destino anterior"
        disabled={alInicio}
        onClick={() => mover(-1)}
        className={`${flecha} lugares-slider__flecha--atras`}
      >
        <ArrowLeft size={26} strokeWidth={1.25} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Siguiente destino"
        disabled={alFinal}
        onClick={() => mover(1)}
        className={`${flecha} lugares-slider__flecha--adelante`}
      >
        <ArrowRight size={26} strokeWidth={1.25} aria-hidden="true" />
      </button>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenMenu = () => setIsMenuOpen(true);
    window.addEventListener("open_menu_modal", handleOpenMenu);
    return () => window.removeEventListener("open_menu_modal", handleOpenMenu);
  }, []);

  return (
    <div className="bg-piedra text-nogal font-sans selection:bg-chilca/30">
      {/* ── HEADER UNIFICADO ── */}
      <SiteHeader />

      {/* HERO — Recorrido cinemático en Video por Ayacucho */}
      <header className="relative h-screen w-full overflow-hidden bg-eucalipto">
        {/* Video con audio opcional (botón de parlante); sin opacidad para mostrar su calidad original */}
        <HeroVideo
          srcDesktop="/videos/hero/inicio-hero.mp4"
          srcMobile="/videos/hero/inicio-hero-mobile.mp4"
          poster="/videos/hero/inicio-hero-poster.webp"
          alt="Vista panorámica de Ayacucho"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60 pointer-events-none" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
          <h1 className="font-serif italic text-4xl sm:text-5xl md:text-[clamp(3rem,min(7vw,12vh),6rem)] text-piedra leading-[1.05] text-balance max-w-[20ch] animate-reveal [animation-delay:200ms]">
            Guardianes de la Cultura Ayacuchana
          </h1>
        </div>
      </header>

      {/* CULTURA Y TRADICIÓN */}
      <section className="retablo-section flex flex-col justify-center items-center w-full lg:min-h-screen overflow-x-hidden relative pt-6 pb-0 lg:items-center lg:pt-[2.3cm] lg:pb-[calc(min(2.5rem,3dvh)_+_4rem)]">
        <style>{`
          .retablo-content-shell {
            --retablo-content-bottom-inset: 1.25rem;
          }

          .retablo-content-stack {
            margin-bottom: calc(-1 * var(--retablo-content-bottom-inset));
          }

          .retablo-content-image {
            width: calc(100% - min(6cm, 4vw));
            max-width: 340px;
          }

          @media (min-width: 1024px) {
            .retablo-content-shell {
              --retablo-content-bottom-inset: 2.5rem;
            }
          }

          @media (min-width: 1024px) and (max-height: 850px) {
            .retablo-section .retablo-wrapper {
              height: min(900px, calc(100dvh - 10rem), 80dvh);
              min-height: min(700px, calc(100dvh - 10rem), 80dvh);
              width: min(calc(50vw - 40px), calc(min(calc(100dvh - 10rem), 80dvh) * 0.9));
            }

            .retablo-content-shell {
              --retablo-content-bottom-inset: -0.5rem;
              padding: clamp(0.5rem, 1.2dvh, 1rem);
            }

            .retablo-content-stack {
              gap: clamp(0.5rem, 1.5dvh, 1rem);
            }

            .retablo-content-narrative {
              gap: clamp(0.5rem, 1.2dvh, 0.75rem);
            }

          }

          @media (min-width: 1024px) and (min-height: 851px) and (max-height: 1400px) {
            .retablo-section .retablo-wrapper {
              height: min(900px, 74dvh);
              min-height: min(700px, 74dvh);
              width: min(calc(50vw - 40px), calc(74dvh * 0.9));
            }

            .retablo-content-shell {
              --retablo-content-bottom-inset: clamp(1rem, 2dvh, 1.5rem);
              padding: clamp(1rem, 2dvh, 1.5rem);
            }

            .retablo-content-stack,
            .retablo-content-narrative {
              gap: clamp(0.5rem, 1dvh, 1rem);
            }

          }

          @media (min-width: 1024px) and (max-height: 700px) {
            .retablo-content-shell {
              --retablo-content-bottom-inset: -0.5rem;
              padding: 0.375rem;
            }

            .retablo-content-stack,
            .retablo-content-narrative {
              gap: 0.25rem;
            }

            .retablo-content-narrative p {
              line-height: 1.35;
            }

          }

          @media (min-width: 1600px) {
            .retablo-content-stack {
              justify-content: center;
            }
          }

        `}</style>
        <div className="w-full px-6 pb-4 lg:pb-0 lg:absolute lg:inset-x-0 lg:top-[2.3cm] lg:z-10 lg:pointer-events-none">
          <div className="container-flores mx-auto">
            <span className="text-eucalipto font-medium uppercase tracking-[0.3em] text-xs block">
              Patrimonio cultural
            </span>
          </div>
        </div>
        <RetabloWrapper>
          {/* Narrativa e imagen dentro del panel */}
          <div className="retablo-content-shell min-h-0 flex flex-1 h-full flex-col p-5 lg:p-10">
            <div className="retablo-content-stack flex min-h-0 flex-1 flex-col items-center gap-4 lg:gap-5">
              {/* Bloque Narrativo */}
              <div className="retablo-content-narrative w-full shrink-0 flex flex-col gap-3 lg:gap-4 text-center">
                {/* Título Serif elegante */}
                <h2
                  className="font-serif font-light leading-[1.08] text-balance"
                  style={{
                    fontSize: "clamp(1.25rem, min(2.8vw, 3.5dvh), 2.5rem)",
                    color: "#2d1b15",
                    letterSpacing: "-0.01em",
                  }}
                >
                  El retablo ayacuchano
                </h2>

                {/* Separador ornamental */}
                <div
                  className="flex w-full items-center gap-2 justify-center my-0.5"
                  aria-hidden="true"
                >
                  <span className="block h-px flex-1 bg-[#8B4513]/40" />
                  <AyacuchoFlowerInline />
                  <span className="block h-px flex-1 bg-[#8B4513]/40" />
                </div>

                {/* Cuerpo de texto */}
                <p
                  className="font-sans font-light leading-[1.65] text-pretty"
                  style={{
                    fontSize: "clamp(0.75rem, min(1.05vw, 2dvh), 0.95rem)",
                    color: "#3d2010",
                  }}
                >
                  Esta capilla portátil de dos puertas, elaborada a mano, reúne santos y escenas de
                  la vida del campo. En Las Flores compartimos esta expresión artesanal, parte de
                  la memoria cultural ayacuchana.
                </p>
              </div>

              {/* Imagen ampliada debajo de todo el texto, con su pie de foto pegado debajo */}
              <div className="retablo-content-figure my-auto flex min-h-0 w-full flex-col items-center gap-1">
                <div className="retablo-content-image mx-auto my-auto aspect-[4/3] min-h-[4.5rem]">
                  <div className="retablo-photo-frame relative h-full border-x-[6px] border-t-[6px] border-b-[10px] border-[#8f1d35] p-[3px] shadow-md">
                    <div className="relative h-full w-full overflow-hidden border border-[#d4a373]">
                      <img
                        src={retabloImg}
                        alt="Joaquín López Antay, maestro del retablo ayacuchano, en una fotografía en blanco y negro"
                        width={600}
                        height={750}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 z-10 w-full max-w-none aspect-[4/3] object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Pie de foto: fuera del cuadro de la imagen y dentro del retablo */}
                <p
                  className="retablo-content-caption w-full shrink-0 text-center font-sans text-[0.6875rem] leading-snug sm:text-[0.6875rem]"
                  style={{ color: "#3d2010" }}
                >
                  Joaquín López Antay (1897-1981), maestro del retablo ayacuchano
                </p>
              </div>
            </div>
          </div>
        </RetabloWrapper>
      </section>

      {/* FESTIVIDADES DE HUAMANGA */}
      <section
        id="festividades-de-huamanga"
        className="mt-4 md:mt-0 py-16 md:py-32 px-6 bg-eucalipto text-piedra"
      >
        <div className="container-flores mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
              Festividades de nuestra tierra
            </h2>
            <p className="text-base text-piedra/70 leading-[1.7] max-w-[36ch] md:text-right">
              Descubre las principales festividades de Ayacucho y cuándo se celebran.
            </p>
          </div>
          <FestividadesSlider />
        </div>
      </section>

      {/* LUGARES PARA VISITAR */}
      <section id="lugares-para-visitar" className="overflow-hidden py-16 md:py-32 bg-piedra">
        <div className="container-flores mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
              Lugares históricos y naturales de Ayacucho
            </h2>
          </div>
        </div>
        {/* Fuera del contenedor para que las tarjetas lleguen a los bordes de la pantalla al deslizar */}
        <LugaresSlider />
      </section>

      {/* FAUNA ANDINA */}
      <section>
        <div className="container-flores mx-auto px-6 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
            La fauna de los Andes
          </h2>
        </div>
        <FaunaAndina />
      </section>

      {/* TESOROS DE AYACUCHO */}
      <section className="relative bg-piedra py-16 md:py-28 px-6">
        {/* Foto grande a la izquierda y el texto a la derecha, centrado en vertical */}
        <div className="container-flores mx-auto grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-8">
            <div className="aspect-4/3 overflow-hidden md:aspect-[16/10]">
              <img
                src="/imagenes-reales/productosAyacucho/quinua.webp"
                alt="Granos de quinua en una pala de bambú, uno de los productos de temporada"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-nogal text-balance">
              Productos de temporada
            </h2>
            <p className="mt-5 text-base leading-[1.7] text-nogal/75">
              En la región de Ayacucho la temporada de cada producto se rige fundamentalmente por el
              calendario andino de lluvias y de meses secos. Por eso la cocina ayacuchana tiene una
              variedad propia de platos típicos.
            </p>
            <Link
              to="/tesoros-ayacucho"
              className="mt-8 inline-flex items-center gap-3 px-8 py-4 text-[0.6875rem] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
            >
              <span>Ver los productos por estación</span> <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PLATOS TÍPICOS */}
      <section className="platos-section py-12 md:py-12 px-6 bg-eucalipto text-piedra selection:bg-chilca/30 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
        <div className="container-flores mx-auto w-full">
          <div className="mb-16 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-balance max-w-[24ch]">
              Platos típicos
            </h2>
            <p className="text-base text-piedra/70 leading-[1.7] max-w-[36ch] md:text-right">
              La gastronomía de Ayacucho mezcla la cocina andina con la herencia española de la
              Colonia.
            </p>
          </div>
          {(() => {
            const PLATOS = [
              {
                img: "/imagenes-reales/seccion-gastronomia/puca-picante.webp",
                nombre: "Puca Picante",
                ocasion: "Celebración tradicional",
                desc: "Puca significa rojo en quechua. Es un guiso de intenso color rojo. Lleva papa, maní tostado, betarraga y chicharrón de cerdo.",
              },
              {
                img: "/imagenes-reales/seccion-gastronomia/mondongo ayacuchano.webp",
                nombre: "Mondongo Ayacuchano",
                ocasion: "Mañanas de domingo",
                desc: "Es un caldo de maíz mote con carnes y panza. Lleva hierbabuena.",
              },
              {
                img: "/imagenes-reales/seccion-gastronomia/cuy-frito-ayacuchano.webp",
                nombre: "Cuy Frito Ayacuchano",
                ocasion: "Celebración tradicional",
                desc: "Es un plato crujiente hecho con cuy. El consumo de este animal andino se remonta a la época prehispánica.",
              },
              {
                img: "/imagenes-reales/seccion-gastronomia/chorizo-ayacuchano.webp",
                nombre: "Chorizo Ayacuchano",
                ocasion: "Semana Santa",
                desc: "Es carne de cerdo finamente picada y macerada en ají panca. Se sirve sin embutir.",
              },
            ];
            return <PlatosTipicosGrid platos={PLATOS} />;
          })()}
        </div>
      </section>

      {/* PREMIOS */}
      <section className="py-16 md:py-28 px-6">
        {/* Foto grande a la derecha y el texto a la izquierda, centrado en vertical */}
        <div className="container-flores mx-auto grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-5">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-balance mb-5">
              Reconocimientos
            </h2>
            <p className="text-base md:text-lg text-nogal/70 leading-[1.7] max-w-[46ch]">
              Una muestra de los reconocimientos otorgados a Las Flores.
            </p>
            <ul className="space-y-6 max-w-md mt-8">
              <li className="flex items-start gap-5 w-full">
                <span className="w-px h-10 bg-cochinilla shrink-0 mt-1" />
                <div className="w-full">
                  <h4 className="font-serif text-xl font-semibold mb-0.5">
                    Mejor Restaurante Regional
                  </h4>
                  <div className="flex items-start justify-between gap-4 w-full min-w-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-10 h-10 flex-none text-nogal/70"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 2v6h6"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Documento en PDF</div>
                      <div className="text-xs text-nogal/50">
                        Municipalidad distrital de Andres Avelino Cáceres Dorregaray
                      </div>
                    </div>
                    <a
                      href="/docs/resolucion_andres_avelino.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center justify-center flex-none w-36 h-10 bg-cochinilla hover:bg-cochinilla/90 transition-colors text-piedra rounded-md text-sm text-center"
                    >
                      Ver documento
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-5 w-full">
                <span className="w-px h-10 bg-cochinilla shrink-0 mt-1" />
                <div className="w-full">
                  <h4 className="font-serif text-xl font-semibold mb-0.5">
                    Guardianes de la Cultura
                  </h4>
                  <div className="flex items-start justify-between gap-4 w-full min-w-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-10 h-10 flex-none text-nogal/70"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 2v6h6"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Documento en PDF</div>
                      <div className="text-xs text-nogal/50">Camara de Comercio</div>
                    </div>
                    <a
                      href="/docs/documento_camara_comercio.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center justify-center flex-none w-36 h-10 bg-cochinilla hover:bg-cochinilla/90 transition-colors text-piedra rounded-md text-sm text-center"
                    >
                      Ver documento
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-5 w-full">
                <span className="w-px h-10 bg-cochinilla shrink-0 mt-1" />
                <div className="w-full">
                  <h4 className="font-serif text-xl font-semibold mb-0.5">Excelencia Sanitaria</h4>
                  <div className="flex items-start justify-between gap-4 w-full min-w-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-10 h-10 flex-none text-nogal/70"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 2v6h6"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Documento en PDF</div>
                      <div className="text-xs text-nogal/50">
                        Municipalidad distrital de Andres Avelino Cáceres Dorregaray
                      </div>
                    </div>
                    <a
                      href="/docs/Resolucion_andres_avelino_caceres.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center justify-center flex-none w-36 h-10 bg-cochinilla hover:bg-cochinilla/90 transition-colors text-piedra rounded-md text-sm text-center"
                    >
                      Ver documento
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="order-first md:order-none md:col-span-7">
            <img
              src="/imagenes-reales/premios-restaurante/premios.webp"
              alt="Entrega de un premio a Restaurante Las Flores"
              width={1600}
              height={1066}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[3/2] object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative w-full">
        <img
          src={ayacuchoHero}
          alt="Vista aérea de la Plaza de Armas de Ayacucho al atardecer"
          width={1920}
          height={800}
          loading="lazy"
          decoding="async"
          className="w-full h-[70vh] md:h-[45rem] object-cover"
        />
        <div className="absolute inset-0 bg-cafe/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-piedra/70 uppercase tracking-[0.35em] text-xs block mb-6">
            Te esperamos en Las Flores
          </span>
          <h2 className="font-serif italic text-piedra text-4xl md:text-6xl max-w-[24ch] leading-tight text-balance">
            De esta tierra nace Las Flores
          </h2>
          <p className="mt-6 max-w-[40ch] text-piedra/80 text-sm md:text-base leading-relaxed">
            Desde 1980 servimos cocina ayacuchana a siete minutos de la Plaza Mayor.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/reservas"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-transparent text-[0.6875rem] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
            >
              <span>Reserva tu Mesa</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-piedra/30 text-piedra text-[0.6875rem] uppercase tracking-[0.25em] font-bold hover:bg-piedra/10 transition-colors rounded-sm cursor-pointer"
            >
              Pide por Delivery
            </button>
          </div>
        </div>
      </section>

      <MenuModal open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SiteFooter />
    </div>
  );
}
