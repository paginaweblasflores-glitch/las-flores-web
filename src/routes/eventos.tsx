import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { sendEventQuoteEmail } from "@/lib/emailService";
const heroImg =
  "/imagenes-reales/hero-paginas/hero-eventos-opt.webp";
const casaImg = "/imagenes-reales/CARTA/02042026-DSC04401.webp";
const equipoImg = "/imagenes-reales/EQUIPO/02042026-DSC05038.webp";
const retabloImg =
  "/imagenes-reales/ARTE Y CULTURA LISTO/RETABLO AYACUCHANO/Retablo-Ayacuchano.webp";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRight,
  CalendarHeart,
  GlassWater,
  Users,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  User,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  X,
  MapPin,
  ShieldCheck,
  PhoneCall,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { SiteHeader } from '../components/SiteHeader';
import { useState, useTransition, useEffect } from 'react';
import { FestividadVideo } from "@/components/FestividadVideo";
import { MobileCategoryFilter } from "@/components/MobileCategoryFilter";

import { MenuModal } from "@/components/MenuModal";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos y Recepciones | Restaurante Las Flores" },
      {
        name: "description",
        content:
          "Celebre bodas, almuerzos de negocios y reuniones familiares en los exclusivos ambientes de Restaurante Las Flores en Ayacucho.",
      },
      {
        name: "keywords",
        content:
          "eventos ayacucho, salones para eventos ayacucho, local para bodas ayacucho, recepciones ayacucho, reuniones corporativas ayacucho, celebraciones familiares ayacucho, restaurante para eventos ayacucho",
      },
      { property: "og:title", content: "Eventos y Recepciones | Restaurante Las Flores" },
      {
        property: "og:description",
        content: "Celebre bodas, almuerzos de negocios y reuniones familiares en los exclusivos ambientes de Restaurante Las Flores en Ayacucho.",
      },
      { property: "og:image", content: "https://www.restaurantelasflores.com/inicio/eventos.webp" },
      { property: "og:url", content: "https://www.restaurantelasflores.com/eventos" },
      { property: "og:type", content: "website" },
      { name: "twitter:image", content: "https://www.restaurantelasflores.com/inicio/eventos.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.restaurantelasflores.com/eventos" }],
  }),
  component: EventosPage,
});

type EventSectionId = "familiares" | "corporativas" | "bodas";

// Clip corto en bucle, sin audio. Cada uno tiene su portada (poster) con el mismo nombre.
interface EventClip {
  video: string;
  poster: string;
  alt: string;
}

const CARPETA_CLIPS = "/imagenes-reales/eventos";
const clip = (nombre: string, alt: string): EventClip => ({
  video: `${CARPETA_CLIPS}/${nombre}.mp4`,
  poster: `${CARPETA_CLIPS}/${nombre}-poster.webp`,
  alt,
});

interface EventSectionData {
  id: EventSectionId;
  title: string;
  description: string;
  boton: string;
  // Ordenados de más a menos atractivo para quien decide: los dos primeros son lo que se ve al entrar.
  clips: EventClip[];
}

const EVENT_SECTIONS: EventSectionData[] = [
  {
    id: "familiares",
    title: "Celebraciones familiares",
    boton: "Cotizar mi celebración",
    description: "Desde cumpleaños hasta aniversarios, en Las Flores cada celebración es una excusa para estar juntos.",
    clips: [
      clip("familiares-3-danza-mesas", "Bailarina con vestimenta típica entre las mesas"),
      clip("familiares-12-cumple", "Postre con una vela y frutas sobre un plato con el mensaje de feliz cumpleaños"),
      clip("familiares-10-pan-crema", "Mujer untando crema en un pan sobre la mesa"),
      clip("familiares-1-baile-grupal", "Hombre cantando y tocando la guitarra, y comensales bailando entre las mesas del restaurante"),
    ]
  },
  {
    id: "corporativas",
    title: "Reuniones corporativas",
    boton: "Cotizar mi reunión",
    description: "El entorno perfecto para los negocios. Contamos con salones acondicionados para almuerzos ejecutivos, conferencias y cenas de gala empresariales, garantizando privacidad y distinción.",
    clips: [
      clip("corporativas-7-mesa", "Mesa larga de invitados con jugos y copas"),
      clip("corporativas-11-plato", "Plato servido con ají amarillo, lechuga y zanahoria"),
      clip("corporativas-8-danzante-tijeras", "Danzante de tijeras en el salón del restaurante"),
      clip("corporativas-6-baile", "Dos invitados bailando en el salón"),
    ]
  },
  {
    id: "bodas",
    title: "Bodas y recepciones",
    boton: "Cotizar mi recepción",
    description: "Haga de su día especial un momento inolvidable. Ofrecemos ambientes íntimos y majestuosos con un servicio impecable. Nuestras propuestas gastronómicas se diseñan a medida para usted y sus invitados.",
    clips: [
      clip("bodas-1-torta", "Torta de varios pisos con flores y el letrero luminoso de Las Flores"),
      clip("bodas-2-marinera", "Pareja con trajes típicos bailando marinera en el salón"),
      clip("bodas-3-bocaditos", "Tabla de frutas, quesos y frutos secos"),
      clip("bodas-4-vino", "Vino rosado servido en copas sobre una mesa puesta"),
    ]
  }
];

