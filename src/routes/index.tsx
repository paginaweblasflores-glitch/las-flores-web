import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, MapPin, ChefHat, Info, ArrowRight, ArrowRightCircle } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { useState, useEffect, useRef } from "react";
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
                text: "Restaurante Las Flores se encuentra ubicado a pocas cuadras del centro histórico en Jr. José Olaya 106, Huamanga — Ayacucho.",
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

// ─── PLATOS TÍPICOS — Tap-to-reveal en móvil ─────────────────────────────────

function PlatosTipicosGrid({
  platos,
}: {
  platos: { img: string; nombre: string; desc: string }[];
}) {
  const [activeNombre, setActiveNombre] = useState<string | null>(null);

  const handleCardClick = (nombre: string) => {
    setActiveNombre((prev) => (prev === nombre ? null : nombre));
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      onTouchStart={(e) => {
        // Si el toque fue fuera de un card, cierra el activo
        if (!(e.target as Element).closest(".dish-card-hover")) {
          setActiveNombre(null);
        }
      }}
    >
      {platos.map((p) => {
        const isActive = activeNombre === p.nombre;
        return (
          <article key={p.nombre} className="flex flex-col group">
            <div
              className={`dish-card-hover aspect-[5/4] bg-black${isActive ? " dish-card-active" : ""}`}
              onClick={() => handleCardClick(p.nombre)}
            >
              {/* la foto y su sombreado van juntos: así el sombreado la cubre entera, sin líneas ni parpadeo */}
              <div className="dish-card-media">
                <img
                  src={p.img}
                  alt={p.nombre}
                  width={1000}
                  height={800}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="dish-card-overlay">
                <span className="text-chilca font-bold text-[10px] uppercase tracking-[0.25em] mb-1">
                  Plato Tradicional
                </span>
                <h4 className="font-serif text-lg font-bold text-piedra mb-1">{p.nombre}</h4>
                <p className="text-xs text-piedra/80 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          </article>
        );
      })}
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
            <div className="relative isolate overflow-hidden min-h-[280px] md:min-h-[360px] lg:min-h-[400px]">
              <FestividadVideo
                src={fest.video.card}
                poster={fest.video.poster}
                alt={fest.nombre}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 bg-ink/70 text-piedra text-[10px] uppercase tracking-[0.25em] px-3 py-1.5">
                {fest.fecha}
              </span>
            </div>
            <div className="pt-5">
              <h3 className="font-serif text-2xl md:text-3xl leading-tight">{fest.nombre}</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-semibold text-piedra underline underline-offset-4">
                Descubrir <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── SECCIÓN LUGARES — Acordeón Expandible ───────────────────────────────────

function LugaresAccordion() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number>(lugares[0].id);
  const [isMobile, setIsMobile] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const bestEntry = visible.reduce((best, current) =>
          current.intersectionRatio > best.intersectionRatio ? current : best,
        );

        const id = Number(bestEntry.target.getAttribute("data-lugar-id"));
        if (!Number.isNaN(id)) {
          setActiveId(id);
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0.5,
      },
    );

    itemRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div className="flex flex-col md:flex-row h-[820px] md:h-[500px] w-full gap-3 md:gap-5 overflow-hidden">
      {lugares.map((lugar, i) => {
        // Nombre general de cada destino (dentro de cada página hay más de un lugar).
        const titulo = lugar.nombreLista ?? lugar.nombre;
        const isExpanded = isMobile
          ? lugar.id === activeId
          : hovered === null
            ? i === 0
            : hovered === lugar.id;

        return (
          <div
            key={lugar.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-lugar-id={lugar.id}
            onMouseEnter={() => setHovered(lugar.id)}
            className={`relative overflow-hidden transition-all duration-500 ease-out shadow-sm group ${
              isExpanded ? "flex-[4] md:flex-[5]" : "flex-[1]"
            }`}
          >
            <Link
              to="/destinos/$slug"
              params={{ slug: lugar.slug }}
              onClick={() => setActiveId(lugar.id)}
              className="absolute inset-0 block cursor-pointer"
            >
              <img
                src={lugar.imagen}
                alt={titulo}
                loading={isMobile && isExpanded ? "eager" : "lazy"}
                fetchPriority={isMobile && isExpanded ? "high" : "low"}
                decoding="async"
                width={1600}
                height={900}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              {/* Gradiente más oscuro abajo para que lea el texto */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${isExpanded ? "bg-gradient-to-t from-ink via-ink/20 to-transparent" : "bg-cafe/60 hover:bg-cafe/40"}`}
              />

              {/* Número Romano */}
              <div
                className={`absolute top-4 transition-all duration-700 z-20 ${isExpanded ? "right-5 md:right-8" : "left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0"}`}
              >
                <span
                  className={`font-serif text-piedra/40 select-none transition-all duration-700 ${isExpanded ? "text-4xl" : "text-xl md:text-2xl"}`}
                >
                  {lugar.numeral}
                </span>
              </div>

              {/* Contenido expandido */}
              <div
                className={`absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end transition-all duration-500 z-20 ${
                  isExpanded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <h3 className="font-serif text-piedra text-2xl md:text-4xl leading-tight mb-5">
                  {titulo}
                </h3>
                <span className="inline-flex items-center gap-2 self-start text-piedra text-[11px] uppercase tracking-[0.25em] font-bold bg-cochinilla hover:bg-cochinilla/90 transition-colors px-5 py-3">
                  Descubrir <ArrowRight size={14} />
                </span>
              </div>

              {/* Título para versión colapsada (Desktop) */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none hidden md:flex transition-opacity duration-500 z-10 ${
                  isExpanded ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="w-[440px] max-w-none shrink-0 text-center text-piedra font-serif text-xl leading-tight tracking-wider -rotate-90">
                  {titulo}
                </span>
              </div>

              {/* Título para versión colapsada (Mobile) */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none md:hidden transition-opacity duration-500 z-10 ${
                  isExpanded ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-piedra font-serif text-sm tracking-widest text-center px-4 drop-shadow-md">
                  {titulo}
                </span>
              </div>
            </Link>
          </div>
        );
      })}
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
                  Un retablo ayacuchano es una capilla portátil con dos puertas. Dentro hay santos y
                  escenas de la vida del campo, hechos a mano. En Las Flores damos a conocer el
                  retablo porque forma parte de nuestra historia.
                </p>
              </div>

              {/* Imagen ampliada debajo de todo el texto, con su pie de foto pegado debajo */}
              <div className="retablo-content-figure my-auto flex min-h-0 w-full flex-col items-center gap-1">
                <div className="retablo-content-image mx-auto my-auto aspect-[4/3] min-h-[72px]">
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
                  className="retablo-content-caption w-full shrink-0 text-center font-sans text-[10px] leading-snug sm:text-[11px]"
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
      <section id="festividades-de-huamanga" className="py-16 md:py-32 px-6 bg-eucalipto text-piedra">
        <div className="container-flores mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
              Festividades de nuestra tierra
            </h2>
            <p className="text-base text-piedra/70 leading-[1.7] max-w-[36ch] md:text-right">
              Descubre las principales festividades y cuándo se celebran.
            </p>
          </div>
          <FestividadesSlider />
        </div>
      </section>

      {/* LUGARES PARA VISITAR */}
      <section id="lugares-para-visitar" className="py-16 md:py-32 px-6 bg-piedra">
        <div className="container-flores mx-auto">
          <div className="mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
              Explora la belleza y lugares históricos de Ayacucho
            </h2>
          </div>
          {/* Acordeón expandible */}
          <LugaresAccordion />
        </div>
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
      <section className="relative bg-piedra py-16 md:py-32 px-6">
        <div className="container-flores mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="order-2 md:order-none md:col-span-5">
            <div className="relative aspect-4/3 overflow-hidden shadow-2xl">
              <img
                src="/imagenes-reales/secciones/quinoa.webp"
                alt="Cultivo de quinoa ayacuchana, uno de los tesoros de temporada"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-none md:col-span-6 md:col-start-7">
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-nogal text-balance mb-4">
              Productos de temporada
            </h2>
            <p className="text-base md:text-lg leading-[1.7] text-nogal/70 mb-8">
              En la región de Ayacucho la temporada de cada producto se rige fundamentalmente por
              el calendario andino de lluvias y de meses secos. Por eso la cocina ayacuchana tiene
              una variedad propia y muy rica de platos típicos.
            </p>
            <Link
              to="/tesoros-ayacucho"
              className="inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
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
                desc: "Emblemático guiso de intenso color rojo a base de papa, maní tostado, betarraga y chicharrón de cerdo. Un clásico de festividades y picanterías ayacuchanas.",
              },
              {
                img: "/imagenes-reales/seccion-gastronomia/mondongo ayacuchano.webp",
                nombre: "Mondongo Ayacuchano",
                desc: "Contundente caldo dominical preparado con maíz mote, carnes, panza y hierbabuena. Un reparador desayuno tradicional de la sierra.",
              },
              {
                img: "/imagenes-reales/seccion-gastronomia/cuy-frito-ayacuchano.webp",
                nombre: "Cuy Frito Ayacuchano",
                desc: "Plato crujiente y emblemático de la gastronomía andina. Una herencia culinaria prehispánica presente en celebraciones tradicionales.",
              },
              {
                img: "/imagenes-reales/seccion-gastronomia/chorizo-ayacuchano.webp",
                nombre: "Chorizo Ayacuchano",
                desc: "Carne de cerdo finamente picada y macerada en ají panca, servida sin embutir. Un manjar tradicional especialmente popular en Semana Santa.",
              },
            ];
            return <PlatosTipicosGrid platos={PLATOS} />;
          })()}
        </div>
      </section>

      {/* PREMIOS */}
      <section className="py-12 md:py-20 px-6">
        <div className="container-flores mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-[1.05] text-balance mb-5">
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
          <div className="md:col-span-5 md:col-start-8">
            <img
              src="/imagenes-reales/premios-restaurante/premios-las-flores.webp"
              alt="Premios de Restaurante Las Flores"
              width={1000}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-[360px] md:h-[460px] object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative w-full">
        <img
          src={ayacuchoHero}
          alt="Vista andina al atardecer"
          width={1920}
          height={800}
          loading="lazy"
          decoding="async"
          className="w-full h-[60vh] md:h-[600px] object-cover"
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
            Ven a compartir nuestra tradición en la mesa o disfruta los sabores de Ayacucho desde
            casa.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/reservas"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-transparent text-[11px] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
            >
              <span>Reserva tu Mesa</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-piedra/30 text-piedra text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-piedra/10 transition-colors rounded-sm cursor-pointer"
            >
              Pedir por Delivery
            </button>
          </div>
        </div>
      </section>

      <MenuModal open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SiteFooter />
    </div>
  );
}
