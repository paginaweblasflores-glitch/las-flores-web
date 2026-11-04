import { createFileRoute, Link } from "@tanstack/react-router";
const equipoImg = "/imagenes-reales/EQUIPO/02042026-DSC04926.webp";
const casaImg = "/imagenes-reales/EQUIPO/Gregoria.webp";
const heroRestauranteImg = "/imagenes-reales/hero-paginas/hero-restaurante.webp";
const cocinaImg = "/imagenes-reales/EQUIPO/02042026-DSC05081-opt.webp";
import { SiteFooter } from "@/components/site-footer";
import { useState, useTransition, useEffect } from "react";
import { Calendar, CreditCard, ChevronRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { MenuModal } from "@/components/MenuModal";
import { MapaUbicacion } from "@/components/MapaUbicacion";
import { FestividadVideo } from "@/components/FestividadVideo";
import { FamiliaLasFloresSection } from "../components/FamiliaLasFloresSection";

export const Route = createFileRoute("/restaurante")({
  head: () => ({
    meta: [
      { title: "Nuestra Historia — Las Flores, El Mejor Restaurante en Ayacucho" },
      {
        name: "description",
        content:
          "Tres generaciones de tradición culinaria hacen de Las Flores el mejor restaurante en Ayacucho. Conoce nuestra historia, el equipo y la firma del chef.",
      },
      { property: "og:title", content: "Las Flores — El Mejor Restaurante en Ayacucho" },
      {
        property: "og:description",
        content:
          "Tres generaciones de tradición culinaria, nuestro equipo y las recomendaciones del chef: descubre la historia detrás del mejor restaurante en Ayacucho.",
      },
      {
        property: "og:image",
        content: new URL(casaImg, "https://www.restaurantelasflores.com").toString(),
      },
      {
        name: "twitter:image",
        content: new URL(casaImg, "https://www.restaurantelasflores.com").toString(),
      },
      { property: "og:url", content: "https://www.restaurantelasflores.com/restaurante" },
    ],
    links: [{ rel: "canonical", href: "https://www.restaurantelasflores.com/restaurante" }],
  }),
  component: RestaurantePage,
});

const VIDEO_GENERACIONES = "/imagenes-reales/tres-generaciones";

const VIDEOS_PLATOS = "/imagenes-reales/videos-de-platos";

// Descripciones tomadas de la carta
const chefRecommendations = [
  {
    name: "Puca Picante",
    description:
      "Guiso de papa en salsa de ají panca con maní tostado, carne de cerdo y especias, servido con arroz blanco, ensalada y chicharrón.",
    video: `${VIDEOS_PLATOS}/puca-picante.mp4`,
    poster: `${VIDEOS_PLATOS}/puca-picante-poster.webp`,
    alt: "Preparación y emplatado del Puca Picante",
  },
  {
    name: "Chicharrón Huamanguino",
    description:
      "Trozos de carne de cerdo dorados en su propia manteca, acompañados de papas sancochadas, qapchi, chips de camote y ensalada criolla.",
    video: `${VIDEOS_PLATOS}/chicharron-huamanguino.mp4`,
    poster: `${VIDEOS_PLATOS}/chicharron-huamanguino-poster.webp`,
    alt: "Preparación y emplatado del Chicharrón Huamanguino",
  },
  {
    name: "Cuy Las Flores",
    description:
      "Nuestro plato insignia, acompañado de papas nativas doradas, qapchi, choclo salteado en especias, ensalada criolla y chips de papas.",
    video: `${VIDEOS_PLATOS}/cuy-las-flores.mp4`,
    poster: `${VIDEOS_PLATOS}/cuy-las-flores-poster.webp`,
    alt: "Preparación y emplatado del Cuy Las Flores",
  },
  {
    name: "Chancho Asado Las Flores",
    description:
      "Carne de cerdo macerada en distintas especias, acompañada de pastel de papa, crema de pimentón, chips de camote y ensalada hawaiana.",
    video: `${VIDEOS_PLATOS}/chancho-asado.mp4`,
    poster: `${VIDEOS_PLATOS}/chancho-asado-poster.webp`,
    alt: "Preparación y emplatado del Chancho Asado Las Flores",
  },
];

const VIDEOS_CLIENTES = "/imagenes-reales/testimonios";

// Orden en pantalla: los archivos 1, 3, 4 y 2 (en ese orden).
const clientTestimonials = [1, 3, 4, 2].map((n, posicion) => ({
  video: `${VIDEOS_CLIENTES}/cliente-${n}.mp4`,
  poster: `${VIDEOS_CLIENTES}/cliente-${n}-poster.webp`,
  alt: `Testimonio ${posicion + 1} de un cliente de Restaurante Las Flores`,
}));

function GenerationsSection() {
  return (
    <section id="historia" className="bg-piedra pt-16 md:pt-20">
      <div className="container-flores mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] text-balance max-w-[24ch]">
          Tres generaciones al frente de Las Flores
        </h2>
        <p className="text-base md:text-lg text-nogal/70 leading-[1.7] text-balance max-w-[36ch] md:text-right">
          Hace 46 años nació Las Flores, y hoy sigue recibiendo a sus clientes con alma y amor.
        </p>
      </div>

      <div className="relative mt-8 md:mt-12 aspect-[4/3] md:aspect-video w-full overflow-hidden bg-black">
        <FestividadVideo
          src={`${VIDEO_GENERACIONES}/sr-gloria.mp4`}
          srcMobile={`${VIDEO_GENERACIONES}/sr-gloria-mobile.mp4`}
          poster={`${VIDEO_GENERACIONES}/sr-gloria-poster.webp`}
          alt="La señora Gloria cuenta cómo empezó Restaurante Las Flores, quién lo fundó y quién lo dirige hoy"
          conSonido
          posicionSonido="left-1/2 top-[86%] -translate-x-1/2 -translate-y-1/2"
          sonidoGrande
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

function ChefVideosSection() {
  return (
    <section className="bg-piedra py-16 md:py-20 px-6">
      <div className="container-flores mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] text-balance">
          Recomendaciones del chef
        </h2>

        <div className="mt-8 -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 md:gap-y-10">
          {chefRecommendations.map((plate) => (
            <article key={plate.name} className="w-[74%] shrink-0 snap-start md:w-auto">
              <div className="relative aspect-[9/16] overflow-hidden bg-black">
                <FestividadVideo
                  src={plate.video}
                  poster={plate.poster}
                  alt={plate.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-serif text-lg md:text-xl leading-tight">{plate.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nogal/70">{plate.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientVideosSection() {
  return (
    <section className="bg-eucalipto text-piedra py-16 md:py-20 px-6">
      <div className="container-flores mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] text-balance">
          Recomendado por quienes nos visitan
        </h2>

        <div className="mt-8 -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
          {clientTestimonials.map((t) => (
            <div key={t.video} className="relative aspect-[9/16] w-[74%] shrink-0 snap-start overflow-hidden bg-black md:w-auto">
              <FestividadVideo
                src={t.video}
                poster={t.poster}
                alt={t.alt}
                conSonido
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RestaurantePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleOpenMenu = () => setIsMenuOpen(true);
    window.addEventListener("open_menu_modal", handleOpenMenu);
    return () => window.removeEventListener("open_menu_modal", handleOpenMenu);
  }, []);

  return (
    <div className="bg-piedra text-nogal font-sans selection:bg-chilca/30">
      {/* ── HEADER UNIFICADO ── */}
      <SiteHeader
        showDelivery={true}
        onDeliveryClick={() => startTransition(() => setIsMenuOpen(true))}
      />

      <header
        id="historia"
        className="relative h-[max(60vh,29rem)] w-full overflow-hidden bg-eucalipto flex items-center pt-32 pb-24"
      >
        <img
          src={heroRestauranteImg}
          alt="Entrada de Restaurante Las Flores en Huamanga, Ayacucho"
          width={1920}
          fetchPriority="high"
          height={800}
          className="absolute inset-0 w-full h-full object-cover opacity-55 animate-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/90" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8 text-piedra">
          <div className="max-w-3xl text-center space-y-6">
            <h1 className="font-serif text-4xl md:text-6xl text-piedra font-normal leading-tight animate-reveal-left-to-right [animation-delay:200ms]">
              Bienvenido a Nuestra Casa
            </h1>
          </div>
        </div>
      </header>

      <GenerationsSection />

      {/* Familia Las Flores */}
      <section id="familia" className="bg-eucalipto text-piedra py-16 md:py-32 px-6">
        <div className="container-flores mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 max-w-none">
            <span className="text-chilca font-medium uppercase tracking-[0.3em] text-xs mb-6 block">
              Nuestra gente
            </span>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-balance mb-6">
              Familia Las Flores
            </h2>
            <p className="text-lg text-piedra/70 leading-[1.7] mb-8">
              Detrás de cada plato sabroso y cada sonrisa en la mesa hay hombres y mujeres
              ayacuchanos que trabajan con dignidad, pasión y profundo amor por nuestras raíces.
            </p>
            <Link
              to="/familia-las-flores"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center justify-center px-10 py-5 text-[0.6875rem] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
            >
              <span>CONOCE A LA FAMILIA</span>
            </Link>
          </div>
          <div className="flex-1 w-full flex justify-end">
            <div className="relative aspect-4/3 w-full max-w-[33.5rem] overflow-hidden shadow-2xl group">
              <img
                src="/inicio/Equipolasflores.webp"
                alt="Equipo humano de Restaurante Las Flores"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <ChefVideosSection />

      <ClientVideosSection />

      {/* CTA Reservas y Delivery */}
      <section id="reservas" className="bg-piedra text-nogal py-16 md:py-32 px-6">
        <div className="container-flores mx-auto grid items-center gap-10 md:grid-cols-[1fr_1.35fr] md:gap-16">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-8 text-balance">
              ¿Dónde nos encuentras?
            </h2>
            <p className="text-lg text-nogal/80 leading-[1.7] max-w-[52ch]">
              Estamos en Huamanga, Ayacucho. Nuestra dirección es el Jr. José Olaya 106, a siete minutos
              de la Plaza Mayor y a seis del aeropuerto Alfredo Mendívil Duarte. Atendemos de lunes a viernes de 7:00&nbsp;a.&nbsp;m.
              a 5:30&nbsp;p.&nbsp;m., y los sábados y domingos de 7:00&nbsp;a.&nbsp;m. a 6:00&nbsp;p.&nbsp;m.
            </p>
          </div>
          <MapaUbicacion />
        </div>
      </section>

      <SiteFooter />
      {isMenuOpen && <MenuModal open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </div>
  );
}
