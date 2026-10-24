/** `video` (opcional): clip corto que se reproduce en lugar de la foto; `imagen` queda como póster. */
export type GaleriaItem = { imagen: string; titulo: string; descripcion: string; video?: string };

/** Escena de "Siente el lugar antes de llegar": clip en bucle (`video`) con la foto como póster, y su título y descripción debajo. */
export type EscenaCard = { imagen: string; titulo: string; descripcion: string; video?: string };

export type Lugar = {
  id: number;
  slug: string;
  numeral: string;
  nombre: string;
  categoria: string;
  heroTitulo: string;
  imagen: string;
  imagenSecundaria: string;
  descripcion: string;
  /** Consejo de visita y su frase; si faltan, no se muestra la sección "Consejo de visita". */
  consejo?: string;
  frase?: string;
  /** Imagen a pantalla completa con una etiqueta encima, entre el mapa y la galería (opcional). */
  seccionImagen?: { imagen: string; etiqueta: string };
  escenas: string;
  /** Etiquetas de 2-4 palabras para los 4 clips de video (brief de rodaje para Marketing). */
  clipTags: [string, string, string, string];
  /** Coordenadas para el mini-mapa trazado a mano; solo hacen falta si no hay `mapaImagen`. */
  mapLat?: number;
  mapLng?: number;
  /** Mapa ilustrado de Ayacucho con el punto marcado (generado por encargo). Si falta, se usa el AyacuchoMiniMap trazado a mano. */
  mapaImagen?: string;
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
    categoria: "Patrimonio Colonial",
    heroTitulo: "Donde la fe se viste de piedra y oro",
    imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Catedral1.webp",
    descripcion:
      "En el corazón de la Plaza Mayor de Huamanga —la ciudad de las 33 iglesias—, la Basílica Catedral de Nuestra Señora de las Nieves data de 1632, cuando el obispo Francisco Verdugo puso la primera piedra; la construcción tomó 40 años y fue consagrada en 1672 bajo la advocación de la Virgen de las Nieves. Su fachada, de líneas renacentistas y barrocas, y sus tres naves —sostenidas por 18 columnas y 16 bóvedas— guardan diez retablos tallados y bañados en pan de oro. Declarada Patrimonio Cultural de la Nación en 1972, abre su frontis con tres portadas sobre la Plaza Mayor.",
    consejo:
      "Complementar la visita con un recorrido por el centro histórico de Huamanga y sus templos coloniales: la ciudad cuenta con 33 iglesias.",
    frase: "Completa tu visita a la Basílica Catedral",
    escenas: "Piedra, historia y luz dorada: así se vive la Basílica Catedral de Ayacucho.",
    clipTags: [
      "Fachada al atardecer",
      "Retablos de pan de oro",
      "Procesión de Semana Santa",
      "Campanarios coloniales",
    ],
    mapLat: -13.1588,
    mapLng: -74.2239,
    mapaImagen: "/imagenes-reales/mapas/basilica-catedral.webp",
    galeria: [
      {
        imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
        titulo: "Fachada de la Basílica Catedral",
        descripcion: "Piedra labrada del siglo XVII frente a la Plaza Mayor.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Catedral2.webp",
        titulo: "Retablos de pan de oro",
        descripcion: "Diez retablos tallados y bañados en pan de oro adornan sus naves.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/catedral-semana-santa.webp",
        titulo: "Semana Santa de Ayacucho",
        descripcion: "La bendición de ramos y la salida del Señor Resucitado ocurren en la Basílica Catedral.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Catedral1.webp",
        titulo: "Basílica Catedral iluminada",
        descripcion: "Su iluminación nocturna resalta la piedra tallada de la fachada.",
      },
    ],
  },
  {
    id: 2,
    slug: "pampa-de-quinua",
    numeral: "II",
    nombre: "Pampa de Ayacucho",
    categoria: "Santuario Histórico",
    heroTitulo: "Quinua, Pueblo con Encanto, donde nació la libertad de América",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    descripcion:
      "A solo 45 minutos de Huamanga, en el distrito de Quinua, el Santuario Histórico Pampa de Ayacucho es el escenario donde el 9 de diciembre de 1824 el Ejército Unido Libertador selló la independencia de Sudamérica. Declarado Santuario Histórico en 1980, lo corona un obelisco de mármol de 44 metros, inaugurado en 1974 al cumplirse 150 años de la batalla, con las esculturas de los seis generales que la lideraron: Sucre, Córdova, La Mar, Miller, Lara y Gamarra. A pocos minutos, Quinua —distinguido oficialmente por el Mincetur como “Pueblo con Encanto” en 2024— mantiene viva la tradición de sus ceramistas, referente de la artesanía ayacuchana.",
    consejo:
      "Complementar la visita con una parada en el Complejo Arqueológico Wari, ubicado en el mismo camino.",
    frase: "Completa tu visita a la Pampa de Ayacucho",
    escenas: "Historia, cielo abierto y memoria viva: así se vive la Pampa de Ayacucho.",
    clipTags: ["Obelisco al amanecer", "Manos ceramistas", "Iglesitas y toritos de techo", "Complejo Arqueológico Wari"],
    mapLat: -13.0478,
    mapLng: -74.1322,
    mapaImagen: "/imagenes-reales/mapas/pampa-ayacucho.webp",
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
    categoria: "Paisaje Andino",
    heroTitulo: "Abismo de Puncupata, Puerta Celestial",
    imagen: "/imagenes-reales/abismo-puncupata/acantilado.webp",
    imagenSecundaria: "/imagenes-reales/abismo-puncupata/cornisa.webp",
    descripcion:
      "A unos 76 km de Huamanga —cerca de hora y media por carretera asfaltada— el Abismo de Puncupata se abre a 4,200 m.s.n.m. como uno de los desfiladeros más imponentes de Ayacucho. Un sendero peatonal habilitado por la comunidad local, de cerca de un kilómetro, lleva hasta su borde: un mirador natural con vistas a pueblos como Ccaccamarca y Chumbes. En el camino pastan vicuñas y, sobre el acantilado, planean las aves de altura. Se le conoce también como la “Puerta Celestial”, nombre que alude a su profundidad y a sus vistas panorámicas.",
    consejo:
      "Lleva ropa abrigadora e impermeable, botas firmes, agua y algo de comer: a 4,200 m el clima cambia rápido. Camina con calma por el sendero, sigue a tu guía local y, si sufres de vértigo, mantén distancia del borde.",
    frase: "Prepárate para el borde del Abismo de Puncupata",
    escenas: "Acantilados, vicuñas y paredes de roca entre la niebla: así se vive el Abismo de Puncupata.",
    clipTags: [
      "Al filo del acantilado",
      "Vicuñas en la puna",
      "Laderas del desfiladero",
      "Paredes entre la niebla",
    ],
    mapaImagen: "/imagenes-reales/mapas/abismo-puncupata.webp",
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
    galeriaTitulo: "Más allá del abismo: laberintos de roca y vicuñas",
    galeriaTexto:
      "Antes o después de asomarte al abismo, Huamanga y su puna ofrecen dos experiencias más: los Cañones de Qorihuillca, un laberinto de pasadizos de roca a solo 40 minutos de la ciudad, y los pastizales altoandinos donde viven las vicuñas silvestres.",
    galeria: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/canones-de-qorihuillca.webp",
        titulo: "Cañones de Qorihuillca",
        descripcion:
          "A 40 minutos de Huamanga, los Cañones de Qorihuillca conforman un imponente laberinto rocoso de pasadizos oscuros, ideal para el turismo de aventura. Se sugiere visitarlos durante la mañana, siendo indispensable el acompañamiento de un guía especializado y equipo de seguridad.",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/vicuna-habitat.webp",
        titulo: "Hábitat natural de las vicuñas",
        descripcion:
          "En las punas de Ayacucho, a más de 4,000 m.s.n.m., viven vicuñas silvestres, y en el camino a Puncupata es común cruzarse con ellas. Cada año, de mayo a noviembre, las comunidades de la región realizan el chaccu, un ritual ancestral que esquila a las vicuñas con más fibra y las devuelve a su hábitat sin dañarlas.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/escena-borde.webp",
        titulo: "Al filo del acantilado",
        descripcion: "A 4,200 m.s.n.m., un sendero comunitario de cerca de un kilómetro bordea el desfiladero.",
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
    categoria: "Arqueología Inca",
    heroTitulo: "Vilcas Huamán, la ciudad del halcón sagrado",
    imagen: "/imagenes-reales/vilcas-huaman/ushnu-aereo.webp",
    imagenSecundaria: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
    descripcion:
      "A unas 3 horas de Huamanga —cerca de 120 km hacia el sur— y a 3,490 m.s.n.m., Vilcas Huamán (del quechua Willka Waman, “halcón sagrado”) fue un importante centro administrativo del Imperio inca, levantado sobre el Qhapaq Ñan tras la conquista de los chancas y los pocras. Su Complejo Arqueológico de Vilcashuamán conserva, alrededor de una gran plaza ceremonial, el Ushnu —una pirámide truncada de ingreso con doble jamba, coronada por el Asiento del Inca— y el Templo del Sol, sobre cuyas bases se alzó durante la Colonia la iglesia de San Juan Bautista. En la provincia destacan además el bosque de Puyas de Raimondi de Titankayocc y el Complejo Arqueológico de Intihuatana, a orillas de la laguna de Pumacocha.",
    consejo:
      "Visita entre mayo y septiembre, cuando el cielo está más despejado. Lleva ropa abrigadora, calzado cómodo y bloqueador, aclimátate antes a la altura y recorre los sitios con un guía local, sin trepar a los muros incas.",
    frase: "Cuándo ir y qué llevar a Vilcas Huamán",
    seccionImagen: {
      imagen: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
      etiqueta: "Plaza de Vilcas Huamán",
    },
    escenas: "Piedra inca, plaza ceremonial y cielo andino: así se vive Vilcas Huamán.",
    clipTags: ["Ushnu inca", "Templo del Sol", "Plaza ceremonial", "Halcón sagrado"],
    mapaImagen: "/imagenes-reales/mapas/vilcas-huaman.webp",
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
    galeriaTitulo: "Más allá de la plaza: dos tesoros de la provincia",
    galeriaTexto:
      "En el mismo camino hacia Vilcas Huamán, el distrito de Vischongo suma dos paradas imperdibles de la provincia: un bosque de Puyas de Raimondi a más de 3,800 m de altura y las ruinas incas de Intihuatana, a orillas de una laguna.",
    galeria: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/puyas-de-raimondi-de-titankayocc.webp",
        titulo: "Puyas de Raimondi de Titankayocc",
        descripcion:
          "En el distrito de Vischongo, provincia de Vilcas Huamán, el Área de Conservación Regional Bosque de Puya Raimondi–Titankayocc, creada en 2010, protege un bosque de Puya raimondii, la bromelia más grande del mundo, entre los 3,800 y 4,500 m.s.n.m.: una puna donde las puyas se alzan sobre el pajonal.",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/ruinas-de-intihuatana.webp",
        titulo: "Ruinas de Intihuatana",
        descripcion:
          "En el distrito de Vischongo, provincia de Vilcas Huamán, el Complejo Arqueológico de Intihuatana se asoma a la laguna de Pumacocha, la “laguna del Puma”. Destacan sus finas edificaciones de piedra y su reloj solar, un recorrido entre muros incas frente al agua.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/ushnu.webp",
        titulo: "El Ushnu",
        descripcion: "Pirámide truncada de piedra inca, centro ceremonial de la plaza.",
        video: "/videos/lugares-visitar/vilcas-huaman-ushnu.mp4",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/iglesia-san-juan-bautista.webp",
        titulo: "Templo del Sol",
        descripcion: "Sobre sus bases incas se alzó durante la Colonia la iglesia de San Juan Bautista.",
        video: "/videos/lugares-visitar/vilcas-huaman-templo-sol.mp4",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/plaza-aerea.webp",
        titulo: "Vilcas Huamán desde el aire",
        descripcion: "La plaza y las ruinas incas de una ciudad levantada sobre el Qhapaq Ñan.",
        video: "/videos/lugares-visitar/vilcas-huaman-aereo.mp4",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/monumento-inca.webp",
        titulo: "Monumento al Inca y el halcón",
        descripcion: "Alude al nombre del lugar: Willka Waman, “halcón sagrado”.",
        video: "/videos/lugares-visitar/vilcas-huaman-monumento.mp4",
      },
    ],
  },
  {
    id: 5,
    slug: "ritipata",
    numeral: "V",
    nombre: "Nevado Ritipata",
    categoria: "Alta Montaña",
    heroTitulo: "Ritipata, el apu sagrado que se viste de nieve",
    imagen: "/videos/hero/ritipata-poster.webp",
    imagenSecundaria: "/imagenes-reales/ritipata/laguna-nevado.webp",
    descripcion:
      "Considerado sagrado, el Apu Ritipata es el nevado más alto de su zona: se alza a casi 5,000 m.s.n.m. en la cordillera Chonta, en el distrito de Paras (provincia de Cangallo), a poco más de tres horas de Huamanga. Su nombre quechua une riti, “nieve”, y pata, “lugar elevado”. La nieve cubre sus laderas entre diciembre y abril; de junio a septiembre, con el cielo más despejado, es la mejor época para recorrer sus lagunas, como la laguna Ñawi, y las cataratas cercanas. Desde el abra, sobre los 4,900 m, una caminata de media hora conduce hasta el nevado, cuyo deshielo abastece de agua a la zona. En sus faldas viven comunidades alpaqueras y, en el abra, se avistan vicuñas y vizcachas silvestres.",
    consejo:
      "Para ver la nieve, visita entre diciembre y abril; para recorrer las lagunas y cataratas, de junio a septiembre. Lleva ropa de abrigo (gorro, guantes y chaqueta), poncho impermeable, bloqueador, abundante agua y comida, porque no hay restaurantes en el lugar. Aclimátate antes a la altura y usa calzado cómodo para la caminata.",
    frase: "Cuándo ir y qué llevar al Apu Ritipata",
    escenas: "Nieve, lagunas de altura y alpacas: así se vive el Apu Ritipata.",
    clipTags: ["Camino al abra", "Lagunas de Ritipata", "Cumbres y valles andinos", "Alpacas de las faldas"],
    mapLat: -13.42917,
    mapLng: -74.69167,
    mapaImagen: "/imagenes-reales/mapas/ritipata.webp",
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
    galeriaTitulo: "Más allá de las cumbres: el agua de Cangallo",
    galeriaTexto:
      "La provincia de Cangallo guarda también cascadas y pozas donde el agua baja entre praderas y roca: la Cascada de Ruqruqa y la Catarata de Pumapaqcha, dos paradas para completar el viaje, mejor de junio a septiembre.",
    galeria: [
      {
        imagen: "/imagenes-reales/ritipata/ruqruqa.webp",
        titulo: "Cascada de Ruqruqa",
        descripcion:
          "A unas 3 horas y media de Huamanga, en la comunidad de Quispillaccta (distrito de Chuschi, provincia de Cangallo), la Cascada de Ruqruqa forma pozas turquesas escalonadas para refrescarse y nadar en aguas cristalinas. Lleva ropa de baño y calzado antideslizante para recorrer sus senderos.",
      },
      {
        imagen: "/imagenes-reales/ritipata/pumapaqcha.webp",
        titulo: "Catarata de Pumapaqcha",
        descripcion:
          "En el distrito de Cangallo, la Catarata de Pumapaqcha cae unos 10 metros hasta una laguna natural donde es posible refrescarse. Se llega tras una caminata de media hora desde la carretera Ayacucho–Cangallo.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/ritipata/escena-ruta.webp",
        titulo: "Camino al abra",
        descripcion: "Una ruta de tierra sube entre cerros nevados hasta el abra de Ritipata, sobre los 4,900 m.s.n.m.",
        video: "/videos/lugares-visitar/ritipata-ruta.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-lagunas.webp",
        titulo: "Lagunas de Ritipata",
        descripcion: "Espejos de agua al pie de la nieve, a media hora de caminata desde el abra.",
        video: "/videos/lugares-visitar/ritipata-lagunas.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-valle.webp",
        titulo: "Cumbres y valles andinos",
        descripcion: "Desde lo alto, el paisaje se abre en valles, laderas rojizas y caminos de tierra.",
        video: "/videos/lugares-visitar/ritipata-valle.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-alpacas.webp",
        titulo: "Alpacas de las faldas",
        descripcion: "En las faldas del nevado viven comunidades alpaqueras; sus alpacas pastan junto a las lagunas.",
        video: "/videos/lugares-visitar/ritipata-alpacas.mp4",
      },
    ],
  },
  {
    id: 1,
    slug: "millpu",
    numeral: "VI",
    nombre: "Aguas Turquesas de Millpu",
    categoria: "Naturaleza",
    heroTitulo: "Millpu, la joya oculta de Ayacucho",
    imagen: "/imagenes-reales/aguas-turquesas/aguas-turquesas-card.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Turquesa3.webp",
    descripcion:
      "A unas 4 horas de Huamanga, en la comunidad de Circamarca (distrito de Huancaraylla, provincia de Víctor Fajardo), las Aguas Turquesas de Millpu forman uno de los atractivos naturales más emblemáticos de Ayacucho: un circuito de cerca de 20 piscinas naturales escalonadas, a más de 3,600 m.s.n.m. en el interior de un cañón de paredes rocosas. Su color turquesa nace de la combinación de los minerales del agua y la luz del sol. El nombre viene del quechua millp'u (\"tragar\" o \"garganta\"): la leyenda local decía que sus aguas nacían de la boca del diablo, por lo que pocos se atrevían a visitarlas.",
    consejo:
      "Visitar de mayo a noviembre para disfrutar del vibrante color y llevar calzado de trekking. Para proteger el ecosistema, no está permitido nadar en las pozas.",
    frase: "Cuándo ir y qué llevar a Millpu",
    escenas: "Pozas escalonadas, cascadas y paredes de roca: así se vive Millpu.",
    clipTags: ["Pozas escalonadas", "Caídas de agua entre terrazas", "Cañón de Millpu", "Poza al pie de la caída"],
    mapLat: -13.7207,
    mapLng: -74.1339,
    mapaImagen: "/imagenes-reales/mapas/aguas-turquesas.webp",
    seccionImagen: {
      imagen: "/imagenes-reales/aguas-turquesas/millpu-opt.webp",
      etiqueta: "Aguas Turquesas de Millpu",
    },
    video: {
      hero: "/videos/hero/aguas-turquesas.mp4",
      heroMobile: "/videos/hero/aguas-turquesas-mobile.mp4",
      poster: "/videos/hero/aguas-turquesas-poster.webp",
    },
    imagenPantalla: "/imagenes-reales/aguas-turquesas/turquesa-sec.webp",
    galeriaTitulo: "Más allá de las pozas: Sarhua, agua y tradición viva",
    galeriaTexto:
      "En la misma provincia de Víctor Fajardo, el distrito de Sarhua —distinguido por el Mincetur como Pueblo con Encanto— suma dos razones para seguir el viaje: una sucesión de cascadas entre cerros andinos y las Tablas de Sarhua, una pintura tradicional reconocida como Patrimonio Cultural de la Nación.",
    galeria: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/cascadas-sarhua.webp",
        titulo: "Cascada de Sarhua",
        descripcion:
          "A unas 4 horas de Huamanga, en el distrito de Sarhua, las Cascadas de Sarhua —también llamadas Campanayuq— forman una sucesión de caídas de agua entre cerros verdes, a más de 3,600 m.s.n.m., ideales para el ecoturismo y la desconexión. Se recomienda visitarlas a primera hora y con calzado antideslizante: una excursión que enriquece la estadía.",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/tabla-sarhua.webp",
        titulo: "Las Tablas de Sarhua",
        descripcion:
          "Patrimonio Cultural de la Nación desde 2018, esta pintura tradicional de Sarhua cuenta en tablas de madera la historia de las familias y su entorno, con figuras y textos en castellano y quechua. Se elaboran en el distrito de Sarhua, provincia de Víctor Fajardo.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-pozas.webp",
        titulo: "Pozas escalonadas",
        descripcion: "Cerca de 20 pozas de agua turquesa descienden en terrazas, a más de 3,600 m.s.n.m.",
        video: "/videos/lugares-visitar/aguas-turquesas-pozas.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-cascadas.webp",
        titulo: "Caídas de agua entre terrazas",
        descripcion: "El agua baja por terrazas de roca clara y se acumula en nuevas pozas.",
        video: "/videos/lugares-visitar/aguas-turquesas-cascadas.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-canon.webp",
        titulo: "Cañón de Millpu",
        descripcion: "Paredes rocosas rodeadas de vegetación andina encierran el recorrido del agua.",
        video: "/videos/lugares-visitar/aguas-turquesas-canon.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-caida.webp",
        titulo: "Poza al pie de la caída",
        descripcion: "Entre las paredes del cañón, el agua se precipita y forma una poza de intenso turquesa.",
        video: "/videos/lugares-visitar/aguas-turquesas-caida.mp4",
      },
    ],
  },
];
