/** `video` (opcional): clip corto que se reproduce en lugar de la foto; `imagen` queda como póster. */
export type GaleriaItem = {
  imagen: string;
  titulo: string;
  descripcion: string;
  video?: string;
  /** Punto de enfoque del recorte de la foto en la tarjeta (CSS `object-position`); por defecto, el centro. */
  posicion?: string;
};

/** Escena de la sección "… de cerca": clip en bucle (`video`) con la foto como póster, y su título y descripción debajo. */
export type EscenaCard = { imagen: string; titulo: string; descripcion: string; video?: string };

export type Lugar = {
  id: number;
  slug: string;
  numeral: string;
  nombre: string;
  /** Nombre más general que se muestra solo en la lista "Explora más lugares para visitar"; si falta se usa `nombre`. */
  nombreLista?: string;
  categoria: string;
  heroTitulo: string;
  /** Texto corto para buscadores y redes (una o dos frases); si falta se usa `descripcion`. */
  metaDescripcion?: string;
  imagen: string;
  imagenSecundaria: string;
  /** Párrafos separados por una línea en blanco; *texto* se muestra en cursiva. */
  descripcion: string;
  /** Texto del panel "Consejo de visita"; si falta, no se muestra el panel. */
  consejo?: string;
  /** Imagen a pantalla completa con una etiqueta encima, entre el mapa y la galería (opcional). */
  seccionImagen?: { imagen: string; etiqueta: string };
  /** Título de la sección de clips ("… de cerca"); va sin descripción. */
  escenasTitulo: string;
  /** Etiquetas de 2-4 palabras para los 4 clips de video (brief de rodaje para Marketing). */
  clipTags: [string, string, string, string];
  /** Coordenadas aproximadas para ubicar el destino en el mapa referencial de Ayacucho. */
  mapLat?: number;
  mapLng?: number;
  /** Video del hero (opcional). Si falta, el hero usa `imagen`. */
  video?: { hero: string; heroMobile: string; poster: string };
  /** Foto de la sección a pantalla completa (si falta se usa `imagen`); no se usa si hay `videoSeccion`. */
  imagenPantalla?: string;
  /** Video a pantalla completa que reemplaza la foto de la sección bajo la galería; `etiqueta` sustituye al nombre del lugar (opcional). */
  videoSeccion?: { src: string; srcMobile: string; poster: string; etiqueta?: string };
  /** Tarjetas (clip, título y descripción) para el bloque de escenas; si faltan se usan los clips genéricos. */
  escenasCards?: EscenaCard[];
  /** Título y texto de encabezado sobre la galería (opcionales). */
  galeriaTitulo?: string;
  galeriaTexto?: string;
  /** Solo presente cuando hay suficiente material fotográfico real para una mini-galería. */
  galeria?: GaleriaItem[];
};

