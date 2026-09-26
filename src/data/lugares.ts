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
  mapLat: number;
  mapLng: number;
  /** Mapa ilustrado de Ayacucho con el punto marcado (generado por encargo). Si falta, se usa el AyacuchoMiniMap trazado a mano. */
  mapaImagen?: string;
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
      "Ubicadas a casi 4 horas de Huamanga, en la provincia de Lucanas, las Aguas Turquesas de Millpu conforman una impresionante sucesión de más de 20 piscinas naturales escalonadas, a 3,500 m.s.n.m. en el interior de un cañón de paredes rocosas. Su color turquesa proviene de los minerales depositados en el lecho del río a lo largo de millones de años. El nombre viene del quechua millp'u (\"tragar\" o \"garganta\"): la leyenda local decía que sus aguas nacían de la boca del diablo, por lo que pocos se atrevían a visitarlas.",
    consejo:
      "Visitar de mayo a noviembre para disfrutar del vibrante color, llevar calzado de trekking.",
    frase: "Piscinas de turquesa entre paredes de piedra ancestral.",
    escenas: "Turquesa, piedra y agua en movimiento: así se vive Millpu.",
    clipTags: ["Piscinas turquesa", "Cañón de roca caliza", "Vizcachas al amanecer", "Aves rapaces andinas"],
    mapLat: -13.7207,
    mapLng: -74.1339,
    mapaImagen: "/imagenes-reales/mapas/aguas-turquesas.webp",
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
    nombre: "Catedral de Ayacucho",
    categoria: "Patrimonio Colonial",
    heroTitulo: "Donde la fe se viste de piedra y oro",
    imagen: "/imagenes-reales/seccion-turs/catedral-huamanga.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Catedral1.webp",
    descripcion:
      "En el corazón de la Plaza Mayor de Huamanga, esta majestuosa obra data de 1632, cuando el obispo Francisco Verdugo puso la primera piedra; la construcción tomó 40 años y fue consagrada en 1672 bajo la advocación de la Virgen de las Nieves. Su fachada barroca y sus tres naves —sostenidas por 18 columnas y 16 bóvedas— guardan altares tallados y bañados en pan de oro. Declarada Patrimonio Cultural de la Nación en 1972, es el único templo de la ciudad con tres puertas de ingreso al frontis.",
    consejo:
      "Complementar la visita con un recorrido por el centro histórico y sus templos coloniales aledaños.",
    frase: "Fe, oro y piedra en el corazón de Huamanga.",
    escenas: "Piedra, historia y luz dorada: así se vive la Catedral de Ayacucho.",
    clipTags: [
      "Fachada al atardecer",
      "Altares de pan de oro",
      "Procesión de Semana Santa",
      "Campanarios coloniales",
    ],
    mapLat: -13.1588,
    mapLng: -74.2239,
    mapaImagen: "/imagenes-reales/mapas/catedral-ayacucho.webp",
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
    nombre: "Ritipata",
    categoria: "Alta Montaña",
    heroTitulo: "Un abra silenciosa en el techo de los Andes",
    imagen: "/imagenes-reales/seccion-turs/ritipata.webp",
    imagenSecundaria: "/imagenes-reales/seccion-turs/ritipata-vicuna.webp",
    descripcion:
      "A más de 3 horas de Huamanga, en el distrito de Paras, provincia de Cangallo, Ritipata es un imponente nevado de casi 5,000 m.s.n.m. A sus pies se extiende la laguna Ñawi, de aguas turquesas, rodeada de vicuñas y vizcachas en estado salvaje. La mejor época para visitarlo es entre junio y septiembre, cuando el frío mantiene la nieve y el color de sus lagunas en su punto máximo.",
    consejo:
      "Aclimatarse previamente a la altitud, llevar ropa de abrigo y cámara fotográfica para las vicuñas.",
    frase: "Silencio, nieve y altura pura de los Andes.",
    escenas: "Nieve, silencio y altura pura: así se vive Ritipata.",
    clipTags: ["Vicuñas en la puna", "Nieve en el abra", "Lagunas de altura", "Silencio absoluto"],
    mapLat: -13.42917,
    mapLng: -74.69167,
    mapaImagen: "/imagenes-reales/mapas/ritipata.webp",
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
    nombre: "Pampa de Quinua",
    categoria: "Historia",
    heroTitulo: "El escenario donde nació la libertad de América",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    descripcion:
      "A solo 45 minutos de Huamanga, la Pampa de Quinua es el escenario donde el 9 de diciembre de 1824 el Ejército Unido Libertador selló la independencia de Sudamérica. La corona un obelisco de mármol de 44 metros, inaugurado en 1974 al cumplirse 150 años de la batalla, con las esculturas de los seis generales que la lideraron: Sucre, Córdova, La Mar, Miller, Lara y Gamarra.",
    consejo:
      "Complementar la visita con una parada en el Complejo Arqueológico Wari, ubicado en el mismo camino.",
    frase: "El lugar donde nació la libertad de un continente.",
    escenas: "Historia, cielo abierto y memoria viva: así se vive la Pampa de Quinua.",
    clipTags: ["Obelisco al amanecer", "Manos ceramistas", "Toritos de Quinua", "Ruinas de Wari"],
    mapLat: -13.0478,
    mapLng: -74.1322,
    mapaImagen: "/imagenes-reales/mapas/pampa-quinua.webp",
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
    slug: "titankayocc",
    numeral: "V",
    nombre: "Bosque de Titankayocc",
    categoria: "Flora Andina",
    heroTitulo: "Donde la reina de los Andes florece una vez en un siglo",
    imagen: "/imagenes-reales/galeria/destino/Pullas1.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Pullas2.webp",
    descripcion:
      "A poco más de 2 horas de Huamanga, en el distrito de Vischongo (provincia de Vilcas Huamán) y a 3,800 m.s.n.m., Titankayocc alberga el bosque de Puyas de Raimondi más grande y denso del planeta: 1,200 hectáreas declaradas Área de Conservación Regional. Cada planta alcanza entre 8 y 12 metros de altura y, al florecer una sola vez en su vida, produce una espiga con hasta 5,000 flores y 6 millones de semillas. El bosque es también refugio de 56 especies de aves, entre ellas el colibrí gigante, de hasta 30 centímetros.",
    consejo:
      "Llevar ropa abrigadora y aclimatarse previamente a la altitud para disfrutar de este santuario único en el mundo.",
    frase: "Una flor que espera cien años para abrirse una sola vez.",
    escenas: "Gigantes verdes, cielo abierto y cien años de espera: así se vive Titankayocc.",
    clipTags: [
      "Espigas de 10 metros",
      "Colibrí gigante andino",
      "Puma andino en la puna",
      "Amanecer entre puyas",
    ],
    mapLat: -13.6508,
    mapLng: -73.9522,
    mapaImagen: "/imagenes-reales/mapas/bosque-titankayocc.webp",
    galeria: [
      {
        imagen: "/imagenes-reales/galeria/destino/Pullas1.webp",
        titulo: "El bosque más grande del mundo",
        descripcion: "1,200 hectáreas de puyas en el distrito de Vischongo.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Pullas2.webp",
        titulo: "Espigas centenarias",
        descripcion: "Cada planta florece una sola vez, tras 80 a 100 años de vida.",
      },
      {
        imagen: "/imagenes-reales/galeria/destino/Pullas3.webp",
        titulo: "Refugio de fauna alto andina",
        descripcion: "Hogar del colibrí gigante, el puma y el gato andino.",
      },
    ],
  },
];