// Contenido de la categoría elegida: título, clips en cuadrícula (4 por fila en escritorio, 2 en tablet,
// deslizables en celular) y, al centro debajo de ellos, la descripción con el botón.
function EventoSeccion({ data, onCotizar }: { data: EventSectionData; onCotizar: () => void }) {
  // Indicación "Desliza para ver más" (solo celular): se oculta apenas la persona desliza.
  const [mostrarIndicacion, setMostrarIndicacion] = useState(true);
  return (
    <section id={data.id} className="bg-piedra text-nogal py-16 md:py-24 lg:pt-10 px-6 animate-in fade-in duration-500">
      <div className="container-flores mx-auto">
        {/* Primero el título y los clips: es lo que la gente mira antes de leer */}
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] text-balance">{data.title}</h2>

        {mostrarIndicacion && (
          <p className="mt-6 inline-flex items-center gap-1 text-sm text-nogal/65 md:hidden">
            Desliza para ver más <ChevronRight size={16} aria-hidden="true" />
          </p>
        )}

        <div
          onScroll={() => setMostrarIndicacion(false)}
          className="mt-4 -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
        >
          {data.clips.map((item) => (
            <div key={item.video} className="relative aspect-[9/16] w-full shrink-0 snap-start overflow-hidden bg-black md:w-auto">
              <FestividadVideo
                src={item.video}
                poster={item.poster}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Después, al centro: descripción y botón. En escritorio el texto ocupa el ancho de los dos clips del medio (del inicio del 2.º al final del 3.º) */}
        <div className="mx-auto mt-12 md:mt-14 flex max-w-[60ch] flex-col items-center text-center lg:w-[calc(50%-0.625rem)] lg:max-w-none">
          <p className="text-base md:text-lg leading-[1.7] text-nogal/70">{data.description}</p>
          <button
            onClick={onCotizar}
            className="mt-8 px-10 py-5 text-[0.6875rem] uppercase tracking-[0.25em] font-bold rounded-sm btn-yellow-hover"
          >
            {data.boton}
          </button>
        </div>
      </div>
    </section>
  );
}

function EventosPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenMenu = () => setIsMenuOpen(true);
    window.addEventListener("open_menu_modal", handleOpenMenu);
    return () => window.removeEventListener("open_menu_modal", handleOpenMenu);
  }, []);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  // Los tres botones de categoría muestran su sección; solo se ve la elegida.
  const [activeTab, setActiveTab] = useState<EventSectionId>(EVENT_SECTIONS[0].id);
  const seccionActual = EVENT_SECTIONS.find((sec) => sec.id === activeTab) ?? EVENT_SECTIONS[0];

  // Cerrar Drawer al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isContactOpen) {
        setIsContactOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isContactOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    const form = e.currentTarget;
    const name = (form.querySelector("#nombre") as HTMLInputElement)?.value || "";
    const email = (form.querySelector("#email") as HTMLInputElement)?.value || "";
    const phone = (form.querySelector("#telefono") as HTMLInputElement)?.value || "";
    const guestsInput = (form.querySelector("#invitados") as HTMLInputElement)?.value;
    const guests = guestsInput ? Number(guestsInput) : null;
    const event_type = (form.querySelector("#tipo") as HTMLSelectElement)?.value || "";
    const event_date = (form.querySelector("#fecha") as HTMLInputElement)?.value || null;
    const turno = (form.querySelector("#turno") as HTMLSelectElement)?.value || "";
    const rawMessage = (form.querySelector("#mensaje") as HTMLTextAreaElement)?.value || "";
    const message = turno ? `[Turno: ${turno}] ${rawMessage}` : rawMessage;

    try {
      const { error } = await supabase.from("event_quotes").insert([
        {
          name,
          email,
          phone,
          guest_count: guests,
          event_type,
          event_date,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.warn("Error al guardar cotización de evento en Supabase (event_quotes):", error);
        alert("Nota: Hubo un inconveniente al registrar la cotización en el servidor, pero hemos recibido tu solicitud.");
      }

      // Enviar notificación a contacto@restaurantelasflores.com
      sendEventQuoteEmail({ name, email, phone, guests, event_type, event_date, message }).catch((e) =>
        console.warn("Error al enviar correo de cotización de evento:", e)
      );

      setFormStatus("success");
    } catch (err: any) {
      console.warn("Excepción al solicitar cotización de evento en Supabase:", err);
      alert("Nota: Ocurrió un error inesperado, pero hemos procesado tu solicitud.");
      setFormStatus("success");
    }
  };

  return (
    <div className="bg-piedra text-nogal font-sans selection:bg-chilca/30">
      {/* ── HEADER UNIFICADO ── */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-[max(60vh,29rem)] flex items-center justify-center overflow-hidden bg-eucalipto pt-32 pb-24 px-6">
        <img
          src="/inicio/eventos.webp"
          alt="Eventos en Restaurante Las Flores Ayacucho"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-65 filter brightness-105 saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-black/30" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="font-serif text-4xl md:text-6xl text-piedra font-normal leading-tight">
            Celebra en Las Flores
          </h1>
          <p className="text-base md:text-lg text-piedra/90 max-w-3xl mx-auto leading-relaxed">
            Todo momento importante merece una buena mesa.
          </p>
        </div>

      </section>

      {/* ── BOTONES DE CATEGORÍA MÓVIL: sticky pegado al header (solo < lg) ── */}
      <div className="block lg:hidden sticky top-12 z-30 w-full bg-[#F9F8F3] border-b border-gray-200 shadow-sm">
        <div className="container-flores mx-auto pl-6">
          <MobileCategoryFilter
            categories={EVENT_SECTIONS.map((sec) => ({ key: sec.id, label: sec.title }))}
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key as EventSectionId)}
          />
        </div>
      </div>

      {/* ── BOTONES DE CATEGORÍA DESKTOP: centrados (solo lg+) ── */}
      <nav aria-label="Tipos de evento" className="hidden lg:block bg-piedra">
        <div className="container-flores mx-auto flex justify-center gap-3 px-6 pt-14">
          {EVENT_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              aria-pressed={activeTab === sec.id}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === sec.id
                  ? "bg-[#2D473C] text-[#D4AF37] shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Solo se muestra la categoría elegida; key para que al cambiar entre con un fundido suave */}
      <EventoSeccion key={seccionActual.id} data={seccionActual} onCotizar={() => setIsContactOpen(true)} />

      <SiteFooter />
      {isMenuOpen && <MenuModal open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}

      {/* Panel Lateral Emergente de Cotización */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center sm:items-end justify-end sm:justify-start p-3 sm:p-4 animate-in fade-in duration-300">
          {/* Overlay oscuro con blur que cierra al hacer clic fuera */}
          <div
            className="absolute inset-0 bg-[#2c4a3e]/75 backdrop-blur-sm cursor-pointer transition-opacity"
            onClick={() => setIsContactOpen(false)}
            aria-hidden="true"
          />

          {/* Tarjeta Panel Lateral */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="doc-legible relative z-10 w-full max-w-[26.25rem] bg-[#f8f4e6] text-nogal rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-black/10 flex flex-col shrink-0 h-[92dvh] sm:h-[calc(100dvh-32px)] animate-in slide-in-from-right duration-300"
          >
            {/* Header & Navbar Pinned Bar */}
            <div className="bg-white shrink-0 border-b border-black/10 shadow-xs z-20">
              <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5">
                <div className="w-8" />

                <img
                  src="/imagenes-reales/logo/logo-las-flores-black.webp"
                  alt="Logo Las Flores"
                  className="h-9 object-contain drop-shadow-sm scale-[1.25] origin-center"
                />

                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-nogal/70 hover:bg-black/5 transition-colors cursor-pointer"
                  title="Cerrar panel"
                >
                  <LogOut size={18} strokeWidth={1.5} className="rotate-180" />
                </button>
              </div>

              {/* Title Row / Tab Bar */}
              <div className="p-3">
                <div className="flex items-center justify-center py-2 px-3 bg-gray-100/90 rounded-2xl border border-black/5 text-center">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-nogal">
                    Cotizar Evento o Celebración
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {formStatus === "success" ? (
                <div className="py-12 text-center px-6 bg-white rounded-2xl border border-black/5 shadow-xs space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-lg text-nogal">
                      Solicitud Enviada con Éxito
                    </h4>
                    <p className="text-xs text-black/60 leading-relaxed">
                      Hemos recibido su información. Nuestro equipo se comunicará con usted a la brevedad para coordinar la propuesta.
                    </p>
                  </div>

                  <div className="pt-3 space-y-2">
                    <a
                      href="https://wa.me/51980723422?text=Hola%20Las%20Flores,%20acabo%20de%20enviar%20mi%20solicitud%20de%20cotizaci%C3%B3n%20para%20un%20evento.%20%C2%BFMe%20podr%C3%ADan%20brindar%20m%C3%A1s%20detalles?"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <PhoneCall size={14} />
                      <span>Conversar por WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsContactOpen(false);
                        setTimeout(() => setFormStatus("idle"), 400);
                      }}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-nogal text-xs font-bold rounded-xl transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="eventQuoteForm" className="space-y-3.5">
                  {/* Tarjeta WhatsApp Rápida */}
                  <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-nogal block">
                        ¿Atención directa?
                      </span>
                      <span className="text-[0.6875rem] text-black/50 block">
                        Escríbenos por WhatsApp
                      </span>
                    </div>
                    <a
                      href="https://wa.me/51980723422?text=Hola%20Las%20Flores,%20deseo%20cotizar%20un%20evento%20especial%20en%20sus%20salones.%20%C2%BFMe%20podr%C3%ADan%20compartir%20informaci%C3%B3n%20y%20men%C3%BAs?"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 bg-eucalipto hover:bg-eucalipto/90 text-piedra rounded-xl font-bold text-[0.6875rem] uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                    >
                      <PhoneCall size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Tarjeta 1: Datos de Contacto */}
                  <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-xs space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-black/50 block">
                      Datos de Contacto
                    </span>

                    <div className="space-y-1">
                      <label htmlFor="nombre" className="text-xs font-bold text-nogal block">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        required
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-eucalipto focus:bg-white transition-all"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="telefono" className="text-xs font-bold text-nogal block">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        required
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-eucalipto focus:bg-white transition-all"
                        placeholder="Ej. 987 654 321"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-xs font-bold text-nogal block">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-eucalipto focus:bg-white transition-all"
                        placeholder="juan@correo.com"
                      />
                    </div>
                  </div>

                  {/* Tarjeta 2: Detalles del Evento */}
                  <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-xs space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-black/50 block">
                      Detalles del Evento
                    </span>

                    <div className="space-y-1">
                      <label htmlFor="tipo" className="text-xs font-bold text-nogal block">
                        Tipo de Evento *
                      </label>
                      <select
                        id="tipo"
                        required
                        defaultValue=""
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-eucalipto focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="" disabled>Seleccione el tipo...</option>
                        <option value="bodas">Boda o recepción</option>
                        <option value="corporativo">Reunión corporativa o de empresa</option>
                        <option value="familiar">Celebración familiar o cumpleaños</option>
                        <option value="aniversario">Aniversario</option>
                        <option value="graduacion">Graduación o fiesta de promoción</option>
                        <option value="bautizo">Bautizo o primera comunión</option>
                        <option value="cena_privada">Cena privada</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label htmlFor="invitados" className="text-xs font-bold text-nogal block">
                          N.º de invitados *
                        </label>
                        <input
                          type="number"
                          id="invitados"
                          min="1"
                          required
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-eucalipto focus:bg-white transition-all"
                          placeholder="Ej. 50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="turno" className="text-xs font-bold text-nogal block">
                          Horario
                        </label>
                        <select
                          id="turno"
                          defaultValue="almuerzo"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-eucalipto focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="almuerzo">Almuerzo</option>
                          <option value="cena">Tarde o noche</option>
                          <option value="completo">Día completo</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="fecha" className="text-xs font-bold text-nogal block">
                        Fecha Deseada *
                      </label>
                      <input
                        type="date"
                        id="fecha"
                        required
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-eucalipto focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="mensaje" className="text-xs font-bold text-nogal block">
                        Detalles Adicionales
                      </label>
                      <textarea
                        id="mensaje"
                        rows={2}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-eucalipto focus:bg-white transition-all resize-none"
                        placeholder="Requerimientos de menú, sonido, etc."
                      ></textarea>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Bar con Volver y Botón Enviar */}
            <div className="p-4 bg-white border-t border-black/10 flex items-center justify-between shrink-0 shadow-lg">
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="flex items-center gap-2 text-xs font-bold text-nogal hover:text-black transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <ArrowLeft size={16} />
                </div>
                <span>Volver</span>
              </button>

              {formStatus !== "success" && (
                <button
                  type="submit"
                  form="eventQuoteForm"
                  disabled={formStatus === "submitting"}
                  className="py-2.5 px-5 rounded-xl bg-cochinilla text-piedra text-xs font-bold uppercase tracking-wider hover:bg-cochinilla/90 transition-all shadow-xs disabled:opacity-60 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  {formStatus === "submitting" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Solicitar Cotización</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
