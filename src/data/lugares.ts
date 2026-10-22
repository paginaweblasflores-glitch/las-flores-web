export type GaleriaItem = { imagen: string; titulo: string; descripcion: string };

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
  consejo: string;
  frase: string;
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
  /** Solo presente cuando hay suficiente material fotográfico real para una mini-galería. */
  galeria?: GaleriaItem[];
};

export const lugares: Lugar[] = [
  {
    id: 1,
    slug: "millpu",
    numeral: "I",
    nombre: "Aguas Turquesas de Millpu",
    categoria: "Naturaleza",
    heroTitulo: "Un cañón donde el agua se vuelve turquesa",
    imagen: "/imagenes-reales/seccion-turs/millpu.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Turquesa3.webp",
    descripcion:
      "A unas 4 horas de Huamanga, en la comunidad de Circamarca (distrito de Huancaraylla, provincia de Víctor Fajardo), las Aguas Turquesas de Millpu forman uno de los atractivos naturales más emblemáticos de Ayacucho: un circuito de cerca de 20 piscinas naturales escalonadas, a más de 3,600 m.s.n.m. en el interior de un cañón de paredes rocosas. Su color turquesa nace de la combinación de los minerales del agua y la luz del sol. El nombre viene del quechua millp'u (\"tragar\" o \"garganta\"): la leyenda local decía que sus aguas nacían de la boca del diablo, por lo que pocos se atrevían a visitarlas.",
    consejo:
      "Visitar de mayo a noviembre para disfrutar del vibrante color y llevar calzado de trekking. Para proteger el ecosistema, no está permitido nadar en las pozas.",
    frase: "Piscinas de turquesa entre paredes de piedra ancestral.",
    escenas: "Turquesa, piedra y agua en movimiento: así se vive Millpu.",
    clipTags: ["Piscinas turquesa", "Cañón de roca caliza", "Vizcachas al amanecer", "Aves rapaces andinas"],
    mapLat: -13.7207,
    mapLng: -74.1339,
    mapaImagen: "/imagenes-reales/mapas/aguas-turquesas.webp",
    video: {
      hero: "/videos/hero/aguas-turquesas.mp4",
      heroMobile: "/videos/hero/aguas-turquesas-mobile.mp4",
      poster: "/videos/hero/aguas-turquesas-poster.webp",
    },
    galeria: [
      {
        imagen: "/imagenes-reales/seccion-turs/millpu.webp",
        titulo: "Piscinas escalonadas",
        descripcion: "Terrazas naturales talladas por el agua durante siglos.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/millpu-aves-rapaces.webp",
        titulo: "Aves rapaces andinas",
        descripcion: "Halcones y cernícalos sobrevuelan el cañón en busca de presa.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Turquesa3.webp",
        titulo: "Cañón de flora andina",
        descripcion: "Sancayos, tunas e ichu cubren las paredes de roca.",
      },
    ],
  },
  {
    id: 4,
    slug: "catedral-de-ayacucho",
    numeral: "II",
    nombre: "Basílica Catedral de Ayacucho",
    categoria: "Patrimonio Colonial",
    heroTitulo: "Donde la fe se viste de piedra y oro",
    imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Catedral1.webp",
    descripcion:
      "En el corazón de la Plaza Mayor de Huamanga —la ciudad de las 33 iglesias—, la Basílica Catedral de Nuestra Señora de las Nieves data de 1632, cuando el obispo Francisco Verdugo puso la primera piedra; la construcción tomó 40 años y fue consagrada en 1672 bajo la advocación de la Virgen de las Nieves. Su fachada, de líneas renacentistas y barrocas, y sus tres naves —sostenidas por 18 columnas y 16 bóvedas— guardan diez retablos tallados y bañados en pan de oro. Declarada Patrimonio Cultural de la Nación en 1972, abre su frontis con tres portadas sobre la Plaza Mayor.",
    consejo:
      "Complementar la visita con un recorrido por el centro histórico y sus templos coloniales aledaños.",
    frase: "Fe, oro y piedra en el corazón de Huamanga.",
    escenas: "Piedra, historia y luz dorada: así se vive la Basílica Catedral de Ayacucho.",
    clipTags: [
      "Fachada al atardecer",
      "Altares de pan de oro",
      "Procesión de Semana Santa",
      "Campanarios coloniales",
    ],
    mapLat: -13.1588,
    mapLng: -74.2239,
    mapaImagen: "/imagenes-reales/mapas/basilica-catedral.webp",
    galeria: [
      {
        imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
        titulo: "Fachada renacentista",
        descripcion: "Piedra labrada del siglo XVII frente a la Plaza Mayor.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Catedral2.webp",
        titulo: "Altar de pan de oro",
        descripcion: "Retablos bañados en oro, obra de artesanos ayacuchanos.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/catedral-semana-santa.webp",
        titulo: "Cuna de la Semana Santa",
        descripcion: "Punto de partida de las procesiones más importantes del Perú.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Catedral1.webp",
        titulo: "La catedral de noche",
        descripcion: "Su iluminación resalta cada detalle tallado en piedra.",
      },
    ],
  },
  {
    id: 5,
    slug: "ritipata",
    numeral: "III",
    nombre: "Nevado Ritipata",
    categoria: "Alta Montaña",
    heroTitulo: "Un abra silenciosa en el techo de los Andes",
    imagen: "/imagenes-reales/seccion-turs/ritipata.webp",
    imagenSecundaria: "/imagenes-reales/seccion-turs/ritipata-vicuna.webp",
    descripcion:
      "A más de 3 horas de Huamanga, en el distrito de Paras, provincia de Cangallo, el Nevado Ritipata —del quechua riti, “nieve”, y pata, “lugar elevado”— es un imponente nevado de casi 5,000 m.s.n.m. de la cordillera Chonta. A sus pies se extiende la laguna Ñawi, de aguas turquesas, rodeada de vicuñas y vizcachas en estado salvaje. La mejor época para visitarlo es entre junio y septiembre, cuando el frío mantiene la nieve y el color de sus lagunas en su punto máximo.",
    consejo:
      "Aclimatarse previamente a la altitud, llevar ropa de abrigo y cámara fotográfica para las vicuñas.",
    frase: "Silencio, nieve y altura pura de los Andes.",
    escenas: "Nieve, silencio y altura pura: así se vive el Nevado Ritipata.",
    clipTags: ["Vicuñas en la puna", "Nieve en el abra", "Lagunas de altura", "Silencio absoluto"],
    mapLat: -13.42917,
    mapLng: -74.69167,
    mapaImagen: "/imagenes-reales/mapas/ritipata.webp",
    video: {
      hero: "/videos/hero/ritipata.mp4",
      heroMobile: "/videos/hero/ritipata-mobile.mp4",
      poster: "/videos/hero/ritipata-poster.webp",
    },
    galeria: [
      {
        imagen: "/imagenes-reales/seccion-turs/ritipata-vicuna.webp",
        titulo: "Vicuñas en libertad",
        descripcion: "Manadas silvestres que pastan a casi 5,000 msnm.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/ritipata.webp",
        titulo: "Lagunas de altura",
        descripcion: "Espejos de agua entre la nieve y la roca andina.",
      },
    ],
  },
  {
    id: 2,
    slug: "pampa-de-quinua",
    numeral: "IV",
    nombre: "Pampa de Ayacucho",
    categoria: "Santuario Histórico",
    heroTitulo: "Quinua, Pueblo con Encanto, donde nació la libertad de América",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    descripcion:
      "A solo 45 minutos de Huamanga, en el distrito de Quinua, el Santuario Histórico Pampa de Ayacucho es el escenario donde el 9 de diciembre de 1824 el Ejército Unido Libertador selló la independencia de Sudamérica. Declarado Santuario Histórico en 1980, lo corona un obelisco de mármol de 44 metros, inaugurado en 1974 al cumplirse 150 años de la batalla, con las esculturas de los seis generales que la lideraron: Sucre, Córdova, La Mar, Miller, Lara y Gamarra. A pocos minutos, Quinua —distinguido oficialmente por el Mincetur como “Pueblo con Encanto” en 2024— mantiene viva la tradición de sus ceramistas, referente de la artesanía ayacuchana.",
    consejo:
      "Complementar la visita con una parada en el Complejo Arqueológico Wari, ubicado en el mismo camino.",
    frase: "El lugar donde nació la libertad de un continente.",
    escenas: "Historia, cielo abierto y memoria viva: así se vive la Pampa de Ayacucho.",
    clipTags: ["Obelisco al amanecer", "Manos ceramistas", "Toritos de Quinua", "Ruinas de Wari"],
    mapLat: -13.0478,
    mapLng: -74.1322,
    mapaImagen: "/imagenes-reales/mapas/pampa-ayacucho.webp",
    galeria: [
      {
        imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
        titulo: "Obelisco conmemorativo",
        descripcion: "Erigido en honor a la batalla que selló la independencia.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/quinua-ceramica.webp",
        titulo: "Cerámica artesanal de Quinua",
        descripcion: "Iglesitas de techo que protegen los hogares, hechas a mano.",
      },
      {
        imagen: "/imagenes-reales/seccion-turs/complejo-wari.webp",
        titulo: "De camino a Quinua",
        descripcion: "El Complejo Arqueológico Wari, capital preincaica, queda en la misma ruta.",
      },
    ],
  },
  {
    id: 6,
    slug: "abismo-puncupata",
    numeral: "V",
    nombre: "Abismo de Puncupata",
    categoria: "Paisaje Andino",
    heroTitulo: "Donde el cielo se asoma al abismo",
    imagen: "/imagenes-reales/abismo-puncupata/acantilado.webp",
    imagenSecundaria: "/imagenes-reales/abismo-puncupata/cornisa.webp",
    descripcion:
      "A unos 76 km de Huamanga —cerca de hora y media por carretera asfaltada— el Abismo de Puncupata se abre a 4,200 m.s.n.m. como uno de los desfiladeros más imponentes de Ayacucho. Un sendero peatonal habilitado por la comunidad local, de cerca de un kilómetro, lleva hasta su borde: un mirador natural con vistas a pueblos como Ccaccamarca y Chumbes. En el camino pastan vicuñas y, sobre el acantilado, planean las aves de altura. Se le conoce también como la “Puerta Celestial”, nombre que alude a su profundidad y a sus vistas panorámicas.",
    consejo:
      "Lleva ropa abrigadora e impermeable, botas firmes, agua y algo de comer: a 4,200 m el clima cambia rápido. Camina con calma por el sendero, sigue a tu guía local y, si sufres de vértigo, mantén distancia del borde.",
    frase: "Una puerta abierta al cielo, al borde del abismo.",
    escenas: "Acantilados, vicuñas y cielo abierto: así se vive el Abismo de Puncupata.",
    clipTags: [
      "Borde del acantilado",
      "Vicuñas en la puna",
      "Ave sobre el abismo",
      "Mirador a 4,200 m",
    ],
    mapaImagen: "/imagenes-reales/mapas/abismo-puncupata.webp",
    video: {
      hero: "/videos/hero/abismo-puncupata.mp4",
      heroMobile: "/videos/hero/abismo-puncupata-mobile.mp4",
      poster: "/videos/hero/abismo-puncupata-poster.webp",
    },
    galeria: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/borde-del-abismo.webp",
        titulo: "El borde del abismo",
        descripcion: "Un sendero comunitario recorre el filo del acantilado, a 4,200 m.s.n.m.",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/vicunas.webp",
        titulo: "Vicuñas en la puna",
        descripcion: "Es común cruzarse con ellas en el tramo final del camino.",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/ave-sobre-el-abismo.webp",
        titulo: "Cielo de altura",
        descripcion: "Las aves planean sobre las paredes del desfiladero.",
      },
    ],
  },
  {
    id: 7,
    slug: "vilcas-huaman",
    numeral: "VI",
    nombre: "Vilcas Huamán",
    categoria: "Arqueología Inca",
    heroTitulo: "La ciudad del halcón sagrado, corazón inca de Ayacucho",
    imagen: "/imagenes-reales/vilcas-huaman/ushnu-aereo.webp",
    imagenSecundaria: "/imagenes-reales/vilcas-huaman/iglesia-san-juan-bautista.webp",
    descripcion:
      "A unas 3 horas de Huamanga —cerca de 120 km hacia el sur— y a 3,490 m.s.n.m., Vilcas Huamán (del quechua Willka Waman, “halcón sagrado”) fue un importante centro administrativo del Imperio inca, levantado sobre el Qhapaq Ñan tras la conquista de los chancas y los pocras. Su Complejo Arqueológico de Vilcashuamán conserva, alrededor de una gran plaza ceremonial, el Ushnu —una pirámide truncada de ingreso con doble jamba, coronada por el Asiento del Inca— y el Templo del Sol, sobre cuyas bases se alzó durante la Colonia la iglesia de San Juan Bautista. Hoy es la capital de la provincia de Vilcas Huamán.",
    consejo:
      "Visita entre mayo y septiembre, cuando el cielo está más despejado. Lleva bloqueador, gorro y ropa de abrigo, aclimátate antes a la altura y recorre el complejo con un guía local, sin trepar a los muros incas.",
    frase: "Un asiento de piedra para el Inca y un halcón sagrado en su nombre.",
    escenas: "Piedra inca, plaza ceremonial y cielo andino: así se vive Vilcas Huamán.",
    clipTags: ["Ushnu inca", "Templo del Sol", "Plaza ceremonial", "Halcón sagrado"],
    mapaImagen: "/imagenes-reales/mapas/vilcas-huaman.webp",
    video: {
      hero: "/videos/hero/vilcashuaman.mp4",
      heroMobile: "/videos/hero/vilcashuaman-mobile.mp4",
      poster: "/videos/hero/vilcashuaman-poster.webp",
    },
    galeria: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/ushnu.webp",
        titulo: "El Ushnu",
        descripcion: "Pirámide truncada de piedra inca, centro ceremonial de la plaza.",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/plaza-aerea.webp",
        titulo: "Una ciudad sobre el Qhapaq Ñan",
        descripcion: "Vilcas Huamán vista desde el aire, con su plaza y las ruinas incas.",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/monumento-inca.webp",
        titulo: "El halcón sagrado",
        descripcion: "Un monumento al Inca junto a un halcón recibe al visitante.",
      },
    ],
  },
];
