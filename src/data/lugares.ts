/** `video` (opcional): clip corto que se reproduce en lugar de la foto; `imagen` queda como póster. */
export type GaleriaItem = { imagen: string; titulo: string; descripcion: string; video?: string };

/** Escena de "Un vistazo al destino": clip en bucle (`video`) con la foto como póster, y su título y descripción debajo. */
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
  imagen: string;
  imagenSecundaria: string;
  /** Párrafos separados por una línea en blanco; *texto* se muestra en cursiva. */
  descripcion: string;
  /** Texto del panel "Consejo de visita"; si falta, no se muestra el panel. */
  consejo?: string;
  /** Imagen a pantalla completa con una etiqueta encima, entre el mapa y la galería (opcional). */
  seccionImagen?: { imagen: string; etiqueta: string };
  escenas: string;
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
    nombreLista: "Plaza de Armas de Ayacucho",
    categoria: "Patrimonio Colonial",
    heroTitulo: "Donde la fe se viste de piedra y oro",
    imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Catedral1.webp",
    descripcion:
      "En el corazón de la Plaza Mayor de Huamanga —la ciudad de las 33 iglesias—, la Basílica Catedral de Nuestra Señora de las Nieves data de 1632, cuando el obispo Francisco Verdugo puso la primera piedra; la construcción tomó 40 años y fue consagrada en 1672 bajo la advocación de la Virgen de las Nieves. Su fachada, de líneas renacentistas y barrocas, y sus tres naves —sostenidas por 18 columnas y 16 bóvedas— guardan diez retablos tallados y bañados en pan de oro. Declarada Patrimonio Cultural de la Nación en 1972, abre su frontis con tres portadas sobre la Plaza Mayor.",
    consejo:
      "Complementar la visita con un recorrido por el centro histórico de Huamanga y sus templos coloniales: la ciudad cuenta con 33 iglesias.",
    escenas: "Piedra, historia y luz dorada: así se vive la Basílica Catedral de Ayacucho.",
    clipTags: [
      "Fachada al atardecer",
      "Retablos de pan de oro",
      "Procesión de Semana Santa",
      "Campanarios coloniales",
    ],
    mapLat: -13.1588,
    mapLng: -74.2239,
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
    nombreLista: "Quinua, Pueblo con Encanto",
    categoria: "Santuario Histórico",
    heroTitulo: "Quinua, Pueblo con Encanto, donde nació la libertad de América",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    descripcion:
      "A solo 45 minutos de Huamanga, en el distrito de Quinua, el Santuario Histórico Pampa de Ayacucho es el escenario donde el 9 de diciembre de 1824 el Ejército Unido Libertador selló la independencia de Sudamérica. Declarado Santuario Histórico en 1980, lo corona un obelisco de mármol de 44 metros, inaugurado en 1974 al cumplirse 150 años de la batalla, con las esculturas de los seis generales que la lideraron: Sucre, Córdova, La Mar, Miller, Lara y Gamarra. A pocos minutos, Quinua —distinguido oficialmente por el Mincetur como “Pueblo con Encanto” en 2024— mantiene viva la tradición de sus ceramistas, referente de la artesanía ayacuchana.",
    consejo:
      "Complementar la visita con una parada en el Complejo Arqueológico Wari, ubicado en el mismo camino.",
    escenas: "Historia, cielo abierto y memoria viva: así se vive la Pampa de Ayacucho.",
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
    nombreLista: "Amanecer de Puncupata y Cañones de Qorihuillca",
    categoria: "Paisaje Andino",
    heroTitulo: "Abismo de Puncupata, Puerta Celestial",
    imagen: "/imagenes-reales/abismo-puncupata/acantilado.webp",
    imagenSecundaria: "/imagenes-reales/abismo-puncupata/cornisa.webp",
    descripcion:
      "A unos 76 km de Huamanga —cerca de hora y media por carretera asfaltada— el Abismo de Puncupata se abre a 4,200 m.s.n.m. como uno de los desfiladeros más imponentes de Ayacucho. Un sendero peatonal habilitado por la comunidad local, de cerca de un kilómetro, lleva hasta su borde: un mirador natural con vistas a pueblos como Ccaccamarca y Chumbes. En el camino pastan vicuñas y, sobre el acantilado, planean las aves de altura. Se le conoce también como la “Puerta Celestial”, nombre que alude a su profundidad y a sus vistas panorámicas.",
    consejo:
      "Lleva ropa abrigadora e impermeable, botas resistentes, agua y algo de comer. A 4.200 m s. n. m., el clima puede cambiar rápidamente. Camina con precaución por el sendero, sigue las indicaciones de tu guía local y mantén una distancia segura del borde, especialmente si sufres de vértigo.",
    escenas: "Acantilados, vicuñas y paredes de roca entre la niebla: así se vive el Abismo de Puncupata.",
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
    galeriaTitulo: "Lugares cercanos para conocer",
    galeriaTexto:
      "En el camino al abismo, el tramo final de la carretera cruza pastizales donde viven vicuñas silvestres. Y hacia el lado contrario de la ciudad, a unos 40 minutos de Huamanga, están los Cañones de Qorihuillca, un laberinto de pasadizos de roca para una excursión de unas 4 horas.",
    galeria: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/vicuna-habitat.webp",
        titulo: "Vicuñas en el camino a Puncupata",
        descripcion:
          "En el tramo final de la carretera al abismo, a más de 4,000 m.s.n.m., es común ver vicuñas silvestres entre los pastizales. Cada año, de mayo a noviembre, las comunidades de la región realizan el chaccu, un ritual ancestral que esquila a las vicuñas con más fibra y las devuelve a su hábitat sin dañarlas.",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/canones-de-qorihuillca.webp",
        titulo: "Cañones de Qorihuillca",
        descripcion:
          "Al lado contrario de la ciudad, a 40 minutos de Huamanga, los Cañones de Qorihuillca conforman un laberinto rocoso de pasadizos oscuros, ideal para el turismo de aventura. Se sugiere visitarlos durante la mañana, siendo indispensable el acompañamiento de un guía especializado y equipo de seguridad.",
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
    nombreLista: "Vilcas Huamán, centro administrativo inca",
    categoria: "Arqueología Inca",
    heroTitulo: "Vilcas Huamán, la ciudad del halcón sagrado",
    imagen: "/imagenes-reales/vilcas-huaman/ushnu-aereo.webp",
    imagenSecundaria: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
    descripcion:
      "A unas dos horas de Huamanga, Vilcas Huamán se encuentra a 3.490 m s. n. m. y fue uno de los principales centros administrativos del Imperio inca. Su nombre proviene del quechua Willka Waman, que significa «halcón sagrado», y su importancia estuvo vinculada al Qhapaq Ñan, la red vial del Tahuantinsuyo.\n\nEn su complejo arqueológico destacan el Ushnu, una estructura ceremonial de piedra con doble jamba y el Asiento del Inca en su parte superior, y el Templo del Sol, cuyos cimientos fueron aprovechados durante la Colonia para construir la iglesia de San Juan Bautista.",
    consejo:
      "Lleva ropa abrigadora para las mañanas y tardes frías, calzado cómodo y bloqueador solar. Si no estás acostumbrado a la altura, evita realizar esfuerzos intensos al llegar. Recorre los monumentos con respeto y sigue las indicaciones del personal encargado para contribuir a la conservación de las estructuras incas.",
    seccionImagen: {
      imagen: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
      etiqueta: "Plaza de Vilcas Huamán",
    },
    escenas: "Conoce los principales monumentos incas y las vistas de Vilcas Huamán.",
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
    galeriaTitulo: "Cerca de Vilcas Huamán",
    galeriaTexto:
      "Si tienes tiempo, visita también el bosque de Puyas de Raimondi de Titankayocc y el complejo arqueológico de Intihuatana, junto a la laguna de Pumacocha. Ambos se encuentran en el distrito de Vischongo.",
    galeria: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/puyas-de-raimondi-de-titankayocc.webp",
        titulo: "Puyas de Raimondi de Titankayocc",
        descripcion:
          "En Vischongo, este bosque de Puyas de Raimondi se extiende entre los 3.800 y 4.500 m s. n. m. Sus enormes plantas destacan entre los pajonales de la puna andina.",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/ruinas-de-intihuatana.webp",
        titulo: "Ruinas de Intihuatana",
        descripcion:
          "Junto a la laguna de Pumacocha, este complejo arqueológico conserva construcciones incas de piedra y un reloj solar, en un entorno que combina historia y paisaje andino.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/ushnu.webp",
        titulo: "El Ushnu",
        descripcion: "Estructura ceremonial inca de piedra, ubicada en la plaza principal.",
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
        descripcion: "Una vista panorámica de la plaza y los restos de la antigua ciudad inca.",
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
    heroTitulo: "Ritipata, el apu sagrado que se viste de nieve",
    imagen: "/videos/hero/ritipata-poster.webp",
    imagenSecundaria: "/imagenes-reales/ritipata/laguna-nevado.webp",
    descripcion:
      "El Apu Ritipata es un nevado considerado sagrado que se alza a casi 5.000 m s. n. m. en la cordillera Chonta, distrito de Paras, provincia de Cangallo, a poco más de tres horas de Huamanga. Su nombre proviene del quechua *riti*, «nieve», y *pata*, «lugar elevado». Entre diciembre y abril suelen producirse nevadas.\n\nDe junio a septiembre, el cielo suele estar más despejado para recorrer sus lagunas, como la Ñawi, y visitar las cataratas cercanas. Desde el abra, a más de 4.900 m s. n. m., una caminata de media hora permite acercarse al nevado y contemplar el paisaje andino, donde también habitan alpacas, vicuñas y vizcachas silvestres.",
    consejo:
      "Para ver nieve, visita entre diciembre y abril, cuando suelen producirse nevadas, aunque su presencia depende de las condiciones climáticas. Lleva ropa térmica, gorro, guantes, chaqueta impermeable, agua y comida, ya que no hay restaurantes en el lugar. Aclimátate antes de subir a esa altitud.",
    escenas: "Nieve, lagunas de altura y alpacas: así se vive el Apu Ritipata.",
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
    galeriaTitulo: "Lugares cercanos para conocer",
    galeriaTexto:
      "La provincia de Cangallo también guarda cascadas y pozas donde el agua baja entre praderas y formaciones rocosas. La Catarata de Pumapaqcha y la Cascada de Ruqruqa son dos paradas que puedes incluir en el recorrido, especialmente entre junio y septiembre.",
    galeria: [
      {
        imagen: "/imagenes-reales/ritipata/pumapaqcha.webp",
        titulo: "Catarata de Pumapaqcha",
        descripcion:
          "En el distrito de Cangallo, la Catarata de Pumapaqcha cae unos 10 metros hasta una laguna natural. Se llega tras una caminata de aproximadamente media hora desde la carretera Ayacucho–Cangallo.",
      },
      {
        imagen: "/imagenes-reales/ritipata/ruqruqa.webp",
        titulo: "Cascada de Ruqruqa",
        descripcion:
          "A unas tres horas y media de Huamanga, en la comunidad de Quispillaccta, distrito de Chuschi, provincia de Cangallo, la Cascada de Ruqruqa forma pozas turquesas escalonadas. Si planeas recorrer sus senderos o entrar al agua, lleva ropa de baño y calzado antideslizante.",
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
        descripcion: "Lagunas de aguas tranquilas rodeadas de montañas y paisajes andinos.",
        video: "/videos/lugares-visitar/ritipata-lagunas.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-valle.webp",
        titulo: "Cumbres y valles andinos",
        descripcion: "Vistas panorámicas de cumbres, laderas rojizas y extensos valles.",
        video: "/videos/lugares-visitar/ritipata-valle.mp4",
      },
      {
        imagen: "/imagenes-reales/ritipata/escena-alpacas.webp",
        titulo: "Alpacas de las faldas",
        descripcion: "Alpacas pastando en las alturas, junto a las comunidades alpaqueras de la zona.",
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
      "A unas 3 horas y media de Huamanga, en la comunidad de Circamarca, distrito de Huancaraylla, provincia de Víctor Fajardo, se encuentran las Aguas Turquesas de Millpu. A más de 3.600 m s. n. m., cerca de 20 pozas naturales descienden entre las paredes rocosas de un cañón, formando uno de los paisajes más llamativos de Ayacucho.\n\nEl color turquesa de sus aguas se debe a la combinación de los minerales y la luz solar. Su nombre proviene del quechua millp'u, relacionado con la acción de tragar o ingerir; también se asocia con la leyenda local de la «garganta del diablo».",
    consejo:
      "Visita Millpu entre mayo y septiembre para apreciar mejor sus tonos turquesa, aunque el color puede variar según las lluvias. Lleva calzado con buen agarre para caminar por los senderos y respeta las indicaciones de conservación: está prohibido bañarse en las pozas.",
    escenas: "Pozas turquesas, cascadas y paredes de roca: descubre los paisajes de Millpu.",
    clipTags: ["Pozas escalonadas", "Caídas de agua entre terrazas", "Cañón de Millpu", "Poza al pie de la caída"],
    mapLat: -13.7207,
    mapLng: -74.1339,
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
    galeriaTitulo: "Lugares cercanos para conocer",
    galeriaTexto:
      "En la provincia de Víctor Fajardo, el distrito de Sarhua ofrece dos atractivos que complementan la visita: sus cascadas, rodeadas de montañas andinas, y sus tradicionales tablas pintadas, reconocidas como Patrimonio Cultural de la Nación.",
    galeria: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/cascadas-sarhua.webp",
        titulo: "Cascada de Sarhua",
        descripcion:
          "También conocidas como Campanayuq, estas cascadas forman una sucesión de caídas de agua entre cerros y vegetación andina. Para recorrer sus senderos, lleva calzado antideslizante y considera realizar la visita con tiempo suficiente.",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/tabla-sarhua.webp",
        titulo: "Las Tablas de Sarhua",
        descripcion:
          "Esta expresión artística tradicional representa historias familiares y escenas de la vida comunitaria sobre tablas de madera pintadas. Reconocidas como Patrimonio Cultural de la Nación en 2018, forman parte de la identidad cultural de Sarhua.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-pozas.webp",
        titulo: "Pozas escalonadas",
        descripcion: "Cerca de 20 piscinas naturales descienden en niveles, creando una sucesión de tonos turquesa.",
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
        descripcion: "Altas paredes rocosas enmarcan el curso del agua en un entorno natural de montaña.",
        video: "/videos/lugares-visitar/aguas-turquesas-canon.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/escena-caida.webp",
        titulo: "Poza al pie de la caída",
        descripcion: "El agua se reúne en una poza rodeada de roca, uno de los rincones más llamativos del recorrido.",
        video: "/videos/lugares-visitar/aguas-turquesas-caida.mp4",
      },
    ],
  },
];
