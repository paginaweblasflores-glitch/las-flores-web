import { useState } from "react";

interface EspecieFauna {
  nombre: string;
  quechua?: string;
  imagen: string;
  descripcion: string;
}

const ESPECIES: EspecieFauna[] = [
  {
    nombre: "Colibrí",
    quechua: "Q'enti",
    imagen: "/imagenes-reales/fauna/colibri.webp",
    descripcion:
      "Presente en los valles y campiñas de la región, el colibrí es una diminuta y fascinante ave, fundamental como polinizador natural para la preservación de la variada flora andina. Observar su ágil y veloz vuelo estacionario entre las flores silvestres brinda una excelente oportunidad para conectar con la delicada belleza de la naturaleza local.",
  },
  {
    nombre: "Cernícalo",
    quechua: "Killi killi",
    imagen: "/imagenes-reales/fauna/cernicalo.webp",
    descripcion:
      "Presente en los cielos y valles de la región, el cernícalo es una pequeña y veloz ave rapaz andina, fundamental para el equilibrio ecológico por su rol en el control natural de plagas agrícolas.",
  },
  {
    nombre: "Cóndor Andino",
    imagen: "/imagenes-reales/fauna/condor.webp",
    descripcion:
      "Presente en las alturas de Lucanas (destacando el Valle de Sondondo) y Sucre, el cóndor andino es un ave sagrada mensajera de los Apus y vital para el ecosistema. Visitar estos miradores naturales ofrece una inigualable oportunidad para admirar el majestuoso vuelo de este símbolo milenario en su hábitat.",
  },
  {
    nombre: "Halcón Peregrino",
    quechua: "Waman",
    imagen: "/imagenes-reales/fauna/halcon.webp",
    descripcion:
      "Presente en los altos riscos y cañones de la región, el halcón peregrino es una imponente ave rapaz y el animal más veloz del planeta, crucial como depredador tope para el equilibrio del ecosistema andino. Avistar su espectacular vuelo en picada durante sus cacerías brinda una excelente oportunidad para maravillarse con la imponente vida silvestre local.",
  },
  {
    nombre: "Vicuña",
    imagen: "/imagenes-reales/fauna/vicuna.webp",
    descripcion:
      "Presente en las planicies altoandinas, especialmente en la Reserva Nacional Pampa Galeras, la vicuña es un grácil camélido silvestre, símbolo patrio y poseedor de la fibra más fina del mundo. Recorrer esta reserva protegida brinda una excelente oportunidad para admirar a esta invaluable especie en total libertad.",
  },
];

export function FaunaAndina() {
  const [activo, setActivo] = useState(0);
  const especie = ESPECIES[activo];

  return (
    <div className="relative md:h-[750px]">
      <div className="h-96 md:absolute md:inset-0 md:h-full">
        <img
          key={especie.imagen}
          src={especie.imagen}
          alt={especie.nombre}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:absolute md:bottom-0 md:left-8 md:w-full md:max-w-md bg-eucalipto text-piedra px-8 py-10 md:px-10 md:py-12 flex flex-col justify-between">
        <div>
          {especie.quechua && (
            <span className="text-chilca text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
              {especie.quechua}
            </span>
          )}
          <h3 className="font-serif text-3xl md:text-4xl mb-5">{especie.nombre}</h3>
          <p className="text-piedra/80 text-sm md:text-base leading-relaxed">
            {especie.descripcion}
          </p>
        </div>
        <div className="flex gap-2 mt-10">
          {ESPECIES.map((e, i) => (
            <button
              key={e.nombre}
              type="button"
              onClick={() => setActivo(i)}
              aria-label={`Ver ${e.nombre}`}
              className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                i === activo
                  ? "border-piedra text-piedra"
                  : "border-transparent text-piedra/40 hover:text-piedra/70"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
