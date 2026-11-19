/** `video` (opcional): clip corto que se reproduce en lugar de la foto; `imagen` queda como póster. */
export type GaleriaItem = {
  imagen: string;
  titulo: string;
  descripcion: string;
  video?: string;
  /** Punto de enfoque del recorte de la foto en la tarjeta (CSS `object-position`); por defecto, el centro. */
  posicion?: string;
};

/** Escena de la sección "Detalles de …": clip en bucle (`video`) con la foto como póster, y su título y descripción debajo. */
export type EscenaCard = { imagen: string; titulo: string; descripcion: string; video?: string };

export type Lugar = {
  id: number;
  slug: string;
  numeral: string;
  nombre: string;
  /** Nombre más general que se muestra solo en la lista "Explora más lugares para visitar"; si falta se usa `nombre`. */
  nombreLista?: string;
  categoria: string;
  /** Texto corto para la tarjeta de la lista del inicio (una o dos frases); si falta se usa `metaDescripcion`. */
  resumen?: string;
  /** Provincia donde queda el lugar: se muestra junto al punto del mapa de ubicación. */
  provincia: string;
  /** Capa del mapa que pinta suavemente esa provincia (opcional). */
  provinciaSombreada?: string;
  heroTitulo: string;
  /** Texto corto para buscadores y redes (una o dos frases); si falta se usa `descripcion`. */
  metaDescripcion?: string;
  imagen: string;
  /** Foto distinta para la tarjeta del carrusel del inicio (si falta se usa `imagen`, la misma del hero de la página). */
  imagenTarjeta?: string;
  /** Punto de enfoque del recorte de la foto de la tarjeta (CSS `object-position`); por defecto, el centro. */
  posicionTarjeta?: string;
  imagenSecundaria: string;
  tituloPresentacion?: string;
  /** Párrafos separados por una línea en blanco; *texto* se muestra en cursiva. */
  descripcion: string;
  /** Texto del panel "Consejo de visita"; si falta, no se muestra el panel. */
  consejo?: string;
  /** Imagen a pantalla completa con una etiqueta encima, entre el mapa y la galería (opcional). */
  seccionImagen?: { imagen: string; etiqueta: string };
  /** Título de la sección de clips ("Detalles de …"); va sin descripción. */
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
  /** Etiqueta (y texto alternativo) de la foto a pantalla completa; si falta se usa el nombre del lugar. */
  etiquetaPantalla?: string;
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
    categoria: "Plaza histórica",
    resumen: "Se conoce como Parque Sucre por el monumento a Antonio José de Sucre, el Gran Mariscal que comandó al ejército patriota en la Batalla de Ayacucho de 1824.",
    provincia: "Huamanga",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-huamanga.webp",
    heroTitulo: "Catedral de Ayacucho, Patrimonio Cultural de la Nación",
    imagen: "/imagenes-reales/catedral-de-ayacucho/plaza-de-sucre.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Catedral1.webp",
    tituloPresentacion: "Un legado que permanece en el corazón de Huamanga",
    descripcion:
      "Frente al lado este de la Plaza Mayor se alza la Basílica Catedral de Ayacucho, templo dedicado a Nuestra Señora de las Nieves. Su edificación inició en 1632 con la primera piedra colocada por el obispo Francisco Verdugo y concluyó en 1672.\n\nDe estilo renacentista y barroco, su fachada presenta tres portadas de acceso. Por dentro, 18 columnas sostienen tres amplias naves que albergan diez retablos tallados y recubiertos en pan de oro. En 1972 fue declarada Patrimonio Cultural de la Nación.",
    metaDescripcion:
      "Basílica Catedral de Ayacucho, en la Plaza Mayor de Huamanga. Se construyó entre 1632 y 1672 y guarda diez retablos con pan de oro.",
    consejo:
      "Visita la Catedral por la mañana para apreciar su arquitectura con tranquilidad. Si deseas conocer el interior, consulta previamente los horarios de ingreso, ya que pueden variar por las celebraciones religiosas. Aprovecha también para recorrer la Plaza Mayor y sus alrededores.",
    escenasTitulo: "Detalles de la Basílica Catedral",
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
    galeriaTitulo: "¿Qué más visitar en Huamanga?",
    galeria: [
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/plaza-mayor-de-huamanga.webp",
        titulo: "Plaza Mayor de Huamanga",
        descripcion:
          "Rodeada de casonas de los siglos XVI y XVII con arquerías de piedra en su primer nivel, es el punto de encuentro principal de la ciudad. En su lado este se alza la Basílica Catedral.",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/arco-del-triunfo.webp",
        posicion: "50% 54%",
        titulo: "Arco del Triunfo",
        descripcion:
          "Levantado en 1910 para conmemorar la victoria del combate del 2 de Mayo, este monumento histórico se ubica a solo cuatro minutos a pie de la Plaza Mayor.",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/catedral-santo-domingo.webp",
        titulo: "Templo de Santo Domingo",
        descripcion:
          "Construido entre los siglos XVI y XVII, este templo destaca por su fachada de tres arcos y dos torres. Se encuentra a unos tres minutos a pie de la Plaza Mayor, en la esquina de los jirones 9 de Diciembre y María Parado de Bellido.",
      },
      {
        imagen: "/imagenes-reales/catedral-de-ayacucho/mirador-de-acuchimay.webp",
        titulo: "Mirador de Acuchimay",
        descripcion:
          "Ubicado en la cima del cerro Acuchimay, en el distrito de Carmen Alto, ofrece una vista panorámica de 360 grados de toda la ciudad. Se encuentra a 2865 m s. n. m., a unos diez minutos en vehículo de la Plaza Mayor y el ingreso es libre.",
      },
    ],
  },
  {
    id: 2,
    slug: "pampa-de-quinua",
    numeral: "II",
    nombre: "Pampa de Ayacucho",
    nombreLista: "Quinua, Pueblo con Encanto",
    categoria: "Santuario histórico",
    resumen: "El Santuario Histórico donde se libró la batalla de Ayacucho en 1824, a unos cuarenta y cinco minutos de Huamanga.",
    provincia: "Huamanga",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-huamanga.webp",
    heroTitulo: "Quinua, Pueblo con Encanto",
    imagen: "/imagenes-reales/galeria/destino/Quinua1.webp",
    imagenTarjeta: "/imagenes-reales/pampa-de-ayacucho/quinua-obelisco.webp",
    posicionTarjeta: "8% 50%",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    metaDescripcion:
      "Santuario Histórico donde se libró la batalla de Ayacucho en 1824, a unos cuarenta y cinco minutos de Huamanga. Obelisco de 44 metros y cerámica de Quinua.",
    descripcion:
      "Ubicado en el distrito de Quinua a unos cuarenta y cinco minutos en vehículo de Huamanga, este santuario fue el escenario donde el 9 de diciembre de 1824 el Ejército Unido Libertador selló la independencia de Sudamérica. En 1980 fue declarado Santuario Histórico y hoy está coronado por un obelisco de 44 metros revestido de mármol.\n\nA pocos minutos se encuentra el pueblo de Quinua, distinguido en 2024 por el Mincetur como «Pueblo con Encanto» gracias a su autenticidad cultural y natural. Allí, los artesanos moldean la arcilla local para crear los tradicionales toritos de techo, iglesias en miniatura y figuras costumbristas, saberes reconocidos como Patrimonio Cultural de la Nación desde 2019.",
    consejo:
      "A unos 3400 m s. n. m. el clima es frío y el sol es fuerte, así que lleva abrigo, protector solar y agua. De enero a marzo llueve, por eso conviene sumar un impermeable.",
    escenasTitulo: "Detalles de Quinua",
    clipTags: ["El obelisco", "Cerámica de Quinua", "Abuelos de Quinua", "Escenificación de la batalla"],
    mapLat: -13.0811,
    mapLng: -74.1322,
    video: {
      hero: "/videos/hero/pampa-de-ayacucho.mp4",
      heroMobile: "/videos/hero/pampa-de-ayacucho-mobile.mp4",
      poster: "/videos/hero/pampa-de-ayacucho-poster.webp",
    },
    seccionImagen: {
      imagen: "/imagenes-reales/pampa-de-ayacucho/quinua-obelisco.webp",
      etiqueta: "Obelisco de la Pampa de Ayacucho",
    },
    videoSeccion: {
      src: "/imagenes-reales/pampa-de-ayacucho/pueblo-de-quinua.mp4",
      srcMobile: "/imagenes-reales/pampa-de-ayacucho/pueblo-de-quinua-mobile.mp4",
      poster: "/imagenes-reales/pampa-de-ayacucho/pueblo-de-quinua-poster.webp",
      etiqueta: "Pueblo de Quinua",
    },
    escenasCards: [
      {
        imagen: "/imagenes-reales/pampa-de-ayacucho/escena-obelisco.webp",
        titulo: "El obelisco",
        descripcion: "Mide 44 metros y se alza en el lugar donde se libró la batalla de Ayacucho.",
        video: "/imagenes-reales/pampa-de-ayacucho/pampa-obelisco-clip.mp4",
      },
      {
        imagen: "/imagenes-reales/pampa-de-ayacucho/escena-figuras.webp",
        titulo: "Cerámica de Quinua",
        descripcion: "Sus raíces combinan la herencia de la cultura Wari con influencias coloniales.",
        video: "/imagenes-reales/pampa-de-ayacucho/pampa-figuras.mp4",
      },
      {
        imagen: "/imagenes-reales/pampa-de-ayacucho/escena-abuelos.webp",
        titulo: "Abuelos de Quinua",
        descripcion: "Reconocida comparsa carnavalesca y danza tradicional originaria del distrito de Quinua.",
        video: "/imagenes-reales/pampa-de-ayacucho/pampa-abuelos.mp4",
      },
      {
        imagen: "/imagenes-reales/pampa-de-ayacucho/escena-escenificacion.webp",
        titulo: "Escenificación de la batalla",
        descripcion: "Cada 9 de diciembre se recrea la batalla de Ayacucho en la pampa.",
        video: "/imagenes-reales/pampa-de-ayacucho/pampa-escenificacion.mp4",
      },
    ],
    galeriaTitulo: "En el camino hacia la Pampa de Ayacucho",
    galeria: [
      {
        imagen: "/imagenes-reales/pampa-de-ayacucho/wari.webp",
        titulo: "Complejo Arqueológico Wari",
        descripcion:
          "Antigua capital del Estado Wari entre los años 600 y 1100 d. C., este sitio se encuentra a unos treinta minutos en vehículo desde Huamanga, en la ruta hacia Quinua y la Pampa de Ayacucho. Por su ubicación en el camino, conviene visitarlo primero y continuar después hacia ambos destinos.",
      },
      {
        imagen: "/imagenes-reales/pampa-de-ayacucho/iglesia-quinua.webp",
        titulo: "Cerámica de Quinua",
        descripcion:
          "Declarado Patrimonio Cultural de la Nación en 2019, este arte tradicional ayacuchano se elabora íntegramente con arcilla local. Para apreciar y adquirir sus piezas es necesario visitar el pueblo de Quinua, ubicado a unos cincuenta minutos en vehículo desde Huamanga, justo antes de llegar a la Pampa de Ayacucho.",
      },
    ],
  },
  {
    id: 8,
    slug: "canones-de-qorihuillca",
    numeral: "III",
    nombre: "Cañones de Qorihuillca",
    tituloPresentacion: "Donde las montañas esconden pasadizos de roca",
    categoria: "Turismo de aventura",
    resumen: "Siete cañones de roca con pasadizos tan angostos que casi no entra la luz, a unos cuarenta minutos de Huamanga.",
    provincia: "Huamanga",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-huamanga.webp",
    heroTitulo: "Cañones de Qorihuillca, un laberinto de roca",
    metaDescripcion:
      "Un laberinto de pasadizos de roca a unos cuarenta minutos de Huamanga. Qué ver y qué llevar.",
    // Fotos provisionales mientras llegan los videos y los clips propios del lugar.
    imagen: "/imagenes-reales/canones-de-qorihuillca/canones-de-qorihuillca.webp",
    // La tarjeta del inicio usa la misma foto de la sección Consejo de visita.
    imagenTarjeta: "/imagenes-reales/canones-de-qorihuillca/canones-consejo.webp",
    posicionTarjeta: "54% 50%",
    // Foto de la sección a pantalla completa del final de la página (la misma de la escena "Rapel con equipo").
    imagenPantalla: "/imagenes-reales/canones-de-qorihuillca/tours-rapel.webp",
    imagenSecundaria: "/imagenes-reales/canones-de-qorihuillca/fondo-del-canon.webp",
    seccionImagen: {
      imagen: "/imagenes-reales/canones-de-qorihuillca/canones-consejo.webp",
      etiqueta: "Cañones de Qorihuillca",
    },
    descripcion:
      "A unos cuarenta minutos de Huamanga, la montaña se abre en pasadizos tan angostos que en algunos tramos casi no entra la luz. Son los siete cañones de Qorihuillca, un laberinto natural que el agua fue tallando con el paso del tiempo.\n\nSus paredes alcanzan entre veinticinco y cincuenta metros de altura, muchas de ellas curvas y teñidas de distintos tonos. Este escenario resulta ideal para el turismo de aventura, con rutas de caminata y descenso en rapel.",
    consejo:
      "Ve por la mañana y con un guía especializado, que es indispensable. Usa el equipo de seguridad que indique tu guía y ropa cómoda de abrigo. Evita los pantalones cortos por lo estrecho de algunos tramos. Si ves murciélagos o insectos, los guías indican que no representan peligro.",
    escenasTitulo: "Detalles de los Cañones de Qorihuillca",
    clipTags: ["Pasadizos de roca", "Cielo entre paredes", "Descenso en rapel", "Rapel con equipo"],
    // Ubicación aproximada (unos cuatro kilómetros al noroeste del centro de Huamanga); el mapa es referencial.
    mapLat: -13.13,
    mapLng: -74.25,
    galeriaTitulo: "Otros lugares por descubrir cerca de Huamanga",
    galeria: [
      {
        imagen: "/imagenes-reales/canones-de-qorihuillca/chullpas-de-huancayocc.webp",
        posicion: "45% 50%",
        titulo: "Huanta, la Esmeralda de los Andes",
        descripcion:
          "Ubicada a unos cuarenta y cinco minutos de Huamanga, esta ciudad destaca por su clima templado y sus miradores. A solo cinco minutos de su plaza principal se alza el Cristo Blanco, una estatua de más de veinte metros que ofrece una vista panorámica del valle. Además, a media hora del centro, en el poblado de Huancayocc, se pueden visitar la catarata de Occochaca, las chullpas y la ciudadela de piedra de Huayra Patamarca.",
      },
      {
        imagen: "/imagenes-reales/canones-de-qorihuillca/cueva-de-pikimachay.webp",
        posicion: "35% 50%",
        titulo: "Cueva de Pikimachay",
        descripcion:
          "Con unos veinticuatro metros de ancho, esta caverna es famosa por el hallazgo de herramientas de piedra con más de veinte mil años de antigüedad. Se encuentra en el distrito de Pacaycasa, a cincuenta minutos de Huamanga, y su ingreso es gratuito.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/canones-de-qorihuillca/canones-de-qorihuillca.webp",
        titulo: "Pasadizos de roca",
        descripcion: "Un visitante recorre un pasadizo angosto entre paredes de roca.",
      },
      {
        imagen: "/imagenes-reales/canones-de-qorihuillca/fondo-del-canon.webp",
        titulo: "Cielo entre paredes",
        descripcion: "Desde el fondo, las paredes se cierran y dejan ver apenas una franja de cielo.",
      },
      {
        imagen: "/imagenes-reales/canones-de-qorihuillca/rapel-guiado.webp",
        titulo: "Descenso en rapel",
        descripcion: "Una persona baja en rapel por una pared de roca de tonos anaranjados.",
      },
      {
        imagen: "/imagenes-reales/canones-de-qorihuillca/tours-rapel.webp",
        titulo: "Rapel con equipo",
        descripcion: "Dos personas con casco y cuerdas durante un descenso en rapel.",
      },
    ],
  },
  {
    id: 6,
    slug: "abismo-puncupata",
    numeral: "IV",
    nombre: "Abismo de Puncupata",
    tituloPresentacion: "Un profundo desfiladero en los Andes",
    nombreLista: "Abismo de Puncupata",
    categoria: "Paisaje andino",
    resumen: "Un desfiladero a 4200 m s. n. m. con un sendero hasta su borde, a una hora y media de Huamanga.",
    provincia: "Huamanga",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-huamanga.webp",
    heroTitulo: "Abismo de Puncupata, donde el cielo y la tierra se unen",
    metaDescripcion:
      "Un desfiladero a 4200 m s. n. m., a una hora y media de Huamanga. Qué ver y qué llevar.",
    imagen: "/imagenes-reales/abismo-puncupata/acantilado.webp",
    imagenTarjeta: "/imagenes-reales/abismo-puncupata/acantilado-card.webp",
    posicionTarjeta: "75% 50%",
    imagenSecundaria: "/imagenes-reales/abismo-puncupata/cornisa.webp",
    seccionImagen: {
      imagen: "/imagenes-reales/abismo-puncupata/abismo-consejo.webp",
      etiqueta: "Abismo de Puncupata",
    },
    descripcion:
      "A una hora y media en vehículo de Huamanga, el Abismo de Puncupata se encuentra a unos 4200 m s. n. m. y destaca por su imponente caída vertical.\n\nUn sendero peatonal de un kilómetro, habilitado por la comunidad local, llega hasta el borde y ofrece vistas de los pueblos de Ccaccamarca y Chumbes. En el camino pastan vicuñas y sobre el acantilado planean las aves de altura. Se le conoce también como la «Puerta Celestial», nombre que alude a su enorme abismo y a su amplitud panorámica.",
    consejo:
      "Lleva ropa abrigadora e impermeable, botas resistentes, agua y algo de comer. A 4200 m s. n. m. el clima puede cambiar rápidamente. Camina con precaución por el sendero y sigue las indicaciones de tu guía local. Mantén una distancia segura del borde, especialmente si sufres de vértigo.",
    escenasTitulo: "Detalles de Puncupata",
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
      src: "/videos/lugares-visitar/abismo-puncupata-seccion.mp4",
      srcMobile: "/videos/lugares-visitar/abismo-puncupata-seccion-mobile.mp4",
      poster: "/videos/lugares-visitar/abismo-puncupata-seccion-poster.webp",
      etiqueta: "Abismo de Puncupata",
    },
    galeriaTitulo: "Más lugares por descubrir en el camino",
    // Dos pueblos del recorrido por la carretera a Vilcas Huamán.
    galeria: [
      {
        imagen: "/imagenes-reales/abismo-puncupata/condorcocha.webp",
        titulo: "Pueblo de Condorcocha",
        descripcion:
          "Ubicado a unos cuarenta y cinco minutos de Huamanga, junto a la carretera hacia Vilcas Huamán y Cangallo, este acogedor poblado es una parada habitual para los viajeros. Su gente destaca por su amabilidad y ofrece caldo caliente para desayunar en las mañanas frías, además de queso y yogur artesanales.",
      },
      {
        imagen: "/imagenes-reales/abismo-puncupata/manallasacc.webp",
        titulo: "Pueblo de Manallasacc",
        descripcion:
          "Ubicado a poco más de una hora en vehículo de Huamanga, este pueblo celebra cada año su tradicional feria ganadera en la pampa de Titankapampa, donde destacan los caballos de paso y los concursos de ordeño. Muy cerca crece también un bosque de puyas de Raimondi, plantas emblemáticas que florecen una sola vez en su vida.",
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
    numeral: "V",
    nombre: "Vilcas Huamán",
    nombreLista: "Vilcas Huamán, centro administrativo inca",
    categoria: "Arqueología inca",
    resumen: "Un centro administrativo inca a 3490 m s. n. m. con el Ushnu y el Templo del Sol, a unas dos horas y media de Huamanga.",
    provincia: "Vilcas Huamán",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-vilcas-huaman.webp",
    heroTitulo: "Vilcas Huamán, centro administrativo inca",
    metaDescripcion:
      "El Ushnu y el Templo del Sol en un centro administrativo inca a 3490 m s. n. m. Cómo llegar y qué llevar.",
    imagen: "/imagenes-reales/vilcas-huaman/ushnu-aereo.webp",
    imagenTarjeta: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
    posicionTarjeta: "52% 50%",
    imagenSecundaria: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
    tituloPresentacion: "Una ciudad construida sobre su historia",
    descripcion:
      "Ubicado a 3490 m s. n. m. y a unas dos horas y media de Huamanga, Vilcas Huamán fue uno de los principales centros administrativos del Imperio inca gracias a su conexión con el Qhapaq Ñan. Su nombre proviene del quechua *Willka Waman*, que significa «halcón sagrado».\n\nDentro del complejo destacan el Ushnu y el Templo del Sol. El Ushnu es una pirámide ceremonial de piedra con cuatro plataformas y entrada de doble jamba, coronada por el Asiento del Inca. Por su parte los cimientos del Templo del Sol, originalmente dedicado a Inti fueron aprovechados durante la Colonia para levantar encima la iglesia de San Juan Bautista.",
    consejo:
      "Lleva ropa abrigadora para las mañanas y las tardes frías, calzado cómodo y bloqueador solar. Si no estás acostumbrado a la altura, evita los esfuerzos intensos al llegar. Recorre los monumentos con respeto y sigue las indicaciones del personal para conservar las estructuras incas.",
    seccionImagen: {
      imagen: "/imagenes-reales/vilcas-huaman/vilcas-huaman-parque.webp",
      etiqueta: "Plaza de Vilcas Huamán",
    },
    escenasTitulo: "Detalles de Vilcas Huamán",
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
    galeriaTitulo: "¿Qué más visitar en Vilcas Huamán?",
    galeria: [
      {
        imagen: "/imagenes-reales/vilcas-huaman/puyas-de-raimondi-de-titankayocc.webp",
        titulo: "Puyas de Raimondi de Titankayocc",
        descripcion:
          "Declarado Área de Conservación Regional en 2010, este bosque protege extensas agrupaciones de puyas cuyas enormes plantas sobresalen entre los pajonales de la puna. Se encuentra en el distrito de Vischongo, en la ruta hacia Vilcas Huamán, a unas dos horas en vehículo desde Huamanga.",
      },
      {
        imagen: "/imagenes-reales/vilcas-huaman/ruinas-de-intihuatana.webp",
        titulo: "Ruinas de Intihuatana",
        descripcion:
          "Ubicado junto a la laguna Pumacocha, en el distrito de Vischongo, este complejo inca de piedra alberga un antiguo reloj solar. Declarado Patrimonio Cultural de la Nación en 2001, se encuentra en la ruta hacia Vilcas Huamán y su nombre quechua se traduce como «amarrar al Sol»",
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
    numeral: "VI",
    nombre: "Nevado de Ritipata",
    categoria: "Alta montaña",
    tituloPresentacion: "Donde las estaciones transforman el paisaje",
    resumen: "Un nevado de unos 5000 m s. n. m. en la cordillera Chonta, a unas tres horas de Huamanga.",
    provincia: "Cangallo",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-cangallo.webp",
    heroTitulo: "El nevado de Ritipata",
    metaDescripcion:
      "Un nevado de unos 5000 m s. n. m. en Cangallo a tres horas de Huamanga. Cuándo ver nieve y qué llevar.",
    imagen: "/videos/hero/ritipata-poster.webp",
    imagenSecundaria: "/imagenes-reales/ritipata/laguna-nevado.webp",
    descripcion:
      "Ritipata es un nevado de unos 5 000 m s. n. m. situado en la cordillera Chonta, en el distrito de Paras, provincia de Cangallo. A unas tres horas en auto de Huamanga. En la cosmovisión andina es un apu sagrado. Su nombre viene del quechua «*riti»* nieve y «*pata»* lugar elevado.\n\nEntre diciembre y abril suelen producirse nevadas. De junio a septiembre, el cielo está más despejado para recorrer las lagunas, como la Ñawi y las cataratas cercanas. Una caminata de media hora permite acercarse al nevado. En la zona también habitan alpacas, vicuñas y vizcachas silvestres.",
    consejo:
      "Para ver nieve, visita entre diciembre y abril, porque su presencia depende del clima. Lleva ropa térmica, chaqueta impermeable, gorro y guantes, además de agua y comida porque no hay restaurantes en el lugar. Aclimátate antes de subir a esta altitud.",
    escenasTitulo: "Detalles de Ritipata",
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
    galeriaTitulo: "¿Qué más visitar en Cangallo?",
    galeria: [
      {
        imagen: "/imagenes-reales/ritipata/pumapaqcha.webp",
        titulo: "Catarata de Pumapaqcha",
        descripcion:
          "Junto a la carretera Ayacucho–Cangallo, en el distrito de Cangallo, esta catarata de diez metros desemboca en una laguna natural. Se encuentra a dos horas y media en vehículo desde Huamanga, seguidas de una caminata de veinte minutos.",
      },
      {
        imagen: "/imagenes-reales/ritipata/ruqruqa.webp",
        titulo: "Cascada de Ruqruqa",
        descripcion:
          "Ubicada en la comunidad de Quispillaccta, distrito Chuschi. Esta cascada destaca por sus pozas turquesas escalonadas. Para llegar desde Huamanga se requieren unas tres horas y media en vehículo y una caminata final de veinte minutos. Si planeas recorrer los senderos o meterte al agua, lleva ropa de baño y calzado antideslizante.",
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
    numeral: "VII",
    nombre: "Aguas turquesas de Millpu",
    categoria: "Naturaleza",
    resumen: "Unas veinte pozas turquesas que descienden por un cañón a unos 3600 m s. n. m., a unas tres horas y media de Huamanga.",
    provincia: "Víctor Fajardo",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-victor-fajardo.webp",
    heroTitulo: "Las aguas turquesas de Millpu",
    metaDescripcion:
      "Unas 20 pozas turquesas en un cañón de Ayacucho a unos 3600 m s. n. m. Cómo llegar y cuándo ir.",
    imagen: "/imagenes-reales/aguas-turquesas/aguas-turquesas-card.webp",
    imagenTarjeta: "/imagenes-reales/aguas-turquesas/millpu-card.webp",
    posicionTarjeta: "54% 50%",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Turquesa3.webp",
    tituloPresentacion: "El origen de las aguas turquesas",
    descripcion:
      "El característico color de Millpu surge cuando la luz del sol se refleja sobre los minerales del lecho rocoso. Este conjunto de unas 20 pozas escalonadas desciende por un estrecho cañón hasta que el río es absorbido por una grieta subterránea. De ahí nace su nombre, del quechua *millpuy* (tragar), un fenómeno que en temporada de lluvias da forma a una imponente represa natural llamada la «garganta del diablo».\n\nEl atractivo se encuentra a 3600 m s. n. m., en la comunidad de Circamarca, provincia de Víctor Fajardo. Para llegar desde Huamanga se viaja unas tres horas y media por carretera hasta Pataqocha, desde donde parte una caminata de veinte minutos.",
    consejo:
      "Visita Millpu entre mayo y septiembre para ver el agua más turquesa, ya que de enero a abril las lluvias la enturbian. Lleva calzado con buen agarre para los senderos y respeta la prohibición de bañarse en las pozas, vigente desde 2018 para conservar su color.",
    escenasTitulo: "Detalles de Millpu",
    clipTags: ["Camino a las pozas", "Vista del cañón", "Aguas turquesas", "Junto a las pozas"],
    mapLat: -13.7207,
    mapLng: -74.1339,
    seccionImagen: {
      imagen: "/imagenes-reales/aguas-turquesas/millpu-card.webp",
      etiqueta: "Pozas escalonadas de Millpu",
    },
    video: {
      hero: "/videos/hero/aguas-turquesas.mp4",
      heroMobile: "/videos/hero/aguas-turquesas-mobile.mp4",
      poster: "/videos/hero/aguas-turquesas-poster.webp",
    },
    videoSeccion: {
      src: "/imagenes-reales/aguas-turquesas/aguas-turquesas-seccion.mp4",
      srcMobile: "/imagenes-reales/aguas-turquesas/aguas-turquesas-seccion-mobile.mp4",
      poster: "/imagenes-reales/aguas-turquesas/aguas-turquesas-seccion-poster.webp",
    },
    galeriaTitulo: "¿Qué más visitar en Víctor Fajardo?",
    galeria: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/tabla-sarhua.webp",
        posicion: "50% 15%",
        titulo: "Las tablas de Sarhua",
        descripcion:
          "Estas tablas de madera pintadas narran historias familiares y escenas de la vida comunitaria. Tradicionalmente se regalan al terminar una casa nueva y se colocan entre las vigas del techo. Declaradas Patrimonio Cultural de la Nación en 2018, se pueden apreciar y adquirir en el distrito de Sarhua, a unas tres horas en vehículo desde Huamanga.",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/cascadas-sarhua.webp",
        titulo: "Las cascadas de Campanayuq",
        descripcion:
          "Ubicadas en el distrito de Sarhua, estas cascadas escalonadas recorren el valle hasta llegar a una zona de aguas termales. El viaje desde Huamanga toma unas tres horas en vehículo, más una caminata final de casi una hora. Para disfrutar el recorrido con seguridad, conviene ir a primera hora y llevar calzado antideslizante",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/aguas-turquesas/millpu-caballo-poster.webp",
        titulo: "Camino a las pozas",
        descripcion: "Un sendero lleva hasta las pozas y algunos visitantes lo recorren a caballo.",
        video: "/videos/lugares-visitar/millpu-caballo.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/millpu-mirador-poster.webp",
        titulo: "Vista del cañón",
        descripcion: "Desde lo alto del sendero se ve el cañón y las pozas que descienden entre las rocas.",
        video: "/videos/lugares-visitar/millpu-mirador.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/millpu-aguas-poster.webp",
        titulo: "Aguas turquesas",
        descripcion: "Las pozas se ven más turquesas entre mayo y septiembre. De enero a abril las lluvias enturbian el agua.",
        video: "/videos/lugares-visitar/millpu-aguas.mp4",
      },
      {
        imagen: "/imagenes-reales/aguas-turquesas/millpu-visitantes-poster.webp",
        titulo: "Junto a las pozas",
        descripcion: "Se puede caminar junto al agua y tomar fotos, pero desde 2018 está prohibido bañarse en las pozas.",
        video: "/videos/lugares-visitar/millpu-visitantes.mp4",
      },
    ],
  },
  {
    id: 9,
    slug: "volcan-pachapupum",
    numeral: "VIII",
    nombre: "Volcán inactivo de Pachapupum",
    categoria: "Volcán y aguas termales",
    resumen: "Un cono escalonado de roca a 4022 m s. n. m. con pozas termales, a unas cinco horas de Huamanga.",
    provincia: "Huanca Sancos",
    provinciaSombreada: "/imagenes-reales/mapas/provincia-huanca-sancos.webp",
    heroTitulo: "Pachapupum, el ombligo de la tierra",
    metaDescripcion:
      "Un volcán inactivo de roca y aguas termales a 4022 m s. n. m., en Huanca Sancos. Cuándo ir y qué llevar.",
    // Fotos provisionales mientras llegan los videos y los clips propios del lugar. Atención: "cono-escalonado" y
    // "poza-termal" vienen de imágenes generadas con IA ("ChatGPT Image"); hay que cambiarlas por fotos reales.
    imagen: "/imagenes-reales/volcan-pachapupum/crater-con-agua.webp",
    imagenTarjeta: "/imagenes-reales/volcan-pachapupum/cono-escalonado.webp",
    posicionTarjeta: "40% 50%",
    imagenSecundaria: "/imagenes-reales/volcan-pachapupum/cono-escalonado.webp",
    descripcion:
      "Conocido en quechua como el «ombligo de la tierra», Pachapupum se eleva a 4022 m s. n. m. en el distrito de Sacsamarca, provincia de Huanca Sancos. A pesar de su apariencia volcánica, este cono escalonado de roca caliza de treinta metros de altura es un géiser inactivo, moldeado capa por capa por aguas termales cargadas de sal y azufre. El viaje desde Huamanga toma unas cinco horas por carretera.\n\nPara llegar a la cima, donde se abre un cráter de diez metros de diámetro, se asciende por gradas de piedra y una escalera de madera. Al bajar, las pozas termales ricas en azufre que rodean el lugar ofrecen el espacio perfecto para relajarse.",
    consejo:
      "Lleva traje de baño, protector solar y ropa abrigadora. El viento frío suele empezar después de las tres de la tarde. Visita entre mayo y mediados de diciembre y deja el viaje para el segundo o tercer día en Ayacucho, así te aclimatas a la altura.",
    escenasTitulo: "Detalles de Pachapupum",
    clipTags: ["Cono escalonado", "Pozas termales", "Terrazas de roca", "Pozo de roca"],
    // Ubicación aproximada en el sur de la provincia de Huanca Sancos (unos 35 km al sur de Sancos); el mapa es referencial.
    mapLat: -13.94,
    mapLng: -74.415,
    video: {
      hero: "/videos/lugares-visitar/pachapupum.mp4",
      heroMobile: "/videos/lugares-visitar/pachapupum-mobile.mp4",
      poster: "/videos/lugares-visitar/pachapupum-poster.webp",
    },
    // Video completo a pantalla completa bajo la galería, sin audio (versión vertical para celular).
    videoSeccion: {
      src: "/videos/lugares-visitar/pachapupum-volcan.mp4",
      srcMobile: "/videos/lugares-visitar/pachapupum-volcan-mobile.mp4",
      poster: "/videos/lugares-visitar/pachapupum-volcan-poster.webp",
      etiqueta: "Volcán inactivo de Pachapupum",
    },
    galeriaTitulo: "¿Qué más visitar en Huanca Sancos?",
    galeria: [
      {
        imagen: "/imagenes-reales/huanca-sancos/catarata-de-wisquiri.webp",
        titulo: "Catarata de Wisquiri",
        descripcion:
          "Escondida entre montañas y senderos poco transitados, esta caída de agua cristalina es uno de los secretos mejor guardados de la zona. Se ubica en el centro poblado de Porta Cruz, distrito de Carapo, en la provincia de Huanca Sancos.",
      },
      {
        imagen: "/imagenes-reales/huanca-sancos/ituni.webp",
        titulo: "Ituni",
        descripcion:
          "Este complejo arqueológico de la provincia de Huanca Sancos conserva alrededor de doscientas chullpas, edificaciones funerarias levantadas por los antiguos habitantes de los Andes.",
      },
    ],
    escenasCards: [
      {
        imagen: "/imagenes-reales/volcan-pachapupum/escena-cono.webp",
        titulo: "Cono escalonado",
        descripcion: "Vista aérea del cono escalonado, con una escalera de madera que sube hacia el cráter.",
        video: "/videos/lugares-visitar/pachapupum-cono.mp4",
      },
      {
        imagen: "/imagenes-reales/volcan-pachapupum/escena-pozas.webp",
        titulo: "Pozas termales",
        descripcion: "Una poza termal de aguas verdosas rodeada de tonos amarillos y anaranjados.",
        video: "/videos/lugares-visitar/pachapupum-pozas.mp4",
      },
      {
        imagen: "/imagenes-reales/volcan-pachapupum/escena-terrazas.webp",
        titulo: "Terrazas de roca",
        descripcion: "Las capas de roca del cono forman terrazas bajo un cielo azul intenso.",
        video: "/videos/lugares-visitar/pachapupum-terrazas.mp4",
      },
      {
        imagen: "/imagenes-reales/volcan-pachapupum/escena-pozo.webp",
        titulo: "Pozo de roca",
        descripcion: "Un pozo profundo de paredes de roca con agua en el fondo, visto desde el borde.",
        video: "/videos/lugares-visitar/pachapupum-pozo.mp4",
      },
    ],
  },
];
