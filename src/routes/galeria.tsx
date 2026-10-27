import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/SiteHeader";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { MobileCategoryFilter } from "@/components/MobileCategoryFilter";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galería | Restaurante Las Flores Ayacucho" },
      {
        name: "description",
        content:
          "Galería fotográfica del Restaurante Las Flores en Ayacucho. Descubre nuestros platos, ambiente y momentos especiales.",
      },
      {
        name: "keywords",
        content:
          "galeria restaurante las flores, fotos restaurante ayacucho, ambiente restaurante ayacucho, platos tipicos ayacucho fotos, arte y cultura ayacuchana",
      },
      { property: "og:title", content: "Galería | Restaurante Las Flores Ayacucho" },
      {
        property: "og:description",
        content: "Descubre nuestros platos, ambiente y momentos especiales en fotos del Restaurante Las Flores en Ayacucho.",
      },
      { property: "og:image", content: "https://www.restaurantelasflores.com/images.png" },
      { property: "og:url", content: "https://www.restaurantelasflores.com/galeria" },
      { property: "og:type", content: "website" },
      { name: "twitter:image", content: "https://www.restaurantelasflores.com/images.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.restaurantelasflores.com/galeria" }],
  }),
  component: GaleriaPage,
});

type GalleryImage = {
  src: string;
  titulo: string;
};

type Category = {
  id: string;
  label: string;
  images: GalleryImage[];
};

const foto = (carpeta: string, archivo: string, titulo: string): GalleryImage => ({
  src: `/imagenes-reales/galeria/${carpeta}/${archivo}.webp`,
  titulo,
});

const GALLERY_CATEGORIES: Category[] = [
  {
    id: "arte-cultura",
    label: "Arte y Cultura",
    images: [
      foto("arte-cultura", "textil-uno", "Pollera ayacuchana"),
      foto("arte-cultura", "textil-dos", "Chaqueta con bordado ayacuchano"),
      foto("arte-cultura", "textil-tres", "Llavero con bordado ayacuchano"),
      foto("arte-cultura", "ceramica-uno", "Proceso de modelado a mano de la cerámica tradicional de Quinua"),
      foto("arte-cultura", "ceramica-dos", "Personajes costumbristas de la cerámica de Quinua"),
      foto("arte-cultura", "ceramica-tres", "Iglesia de cerámica de Quinua"),
      foto("arte-cultura", "ceramica-cuatro", "Músicos de cerámica tradicional de Quinua"),
      foto("arte-cultura", "retablo-uno", "Casa Museo Joaquín López Antay"),
      foto("arte-cultura", "retablo-tres", "Retablos Ayacuchanos tradicionales"),
      foto("arte-cultura", "piedra-huamanga-uno", "Tallado en piedra de Huamanga"),
      foto("arte-cultura", "piedra-huamanga-tres", "El descendimiento de la cruz tallado en piedra de Huamanga"),
      foto("arte-cultura", "piedra-huamanga-cuatro", "Obelisco de la Pampa de Ayacucho talladas en piedra de Huamanga"),
      foto("arte-cultura", "cereria-uno", "Maestro Cirilo Gálvez Ramos"),
      foto("arte-cultura", "cereria-dos", "Cerería tradicional ayacuchana"),
      foto("arte-cultura", "cereria-tres", "Virgen de los Dolores"),
      foto("arte-cultura", "telar-uno", "Maestro tejedor Marcelino Pomataylla Bautista"),
      foto("arte-cultura", "telar-dos", "Tapiz ayacuchano"),
      foto("arte-cultura", "orfebreria-uno", "Flor de orfebrería"),
      foto("arte-cultura", "orfebreria-dos", "Colibrí de orfebrería"),
    ],
  },
  {
    id: "festividades",
    label: "Festividades",
    images: [
      foto("festividades", "carnaval-uno", "Carnaval Ayacuchano"),
      foto("festividades", "carnaval-tres", "Carnaval de Culluchaca"),
      foto("festividades", "semana-santa-dos", "Miércoles de Encuentro de la Semana Santa de Ayacucho"),
      foto("festividades", "semana-santa-tres", "Alfombras florales de Semana Santa"),
      foto("festividades", "hatun-yacu-raymi-uno", "Hatun Yaku Raymi"),
      foto("festividades", "hatun-yacu-raymi-dos", "Danza de las Tijeras"),
      foto("festividades", "vilcas-raymi-uno", "Plaza principal de Vilcashuamán"),
      foto("festividades", "vilcas-raymi-dos", "Escenificación del Vilcas Raymi"),
      foto("festividades", "chaccu-uno", "Chaccu de vicuñas"),
      foto("festividades", "chaccu-dos", "Ceremonia del chaccu"),
    ],
  },
  {
    id: "destino",
    label: "Destino",
    images: [
      foto("destino", "Cañon2", "Cañones de Qorihuillca"),
      foto("destino", "Arco1", "Jirón 28 de Julio"),
      foto("destino", "Arco2", "Arco del Triunfo"),
      foto("destino", "Catedral1", "Basílica Catedral iluminada"),
      foto("destino", "Catedral2", "Retablos de pan de oro"),
      foto("destino", "Plaza1", "Plaza Mayor de Huamanga"),
      foto("destino", "Plaza2", "Monumento ecuestre al Mariscal Antonio José de Sucre"),
      foto("destino", "Pullas2", "Puyas de Raimondi"),
      foto("destino", "Acuchimay1", "Mirador de Acuchimay"),
      foto("destino", "Quinua2", "Obelisco de la Pampa de Ayacucho"),
      foto("destino", "Vilcas1", "Ushnu de Vilcashuamán"),
      foto("destino", "Vilcas2", "Intihuatana de Pomacochas"),
      foto("destino", "Turquesa1", "Aguas turquesas de Millpu"),
      foto("destino", "Cascadas1", "Cascadas de Ruqruqa"),
      foto("destino", "Cascadas2", "Cascadas de Sarhua"),
      foto("destino", "Iglesia2", "Templo y Convento de San Francisco de Asís"),
    ],
  },
  {
    id: "postres-bebidas",
    label: "Postres y Bebidas",
    images: [
      foto("postres-bebidas", "chicha-uno", "Chicha de molle"),
      foto("postres-bebidas", "chicha-dos", "Chicha de jora"),
      foto("postres-bebidas", "chicha-cinco", "Mazamorra de llipta"),
      foto("postres-bebidas", "panes-dos", "Pan chapla"),
      foto("postres-bebidas", "wawa-uno", "Tanta wawa"),
      foto("postres-bebidas", "galleta-tres", "Suspiros ayacuchanos"),
      foto("postres-bebidas", "galleta-cuatro", "Rosquitas de manteca"),
    ],
  },
  {
    id: "experiencia",
    label: "Experiencia",
    images: [
      foto("eventos", "evento-09", "Ceremonia de apertura"),
      foto("eventos", "evento-08", "Equipo de cocina de Las Flores"),
      foto("eventos", "evento-16", "Chicharrón Ayacuchano"),
      foto("eventos", "evento-20", "Chef nacional Virgilio Martínez"),
    ],
  },
];