export const lugares: Lugar[] = [
  {
    id: 4,
    slug: "catedral-de-ayacucho",
    numeral: "I",
    nombre: "Basílica Catedral de Ayacucho",
    nombreLista: "Plaza Mayor de Ayacucho",
    categoria: "Patrimonio Colonial",
    heroTitulo: "Catedral de Ayacucho, Patrimonio Cultural de la Nación",
    imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Catedral1.webp",
    descripcion:
      "La Basílica Catedral de Ayacucho, dedicada a Nuestra Señora de las Nieves, está en el lado este de la Plaza Mayor de Huamanga. Su construcción empezó en 1632, cuando el obispo Francisco Verdugo puso la primera piedra, y terminó en 1672, cuarenta años después.\n\nSu fachada tiene líneas renacentistas y barrocas y tres portadas hacia la plaza. Por dentro, tres naves sostenidas por 18 columnas guardan diez retablos tallados y bañados en pan de oro. Fue declarada Patrimonio Cultural de la Nación en 1972.",
    metaDescripcion:
      "Basílica Catedral de Ayacucho, en la Plaza Mayor de Huamanga. Se construyó entre 1632 y 1672 y guarda diez retablos con pan de oro.",
    consejo:
      "Sube al campanario por la escalera de piedra para ver la ciudad en panorámica. Si quieres más, el museo y las catacumbas están dentro de la misma Catedral.",
    escenasTitulo: "Basílica Catedral de cerca",
    clipTags: ["Fachada de la Catedral", "Portada y esculturas", "Naves y arcos", "Retablos de pan de oro"],
    mapLat: -13.1588,
    mapLng: -74.2239,
    seccionImagen: {
      imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
      etiqueta: "Fachada de la Basílica Catedral",
    },
    video: {
      hero: "/videos/hero/catedral-de-ayacucho.mp4",
      heroMobile: "/videos/hero/catedral-de-ayacucho-mobile.mp4",
      poster: "/videos/hero/catedral-de-ayacucho-poster.webp",
    },
    videoSeccion: {
      src: "/videos/lugares-visitar/plaza-mayor-de-huamanga.mp4",
      srcMobile: "/videos/lugares-visitar/plaza-mayor-de-huamanga-mobile.mp4",
      poster: "/videos/lugares-visitar/plaza-mayor-de-huamanga-poster.webp",
      etiqueta: "Plaza Mayor de Huamanga",
    },
    escenasCards: [
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/escena-fachada.webp",
        titulo: "Fachada de la Basílica Catedral",
        descripcion: "La fachada de la Basílica Catedral da a la Plaza Mayor, en su lado este.",
        video: "/videos/lugares-visitar/catedral-fachada.mp4",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/escena-portada.webp",
        titulo: "Portada y esculturas",
        descripcion: "La portada tiene tres puertas de ingreso y esculturas de San Pedro y San Pablo.",
        video: "/videos/lugares-visitar/catedral-portada.mp4",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/escena-naves.webp",
        titulo: "Naves y arcos",
        descripcion: "El interior tiene tres naves sostenidas por 18 columnas.",
        video: "/videos/lugares-visitar/catedral-naves.mp4",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/escena-retablos.webp",
        titulo: "Retablos de pan de oro",
        descripcion: "Diez retablos acabados en pan de oro adornan el interior, entre ellos el del Altar Mayor.",
        video: "/videos/lugares-visitar/catedral-retablos.mp4",
      },
    ],
    galeriaTitulo: "Cuatro visitas más en Huamanga",
    galeria: [
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/plaza-mayor-de-huamanga.webp",
        titulo: "Plaza Mayor de Huamanga",
        descripcion:
          "Las casonas que la rodean datan de los siglos XVI y XVII y tienen arquerías de piedra en el primer nivel. La Basílica Catedral está en su lado este.",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/arco-del-triunfo.webp",
        posicion: "50% 54%",
        titulo: "Arco del Triunfo",
        descripcion:
          "Se levantó en 1910 para recordar la victoria del combate del 2 de Mayo. Está a unos cuatro minutos a pie de la Plaza Mayor.",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/catedral-santo-domingo.webp",
        titulo: "Templo de Santo Domingo",
        descripcion:
          "Se construyó entre los siglos XVI y XVII y su fachada tiene tres arcos y dos torres. Queda en la esquina de los jirones 9 de Diciembre y María Parado de Bellido.",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/mirador-de-acuchimay.webp",
        titulo: "Mirador de Acuchimay",
        descripcion:
          "Desde este mirador del cerro Acuchimay, en Carmen Alto, a 2865 m s. n. m., se ve la ciudad en 360 grados. Queda a unos diez minutos en auto de la Plaza Mayor y la entrada es libre.",
      },
    ],
  },
  {
    id: 2,
    slug: "pampa-de-quinua",
    numeral: "II",
    nombre: "Pampa de Ayacucho",
    nombreLista: "Quinua, Pueblo con Encanto",
    categoria: "Santuario Histórico",
    heroTitulo: "Quinua, Pueblo con Encanto, donde nació la libertad de América",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    descripcion:
      "A solo cuarenta y cinco minutos de Huamanga, en el distrito de Quinua, el Santuario Histórico Pampa de Ayacucho es el escenario donde el 9 de diciembre de 1824 el Ejército Unido Libertador selló la independencia de Sudamérica. Declarado Santuario Histórico en 1980, lo corona un obelisco de mármol de 44 metros, inaugurado en 1974 al cumplirse 150 años de la batalla, con las esculturas de los seis generales que la lideraron: Sucre, Córdova, La Mar, Miller, Lara y Gamarra. A pocos minutos, Quinua —distinguido oficialmente por el Mincetur como “Pueblo con Encanto” en 2024— mantiene viva la tradición de sus ceramistas, referente de la artesanía ayacuchana.",
    consejo:
      "Complementar la visita con una parada en el Complejo Arqueológico Wari, ubicado en el mismo camino.",
    escenasTitulo: "Pampa de Ayacucho de cerca",
    clipTags: ["Obelisco al amanecer", "Manos ceramistas", "Iglesitas y toritos de techo", "Complejo Arqueológico Wari"],
    mapLat: -13.0478,
    mapLng: -74.1322,
    galeria: [
      {
        imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
        titulo: "Obelisco de la Pampa de Ayacucho",
        descripcion: "Monumento de 44 metros que conmemora la batalla que selló la independencia de Sudamérica.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/quinua-ceramica.webp",
        titulo: "Cerámica tradicional de Quinua",
        descripcion: "Sus saberes son Patrimonio Cultural de la Nación desde 2019; las iglesitas de techo, que coronan las casas nuevas, son una de sus piezas más emblemáticas.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/complejo-wari.webp",
        titulo: "Complejo Arqueológico Wari",
        descripcion: "De camino a Quinua, a unos 20 km de Huamanga, se visita la capital del primer imperio andino, anterior a los incas.",
      },
    ],
  },
  {
    id: 6,
    slug: "abismo-puncupata",
    numeral: "III",
    nombre: "Abismo de Puncupata",
    nombreLista: "Amanecer de Puncupata y cañones de Qorihuillca",
    categoria: "Paisaje Andino",
    heroTitulo: "Abismo de Puncupata, Puerta Celestial",
    metaDescripcion:
      "Un desfiladero a 4200 m s. n. m., a unas dos horas de Huamanga. Qué ver y qué llevar.",
    imagen: "/imagenes-reales/abismo-puncupata/acantilado.webp",
    imagenSecundaria: "/imagenes-reales/abismo-puncupata/cornisa.webp",
    descripcion:
      "A unos 76 km de Huamanga, a hora y media o dos horas por carretera asfaltada, el abismo de Puncupata se abre a 4200 m s. n. m. como un gran desfiladero.\n\nUn sendero peatonal de cerca de un kilómetro, habilitado por la comunidad local, lleva hasta su borde, un mirador natural con vistas a los pueblos de Ccaccamarca y Chumbes. En el camino pastan vicuñas y, sobre el acantilado, planean las aves de altura. Se le conoce también como la «Puerta Celestial», nombre que alude a su profundidad y a sus vistas panorámicas.",
    consejo:
      "Lleva ropa abrigadora e impermeable, botas resistentes, agua y algo de comer. A 4200 m s. n. m. el clima puede cambiar rápidamente. Camina con precaución por el sendero y sigue las indicaciones de tu guía local. Mantén una distancia segura del borde, especialmente si sufres de vértigo.",
    escenasTitulo: "Puncupata de cerca",
    clipTags: [
      "Al filo del acantilado",
      "Vicuñas en la puna",
      "Laderas del desfiladero",
      "Paredes entre la niebla",
    ],
    // Ubicación aproximada (distrito de Ocros, al sureste de Huamanga); el mapa es referencial.
    mapLat: -13.4,
    mapLng: -73.9,
    video: {
      hero: "/videos/hero/abismo-puncupata.mp4",
      heroMobile: "/videos/hero/abismo-puncupata-mobile.mp4",
      poster: "/videos/hero/abismo-puncupata-poster.webp",
    },
    videoSeccion: {
      src: "/videos/lugares-visitar/pachapupum.mp4",
      srcMobile: "/videos/lugares-visitar/pachapupum-mobile.mp4",
      poster: "/videos/lugares-visitar/pachapupum-poster.webp",
      etiqueta: "Volcán inactivo de Pachapupum",
    },
    galeriaTitulo: "Dos visitas más desde Huamanga",
    galeria: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/vicuna-habitat.webp",
        titulo: "Vicuñas en el camino a Puncupata",
        descripcion:
          "En el tramo final de la carretera al abismo, a más de 4000 m s. n. m., es común ver vicuñas silvestres entre los pastizales. Cada año, de mayo a noviembre, las comunidades de la región realizan el chaccu, un ritual ancestral que esquila a las vicuñas con más fibra y las devuelve a su hábitat sin dañarlas.",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/canones-de-qorihuillca.webp",
        titulo: "Cañones de Qorihuillca",
        descripcion:
          "Al lado contrario de la ciudad, a cuarenta minutos de Huamanga, los Cañones de Qorihuillca conforman un laberinto rocoso de pasadizos oscuros. Se sugiere visitarlos por la mañana y es indispensable ir con un guía especializado y equipo de seguridad.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/escena-borde.webp",
        titulo: "Al filo del acantilado",
        descripcion: "A 4200 m s. n. m., un sendero comunitario de cerca de un kilómetro bordea el desfiladero.",
        video: "/videos/lugares-visitar/abismo-puncupata-borde.mp4",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/escena-vicunas.webp",
        titulo: "Vicuñas en la puna",
        descripcion: "En el tramo final del camino es común cruzarse con vicuñas silvestres.",
        video: "/videos/lugares-visitar/abismo-puncupata-vicunas.mp4",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/escena-laderas.webp",
        titulo: "Laderas del desfiladero",
        descripcion: "Desde el borde, las laderas descienden en pliegues dorados hacia el fondo.",
        video: "/videos/lugares-visitar/abismo-puncupata-laderas.mp4",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/escena-paredes.webp",
        titulo: "Paredes entre la niebla",
        descripcion: "La roca se alza sobre el vacío mientras las aves planean frente al acantilado.",
        video: "/videos/lugares-visitar/abismo-puncupata-paredes.mp4",
      },
    ],
  },
  {
    id: 7,
    slug: "vilcas-huaman",
    numeral: "IV",
    nombre: "Vilcas Huamán",
    nombreLista: "Vilcas Huamán, centro administrativo inca",
    categoria: "Arqueología Inca",
    heroTitulo: "Vilcas Huamán, centro administrativo inca",
    metaDescripcion:
      "El Ushnu y el Templo del Sol en un centro administrativo inca a 3490 m s. n. m. Cómo llegar y qué llevar.",
    imagen: "/imagenes-reales/vilcas-huaman/ushnu-aereo.webp",
    imagenSecundaria: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
    descripcion:
      "Vilcas Huamán es un complejo arqueológico inca a 3490 m s. n. m., a unas dos horas y media de Huamanga. Fue uno de los principales centros administrativos del Imperio inca y su importancia estuvo vinculada al Qhapaq Ñan, la red vial del Tahuantinsuyo. Su nombre viene del quechua *Willka Waman*, que significa «halcón sagrado».\n\nEn el complejo destacan el Ushnu y el Templo del Sol. El Ushnu es una estructura ceremonial de piedra con cuatro plataformas y entrada de doble jamba, y en su parte superior está el Asiento del Inca. El Templo del Sol estaba dedicado a Inti, y sus cimientos se aprovecharon durante la Colonia para construir la iglesia de San Juan Bautista.",
    consejo:
      "Lleva ropa abrigadora para las mañanas y las tardes frías, calzado cómodo y bloqueador solar. Si no estás acostumbrado a la altura, evita los esfuerzos intensos al llegar. Recorre los monumentos con respeto y sigue las indicaciones del personal para conservar las estructuras incas.",
    seccionImagen: {
      imagen: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
      etiqueta: "Plaza de Vilcas Huamán",
    },
    escenasTitulo: "Vilcas Huamán de cerca",
    clipTags: ["Ushnu inca", "Templo del Sol", "Plaza ceremonial", "Halcón sagrado"],
    mapLat: -13.6558,
    mapLng: -73.95,
    video: {
      hero: "/videos/hero/vilcashuaman.mp4",
      heroMobile: "/videos/hero/vilcashuaman-mobile.mp4",
      poster: "/videos/hero/vilcashuaman-poster.webp",
    },
    videoSeccion: {
      src: "/videos/lugares-visitar/puyas-de-raimondi.mp4",
      srcMobile: "/videos/lugares-visitar/puyas-de-raimondi-mobile.mp4",
      poster: "/videos/lugares-visitar/puyas-de-raimondi-poster.webp",
      etiqueta: "Puyas de Raimondi",
    },
    galeriaTitulo: "Dos visitas más en Vischongo",
    galeria: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/puyas-de-raimondi-de-titankayocc.webp",
        titulo: "Puyas de Raimondi de Titankayocc",
        descripcion:
          "En el distrito de Vischongo, a unos treinta minutos de Vilcas Huamán, este bosque es Área de Conservación Regional desde 2010. Sus enormes plantas destacan entre los pajonales de la puna.",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/ruinas-de-intihuatana.webp",
        titulo: "Ruinas de Intihuatana",
        descripcion:
          "En el distrito de Vischongo, junto a la laguna Pumacocha, este complejo conserva construcciones incas de piedra y un reloj solar. Es Patrimonio Cultural de la Nación desde 2001, y su nombre quechua se traduce como «amarrar al Sol».",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/ushnu.webp",
        titulo: "El Ushnu",
        descripcion: "Estructura ceremonial inca de piedra en la plaza principal.",
        video: "/videos/lugares-visitar/vilcas-huaman-ushnu.mp4",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/iglesia-san-juan-bautista.webp",
        titulo: "Templo del Sol",
        descripcion: "Antiguo templo inca sobre cuyos cimientos se construyó la iglesia de San Juan Bautista.",
        video: "/videos/lugares-visitar/vilcas-huaman-templo-sol.mp4",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/plaza-aerea.webp",
        titulo: "Vilcas Huamán desde el aire",
        descripcion: "Vista panorámica de la plaza y de los restos de la antigua ciudad inca.",
        video: "/videos/lugares-visitar/vilcas-huaman-aereo.mp4",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/monumento-inca.webp",
        titulo: "Monumento al Inca y el halcón",
        descripcion: "Monumento que representa al Inca y al halcón sagrado, símbolo de Vilcas Huamán.",
        video: "/videos/lugares-visitar/vilcas-huaman-monumento.mp4",
      },
    ],
  },
  {
    id: 5,
    slug: "ritipata",
    numeral: "V",
    nombre: "Nevado de Ritipata",
    categoria: "Alta Montaña",
    heroTitulo: "El nevado de Ritipata",
    metaDescripcion:
      "Un nevado de unos 5000 m s. n. m. en Cangallo a tres horas de Huamanga. Cuándo ver nieve y qué llevar.",
    imagen: "/videos/hero/ritipata-poster.webp",
    imagenSecundaria: "/imagenes-reales/ritipata/laguna-nevado.webp",
    descripcion:
      "Ritipata es un nevado de unos 5000 m s. n. m. en la cordillera Chonta, en el distrito de Paras (provincia de Cangallo), a unas tres horas en auto de Huamanga. En la cosmovisión andina es un apu sagrado. Su nombre viene del quechua *riti* (nieve) y *pata* (lugar elevado).\n\nEntre diciembre y abril suelen producirse nevadas. De junio a septiembre, el cielo está más despejado para recorrer las lagunas, como la Ñawi, y las cataratas cercanas. Desde el abra, a más de 4900 m s. n. m., una caminata de media hora permite acercarse al nevado. En la zona también habitan alpacas, vicuñas y vizcachas silvestres.",
    consejo:
      "Para ver nieve, visita entre diciembre y abril, aunque su presencia depende del clima. Lleva ropa térmica, chaqueta impermeable, gorro y guantes, además de agua y comida porque no hay restaurantes en el lugar. Aclimátate antes de subir a esta altitud.",
    escenasTitulo: "Ritipata de cerca",
    clipTags: ["Camino al abra", "Lagunas de Ritipata", "Cumbres y valles andinos", "Alpacas de las faldas"],
    mapLat: -13.42917,
    mapLng: -74.69167,
    video: {
      hero: "/videos/hero/ritipata.mp4",
      heroMobile: "/videos/hero/ritipata-mobile.mp4",
      poster: "/videos/hero/ritipata-poster.webp",
    },
    videoSeccion: {
      src: "/videos/lugares-visitar/ritipata-abra.mp4",
      srcMobile: "/videos/lugares-visitar/ritipata-abra-mobile.mp4",
      poster: "/videos/lugares-visitar/ritipata-abra-poster.webp",
      etiqueta: "Abra de Ritipata",
    },
    seccionImagen: {
      imagen: "/imagenes-reales/ritipata/laguna-nevado.webp",
      etiqueta: "Lagunas de Ritipata",
    },
    galeriaTitulo: "Dos visitas más en Cangallo",
    galeria: [
      {
        imagen: "/imagenes-reales/ritipata/pumapaqcha.webp",
        titulo: "Catarata de Pumapaqcha",
        descripcion:
          "En el distrito de Cangallo, junto a la carretera Ayacucho–Cangallo, la catarata cae unos diez metros hasta una laguna natural. Se llega tras una caminata de unos veinte minutos.",
      },
      {
        imagen: "/imagenes-reales/ritipata/ruqruqa.webp",
        titulo: "Cascada de Ruqruqa",
        descripcion:
          "A unas tres horas y media de Huamanga, en la comunidad de Quispillaccta (distrito de Chuschi), la cascada forma pozas turquesas escalonadas. Desde donde llega el vehículo se camina unos veinte minutos. Para recorrer los senderos o entrar al agua, lleva ropa de baño y calzado antideslizante.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/ritipata/escena-ruta.webp",
        titulo: "Camino al abra",
        descripcion: "Una ruta de tierra asciende entre montañas hasta el abra de Ritipata.",
        video: "/videos/lugares-visitar/ritipata-ruta.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-lagunas.webp",
        titulo: "Lagunas de Ritipata",
        descripcion: "Lagunas de aguas tranquilas rodeadas de montañas.",
        video: "/videos/lugares-visitar/ritipata-lagunas.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-valle.webp",
        titulo: "Cumbres y valles andinos",
        descripcion: "Vistas panorámicas de cumbres y laderas rojizas sobre extensos valles.",
        video: "/videos/lugares-visitar/ritipata-valle.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-alpacas.webp",
        titulo: "Alpacas de las faldas",
        descripcion: "Alpacas pastan en las alturas junto a comunidades alpaqueras de la zona.",
        video: "/videos/lugares-visitar/ritipata-alpacas.mp4",
      },
    ],
  },
  {
    id: 1,
    slug: "millpu",
    numeral: "VI",
    nombre: "Aguas turquesas de Millpu",
    categoria: "Naturaleza",
    heroTitulo: "Las aguas turquesas de Millpu",
    metaDescripcion:
      "Unas 20 pozas turquesas en un cañón de Ayacucho a unos 3600 m s. n. m. Cómo llegar y cuándo ir.",
    imagen: "/imagenes-reales/aguas-turquesas/aguas-turquesas-card.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Turquesa3.webp",
    descripcion:
      "Millpu es una serie de unas 20 pozas turquesas que descienden por un cañón a unos 3600 m s. n. m. Queda en la comunidad de Circamarca, en el distrito de Huancaraylla (provincia de Víctor Fajardo). Desde Huamanga se llega en unas tres horas y media por carretera hasta Pataqocha, y de ahí se camina unos veinte minutos.\n\nEl color turquesa viene de los minerales de las rocas del río y de la luz del sol. Su nombre viene del quechua *millpuy* (tragar), porque el río desaparece en una grieta subterránea. En lluvias se forma una gran represa natural, a la que algunos llaman «garganta del diablo».",
    consejo:
      "Visita Millpu entre mayo y septiembre para ver el agua más turquesa, ya que de enero a abril las lluvias la enturbian. Lleva calzado con buen agarre para los senderos y respeta la prohibición de bañarse en las pozas, vigente desde 2018 para conservar su color.",
    escenasTitulo: "Millpu de cerca",
    clipTags: ["Pozas escalonadas", "Caídas de agua entre terrazas", "Cañón de Millpu", "Poza al pie de la caída"],
    mapLat: -13.7207,
    mapLng: -74.1339,
    seccionImagen: {
      imagen: "/imagenes-reales/aguas-turquesas/millpu-opt.webp",
      etiqueta: "Pozas escalonadas de Millpu",
    },
    video: {
      hero: "/videos/hero/aguas-turquesas.mp4",
      heroMobile: "/videos/hero/aguas-turquesas-mobile.mp4",
      poster: "/videos/hero/aguas-turquesas-poster.webp",
    },
    imagenPantalla: "/imagenes-reales/aguas-turquesas/turquesa-sec.webp",
    galeriaTitulo: "Dos visitas más en Víctor Fajardo",
    galeria: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/cascadas-sarhua.webp",
        posicion: "50% 80%",
        titulo: "Cascadas de Sarhua",
        descripcion:
          "Estas cascadas están a tres horas y media de Millpu y se suceden a lo largo del valle de Campanayuq hasta unas aguas termales. Conviene visitarlas a primera hora y llevar calzado antideslizante.",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/tabla-sarhua.webp",
        titulo: "Las Tablas de Sarhua",
        descripcion:
          "Son tablas de madera pintadas que cuentan historias de familias y de la vida comunitaria. Tradicionalmente se regalan al terminar una casa nueva y se colocan entre las vigas del techo. Se pueden ver y comprar en Sarhua, y están declaradas Patrimonio Cultural de la Nación desde 2018.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-pozas.webp",
        titulo: "Pozas escalonadas",
        descripcion: "Unas 20 pozas descienden en niveles y forman una sucesión de tonos turquesa.",
        video: "/videos/lugares-visitar/aguas-turquesas-pozas.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-cascadas.webp",
        titulo: "Caídas de agua entre terrazas",
        descripcion: "Pequeñas cascadas conectan las pozas y acompañan el recorrido del agua entre las rocas.",
        video: "/videos/lugares-visitar/aguas-turquesas-cascadas.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-canon.webp",
        titulo: "Cañón de Millpu",
        descripcion: "Altas paredes rocosas enmarcan el curso del agua en un entorno de montaña.",
        video: "/videos/lugares-visitar/aguas-turquesas-canon.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-caida.webp",
        titulo: "Poza al pie de la caída",
        descripcion: "El agua se reúne en una poza rodeada de roca al pie de la caída.",
        video: "/videos/lugares-visitar/aguas-turquesas-caida.mp4",
      },
    ],
  },
];
