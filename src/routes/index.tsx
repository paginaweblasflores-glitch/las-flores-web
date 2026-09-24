import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, MapPin, ChefHat, Info, ArrowRight, ArrowRightCircle } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { useState, useEffect, useRef } from "react";
const ayacuchoHero = "/imagenes-reales/premios/ayacucho.webp";
const culturaImg = "/imagenes-reales/ARTE Y CULTURA LISTO/CERAMICA/CERAMICA-AYACUCHANA.webp";
const retabloImg =
  "/imagenes-reales/ARTE Y CULTURA LISTO/RETABLO AYACUCHANO/LopezA.webp";
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
      { property: "og:title", content: "Restaurante Las Flores Ayacucho — Dónde Comer en Ayacucho" },
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
          "name": "Restaurante Las Flores",
          "alternateName": ["Las Flores Ayacucho", "Restaurante Turístico Las Flores"],
          "url": "https://www.restaurantelasflores.com",
          "logo": "https://www.restaurantelasflores.com/images.png",
          "image": "https://www.restaurantelasflores.com/images.png",
          "telephone": "+51980723422",
          "priceRange": "S/ 30 - S/ 80",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jr. José Olaya 106",
            "addressLocality": "Huamanga",
            "addressRegion": "Ayacucho",
            "postalCode": "05001",
            "addressCountry": "PE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -13.1628496,
            "longitude": -74.2178801
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "07:00",
              "closes": "17:30"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday", "Sunday"],
              "opens": "07:00",
              "closes": "18:00"
            }
          ],
          "servesCuisine": ["Peruana", "Ayacuchana", "Tradicional", "Parrillas", "Desayunos", "Almuerzos", "Cenas"],
          "acceptsReservations": "True",
          "hasMenu": "https://www.restaurantelasflores.com/carta",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.0",
            "bestRating": "5",
            "reviewCount": "1564"
          },
          "sameAs": [
            "https://www.facebook.com/restaurantelasfloressac",
            "https://www.instagram.com/restaurantelasflores/",
            "https://www.tiktok.com/@lasfloresayacucho"
          ]
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Cuál es el mejor lugar para comer en Ayacucho?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Restaurante Las Flores es uno de los mejores y más emblemáticos lugares para comer en Ayacucho. Ofrece gastronomía típica ayacuchana como Puca Picante, Cuy Frito, Mondongo y Parrillas en un ambiente tradicional en Jr. José Olaya 106, Huamanga."
              }
            },
            {
              "@type": "Question",
              "name": "¿Dónde tomar desayuno en Ayacucho?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "En Restaurante Las Flores servimos desayunos tradicionales ayacuchanos con pan chapla, queso ayacuchano, caldos tradicionales y café artesanal todos los días desde las 07:00 a.m."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cuáles son los platos típicos de Ayacucho?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Los platos típicos de Ayacucho incluyen el Puca Picante, Cuy Frito, Mondongo Ayacuchano, Pachamanca y Qapchi, todos preparados con insumos autóctonos en Restaurante Las Flores."
              }
            },
            {
              "@type": "Question",
              "name": "¿Qué restaurantes hay cerca de la Plaza de Armas de Ayacucho?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Restaurante Las Flores se encuentra ubicado a pocas cuadras del centro histórico en Jr. José Olaya 106, Huamanga — Ayacucho."
              }
            }
          ]
        }),
      },
    ],
  }),
  component: Index,
});

// ─── COMPONENTES ──────────────────────────────────────────────────────────────

// ─── PLATOS TÍPICOS — Tap-to-reveal en móvil ─────────────────────────────────