function GaleriaPage() {
  const [activeCategory, setActiveCategory] = useState<string>("arte-cultura");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentCategory = GALLERY_CATEGORIES.find((cat) => cat.id === activeCategory);
  const images = currentCategory?.images ?? [];

  const openImage = (idx: number) => setSelectedIndex(idx);
  const closeImage = () => setSelectedIndex(null);
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  };
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((i) => (i !== null ? (i + 1) % images.length : null));
  };

  return (
    <div className="min-h-screen bg-piedra flex flex-col">
      {/* ── HEADER UNIFICADO ── */}
      <SiteHeader />

      {/* Header Banner */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-24 px-6 bg-eucalipto-dark text-piedra overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imagenes-reales/seccion-festividades/Festividades.webp"
            alt="Festividades Las Flores"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-65 filter brightness-105 saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-black/30" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-chilca font-medium uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2">
            <Sparkles size={14} />
            Nuestra Galería · Momentos que inspiran
            <Sparkles size={14} />
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-piedra font-normal leading-tight">
            Galería de Momentos
          </h1>
          <p className="text-base md:text-lg text-piedra/90 max-w-3xl mx-auto leading-relaxed">
            Descubre a través de imágenes la esencia de nuestro restaurante, nuestra cultura ayacuchana y los sabores que nos definen.
          </p>
        </div>
      </section>

      {/* ── FILTROS MÓVIL: sticky pegado al header (solo < lg) ── */}
      <div className="block lg:hidden sticky top-[56px] z-30 w-full bg-[#F9F8F3] border-b border-gray-200 shadow-sm">
        <div className="container-flores mx-auto pl-6">
          <MobileCategoryFilter
            categories={GALLERY_CATEGORIES.map((cat) => ({ key: cat.id, label: cat.label }))}
            activeKey={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container-flores mx-auto px-6 py-12">
        {/* ── FILTROS DESKTOP: centrados dentro del contenido (solo lg+) ── */}
        <div className="hidden lg:flex justify-center gap-3 mb-12">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#2D473C] text-[#D4AF37] shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategory?.images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openImage(idx)}
              className="relative aspect-[3/4] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={img.src}
                alt={img.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Borde interno delgado */}
              <div className="absolute inset-3 border border-white/40 pointer-events-none" />
              <span className="absolute right-6 top-6 max-w-[calc(100%-3rem)] rounded-md bg-eucalipto-dark/95 px-3.5 py-2 text-right text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-piedra shadow-md pointer-events-none">
                {img.titulo}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          {/* Cerrar */}
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-piedra transition-colors z-10"
            aria-label="Cerrar"
          >
            ×
          </button>

          {/* Contador */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-widest">
            {selectedIndex + 1} / {images.length}
          </span>

          {/* Flecha izquierda */}
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/60 rounded-full p-2"
            aria-label="Anterior"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Imagen */}
          <figure className="flex max-h-full max-w-full flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selectedIndex].src}
              alt={images[selectedIndex].titulo}
              className="max-w-full max-h-[calc(100vh-7rem)] object-contain"
            />
            <figcaption className="font-serif text-lg text-white/90 text-center">
              {images[selectedIndex].titulo}
            </figcaption>
          </figure>

          {/* Flecha derecha */}
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/60 rounded-full p-2"
            aria-label="Siguiente"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