function PlatosTipicosGrid({ platos }: { platos: { img: string; nombre: string; desc: string }[] }) {
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
              className={`dish-card-hover aspect-[5/4] bg-cafe/40 rounded-lg${isActive ? " dish-card-active" : ""}`}
              onClick={() => handleCardClick(p.nombre)}
            >
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
              <img
                src={fest.imagen}
                alt={fest.nombre}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 bg-ink/70 text-piedra text-[10px] uppercase tracking-[0.25em] px-3 py-1.5">
                {fest.fecha}
              </span>
            </div>
            <div className="pt-5">
              <h3 className="font-serif text-2xl md:text-3xl leading-tight">{fest.nombre}</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-semibold text-nogal underline underline-offset-4">
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
          current.intersectionRatio > best.intersectionRatio ? current : best
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
      }
    );

    itemRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div className="flex flex-col md:flex-row h-[750px] md:h-[500px] w-full gap-3 md:gap-5 overflow-hidden">
      {lugares.map((lugar, i) => {
        const isExpanded = isMobile
          ? lugar.id === activeId
          : hovered === null
          ? i === 0
          : hovered === lugar.id;

        return (
          <div
            key={lugar.id}
            ref={(el) => { itemRefs.current[i] = el; }}
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
                alt={lugar.nombre}
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
                  {lugar.nombre}
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
                <span className="text-piedra font-serif text-xl tracking-wider whitespace-nowrap -rotate-90">
                  {lugar.nombre}
                </span>
              </div>

              {/* Título para versión colapsada (Mobile) */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none md:hidden transition-opacity duration-500 z-10 ${
                  isExpanded ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-piedra font-serif text-sm tracking-widest text-center px-4 drop-shadow-md">
                  {lugar.nombre}
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
        {/* Video cinemático de alta velocidad optimizado */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={ayacuchoHero}
          className="absolute inset-0 w-full h-full object-cover opacity-75 scale-[1.02] pointer-events-none"
        >
          <source src="/inicio/videoweb.mp4" type="video/mp4" />

          {/* Imagen de reserva si el navegador restringe video */}
          <img
            src={ayacuchoHero}
            alt="Vista panorámica de Ayacucho al atardecer"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink/90" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-chilca/90 uppercase tracking-[0.4em] text-xs md:text-sm mb-6 animate-reveal font-semibold">
            Huamanga · Perú
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-piedra leading-[1.05] text-balance max-w-[20ch] animate-reveal [animation-delay:200ms]">
            Guardianes de la Cultura Ayacuchana
          </h1>
          <p className="mt-8 max-w-[52ch] text-piedra/80 text-sm sm:text-base md:text-lg leading-[1.7] animate-reveal [animation-delay:400ms]">
            Treinta y tres iglesias, retablos que guardan siglos y calles donde la tradición
            respira. Nosotros no solo servimos comida, preservamos el alma de Ayacucho.
          </p>
          <Link
            to="/restaurante"
            className="mt-14 inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold animate-reveal [animation-delay:600ms] rounded-sm btn-yellow-hover"
          >
            <span>Nuestra Historia</span> <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-piedra/60 text-[10px] uppercase tracking-[0.4em]">
          Desliza
        </div>
      </header>

      {/* CULTURA Y TRADICIÓN */}
      <section className="flex justify-center items-center w-full lg:min-h-screen overflow-x-hidden relative py-16 lg:pt-6 lg:pb-12">
        <RetabloWrapper>
          {/* Layout Responsivo: Vertical en Móvil (<lg), Side-by-Side en Desktop (lg: >=1024px) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-5 lg:p-10 overflow-hidden">
            
            {/* Columna Izquierda: Foto del retablo */}
            <div className="lg:col-span-5 w-full max-w-[220px] lg:max-w-none mx-auto shrink-0">
              <div className="relative">
                <div
                  className="absolute -inset-2 z-0"
                  style={{
                    background: "linear-gradient(135deg, #5D2E0C 0%, #8B4513 50%, #5D2E0C 100%)",
                    boxShadow: "0 6px 20px rgba(93,46,12,0.5)",
                  }}
                />
                <img
                  src={retabloImg}
                  alt="Retablo ayacuchano tallado a mano con figuras policromadas"
                  width={600}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 w-full aspect-[4/5] object-cover shadow-lg"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,220,150,0.15)" }}
                />
              </div>
            </div>

            {/* Columna Derecha: Bloque Narrativo y CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-3 lg:gap-4 text-center lg:text-left">
              
              {/* Eyebrow label */}
              <span
                className="font-sans font-semibold uppercase tracking-[0.3em] text-[10px] lg:text-[11px]"
                style={{ color: "#8B4513" }}
              >
                Cultura y Tradición
              </span>

              {/* Título Serif elegante */}
              <h2
                className="font-serif font-light leading-[1.08] text-balance"
                style={{
                  fontSize: "clamp(1.5rem, 2.8vw, 2.5rem)",
                  color: "#2d1b15",
                  letterSpacing: "-0.01em",
                }}
              >
                El retablo, la <span className="italic">textilería</span> y el fogón
              </h2>

              {/* Separador ornamental */}
              <div className="flex items-center gap-2 justify-center lg:justify-start my-0.5" aria-hidden="true">
                <span className="block h-px w-8 bg-[#8B4513]/40" />
                <AyacuchoFlowerInline />
                <span className="block h-px w-8 bg-[#8B4513]/40" />
              </div>

              {/* Cuerpo de texto */}
              <p
                className="font-sans font-light leading-[1.65] text-pretty"
                style={{
                  fontSize: "clamp(0.8rem, 1.05vw, 0.95rem)",
                  color: "#3d2010",
                }}
              >
                En Ayacucho el arte y la comida comparten origen: manos que tallan
                retablos, tejen mantas y avivan el fogón con la misma paciencia.
                Cada grano de maíz morado, cada aroma a leña y cada textura de la
                piedra volcánica cuentan la historia de una tierra que se niega a
                olvidar su esencia.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-2">
                <a
                  href="/restaurante"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 font-sans font-semibold text-[10px] lg:text-[11px] uppercase tracking-[0.2em] transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #8B2500 0%, #C0392B 100%)",
                    color: "#fdf8f0",
                    boxShadow: "0 4px 14px rgba(139,37,0,0.35)",
                    border: "1px solid #6B1A00",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Descubrir la historia
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  href="/carta"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 font-sans font-semibold text-[10px] lg:text-[11px] uppercase tracking-[0.25em] transition-all duration-300"
                  style={{
                    background: "transparent",
                    color: "#5D2E0C",
                    border: "1px solid #8B4513",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#5D2E0C";
                    e.currentTarget.style.color = "#fdf8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#5D2E0C";
                  }}
                >
                  Ver el menú
                </a>
              </div>

            </div>

          </div>
        </RetabloWrapper>
      </section>

      {/* LUGARES PARA VISITAR */}
      <section id="lugares-para-visitar" className="py-16 md:py-32 px-6 bg-piedra">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-eucalipto font-medium uppercase tracking-[0.3em] text-xs mb-4 block">
                Lugares para Visitar
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[24ch]">
                Ayacucho más allá de la mesa
              </h2>
            </div>
            <p className="text-sm sm:text-base text-nogal/60 leading-[1.7] max-w-[36ch] md:text-right">
              Historia, naturaleza y arte vivo en cada rincón. Conoce la tierra que inspira nuestros
              sabores.
            </p>
          </div>
          {/* Acordeón expandible */}
          <LugaresAccordion />
        </div>
      </section>

      {/* FESTIVIDADES DE HUAMANGA */}
      <section id="festividades-de-huamanga" className="py-16 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-eucalipto font-medium uppercase tracking-[0.3em] text-xs mb-4 block">
                Festividades de Huamanga
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
                El calendario que da vida a nuestra cocina
              </h2>
            </div>
            <p className="text-base text-nogal/60 leading-[1.7] max-w-[36ch] md:text-right">
              Cada plato de Las Flores tiene una celebración detrás. Estas son las fiestas de
              nuestra tierra.
            </p>
          </div>
          <FestividadesSlider />
        </div>
      </section>

      {/* FAUNA ANDINA */}
      <section>
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <span className="text-eucalipto font-medium uppercase tracking-[0.3em] text-xs mb-4 block">
            Fauna Andina
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance max-w-[28ch]">
            La naturaleza que rodea nuestra mesa
          </h2>
        </div>
        <FaunaAndina />
      </section>

      {/* PLATOS TÍPICOS */}
      <section className="py-16 md:py-16 px-6 bg-cafe text-piedra selection:bg-chilca/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-8 max-w-3xl">
            <span className="text-chilca font-medium uppercase tracking-[0.3em] text-[10px] mb-4 block">
              Platos Típicos
            </span>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-balance">
              La despensa de la sierra en cuatro sabores
            </h2>
            <p className="mt-4 text-base text-piedra/70 leading-[1.6] max-w-2xl">
              Recetas que definen la identidad ayacuchana. El fruto del fogón y las festividades que
              atraviesan generaciones.
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

      {/* TESOROS DE AYACUCHO */}
      <section className="relative bg-eucalipto py-16 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="order-2 md:order-none md:col-span-5">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
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
            <span className="text-chilca font-medium uppercase tracking-[0.3em] text-xs mb-6 block">
              Tesoros de Ayacucho
            </span>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-piedra text-balance mb-4">
              Productos ayacuchanos de temporada
            </h2>
            <p className="text-base md:text-lg leading-[1.7] text-piedra/75 mb-8">
              Descubre los ingredientes autóctonos que dan vida a nuestra cocina: papa nativa,
              olluco, calabaza, romero, tuna y más. Cada temporada trae consigo los mejores
              productos de nuestra tierra, cosechados en su punto perfecto para ofrecerte el
              auténtico sabor de Ayacucho.
            </p>
            <Link
              to="/tesoros-ayacucho"
              className="inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
            >
              <span>Descubre Más</span> <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PREMIOS */}
      <section className="py-16 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <span className="text-eucalipto font-medium uppercase tracking-[0.3em] text-xs mb-6 block">
              Excelencia Reconocida
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-[1.05] text-balance mb-8">
              Reconocidos por nuestro compromiso con la calidad.
            </h2>
            <p className="text-base sm:text-lg leading-[1.7] text-pretty max-w-[48ch] text-nogal/75 mb-10">
              Ser el mejor restaurante de Ayacucho no es solo un título, es una responsabilidad.
              Estos galardones reflejan nuestro respeto inquebrantable por la herencia culinaria.
            </p>
            <ul className="space-y-6 max-w-md">
              <li className="flex items-start gap-5 w-full">
                <span className="w-px h-10 bg-cochinilla shrink-0 mt-1" />
                <div className="w-full">
                  <h4 className="font-serif text-xl font-semibold mb-0.5">
                    Mejor Restaurante Regional
                  </h4>
                  <div className="flex items-start justify-between gap-4 w-full min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 flex-none text-nogal/70" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2v6h6" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Documento en PDF</div>
                      <div className="text-xs text-nogal/50">Municipalidad distrital de Andres Avelino Cáceres Dorregaray</div>
                    </div>
                    <a href="/docs/resolucion_andres_avelino.pdf" target="_blank" rel="noopener noreferrer" className="self-start inline-flex items-center justify-center flex-none w-36 h-10 bg-eucalipto text-white rounded-md text-sm text-center">
                      Ver documento
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-5 w-full">
                <span className="w-px h-10 bg-cochinilla shrink-0 mt-1" />
                <div className="w-full">
                  <h4 className="font-serif text-xl font-semibold mb-0.5">
                    Guardianes de la Tradición
                  </h4>
                  <div className="flex items-start justify-between gap-4 w-full min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 flex-none text-nogal/70" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2v6h6" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Documento en PDF</div>
                      <div className="text-xs text-nogal/50">Camara de Comercio</div>
                    </div>
                    <a href="/docs/documento_camara_comercio.pdf" target="_blank" rel="noopener noreferrer" className="self-start inline-flex items-center justify-center flex-none w-36 h-10 bg-eucalipto text-white rounded-md text-sm text-center">
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 flex-none text-nogal/70" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2v6h6" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Documento en PDF</div>
                      <div className="text-xs text-nogal/50">Municipalidad distrital de Andres Avelino Cáceres Dorregaray</div>
                    </div>
                    <a href="/docs/Resolucion_andres_avelino_caceres.pdf" target="_blank" rel="noopener noreferrer" className="self-start inline-flex items-center justify-center flex-none w-36 h-10 bg-eucalipto text-white rounded-md text-sm text-center">
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
              width={800}
              height={1200}
              loading="lazy"
              decoding="async"
              className="w-full h-full min-h-[500px] md:min-h-[600px] object-cover rounded-3xl shadow-2xl border border-nogal/10"
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
        <div className="absolute inset-0 bg-cafe/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-piedra/70 uppercase tracking-[0.35em] text-xs block mb-6">
            Vive la Experiencia
          </span>
          <h2 className="font-serif italic text-piedra text-4xl md:text-6xl max-w-[24ch] leading-tight text-balance">
            De esta tierra nace Las Flores
          </h2>
          <p className="mt-6 max-w-[40ch] text-piedra/80 text-sm md:text-base leading-relaxed">
            Reserva una mesa en nuestro santuario de tradición o recibe el sabor de Ayacucho en tu
            hogar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/reservas"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 font-serif font-bold text-lg tracking-wide rounded-xl btn-yellow-hover"
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


