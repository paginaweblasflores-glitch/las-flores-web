/** `dia` es el nombre del día; `titulo` (opcional) es la procesión o el rito de esa jornada. */
export type DiaItem = { numero: string; dia: string; titulo?: string; texto: string; imagen: string };
export type ComparsaItem = { imagen: string; nombre: string; descripcion: string };
export type MomentoItem = { momento: string; texto: string; imagen: string };

export type Festividad = {
  id: number;
  slug: string;
  nombre: string;
  categoria: string;
  fecha: string;
  reconocimiento: string;
  lugarPrincipal: string;
  heroTitulo: string;
  imagen: string;
  imagenSecundaria: string;
  descripcion: string;
  consejo: string;
  frase: string;
  escenas: string;
  dato: string;
  clipTags: [string, string, string, string];
  /** Clips de video optimizados (hero de la página, tarjeta del inicio) y fotograma de portada. */
  video: { hero: string; card: string; poster: string };
  /** Fuerza el orden de la primera sección: true = datos clave a la izquierda; por defecto alterna según el id. */
  invertido?: boolean;
  /** Foto de la sección a pantalla completa si no es la imagen principal (opcional). */
  imagenSeccion?: string;
  /** Video a pantalla completa que reemplaza la foto de la sección bajo las comparsas (opcional). */
  videoSeccion?: { src: string; srcMobile: string; poster: string; etiqueta?: string };
  /** Preguntas y respuestas (acordeón) bajo la sección de pantalla completa; título y texto de encabezado opcionales. */
  preguntasTitulo?: string;
  preguntasTexto?: string;
  preguntas?: { pregunta: string; respuesta: string; carta?: boolean }[];
  /** Imagen bajo el encabezado de las preguntas (rellena el espacio de la columna izquierda). */
  preguntasImagen?: { src: string; alt: string };
  /** Cuatro clips cortos (sin texto) para las tiras verticales finales; si faltan se usan fotos. `imagen` es el póster. */
  escenasClips?: { video: string; imagen: string; alt: string }[];
  /** Día a día (solo Semana Santa: 7 jornadas, se presentan con un selector numerado). */
  dias?: DiaItem[];
  /** Título y descripción de la sección de días (opcionales). */
  diasTitulo?: string;
  diasTexto?: string;
  /** Comparsas reales (solo Carnaval: se presentan paginadas de dos en dos). */
  comparsas?: ComparsaItem[];
  /** Título y descripción de la sección de comparsas (opcionales). */
  comparsasTitulo?: string;
  comparsasTexto?: string;
  /** Título y descripción de la cronología (opcionales). */
  cronologiaTitulo?: string;
  cronologiaTexto?: string;
  /** Cronología de la jornada (solo 9 de Diciembre: línea de tiempo, sin fotos). */
  cronologia?: MomentoItem[];
};

export const festividades: Festividad[] = [
  {
    id: 2,
    slug: "carnaval-ayacuchano",
    nombre: "Carnaval Ayacuchano",
    categoria: "Música y Tradición",
    fecha: "Febrero / Marzo",
    reconocimiento: "Patrimonio Cultural de la Nación (2003)",
    lugarPrincipal: "Plaza Mayor y barrios de Huamanga",
    heroTitulo: "Carnaval Ayacuchano, Patrimonio Cultural de la Nación",
    imagen: "/imagenes-reales/galeria/festividades/carnaval-uno.webp",
    imagenSecundaria: "/imagenes-reales/galeria/festividades/carnaval-tres.webp",
    descripcion:
      "El Carnaval Ayacuchano combina la herencia de los carnavales españoles con el antiguo Pukllay andino, una celebración vinculada al juego y la fertilidad. Cada año, las comparsas de los barrios y las provincias llenan las calles de Huamanga con huaynos, cantos, danzas y competencias tradicionales como el warakanakuy. Esta fiesta fue declarada Patrimonio Cultural de la Nación en 2003.",
    consejo:
      "Llevar ropa que se pueda mojar: el agua, el talco y la espuma son parte esencial de la fiesta.",
    frase: "Cómo vivir el Carnaval Ayacuchano",
    escenas: "Color, música y comparsas: así se vive el Carnaval Ayacuchano.",
    dato: "Cada año, las comparsas de Huamanga, Cangallo, Huanta y otras provincias renuevan sus canciones para el carnaval.",
    clipTags: [
      "Comparsas en la plaza",
      "Yunza y corta-montes",
      "Warakanakuy (duelo ritual)",
      "Huaynos de carnaval",
    ],
    video: {
      hero: "/videos/festividades/carnaval-ayacuchano.mp4",
      card: "/videos/festividades/carnaval-ayacuchano-card.mp4",
      poster: "/videos/festividades/carnaval-ayacuchano-poster.webp",
    },
    videoSeccion: {
      src: "/videos/lugares-visitar/abuelos-quinua.mp4",
      srcMobile: "/videos/lugares-visitar/abuelos-quinua-mobile.mp4",
      poster: "/videos/lugares-visitar/abuelos-quinua-poster.webp",
      etiqueta: "Los Abuelos de Quinua",
    },
    preguntasTitulo: "Antes de salir a bailar",
    preguntasImagen: {
      src: "/imagenes-reales/carnaval-ayacuchano/danzantes-carnaval.webp",
      alt: "Tres danzantes del carnaval con trajes de cintas de colores",
    },
    escenasClips: [
      {
        video: "/videos/festividades/carnaval-escena-1.mp4",
        imagen: "/imagenes-reales/carnaval-ayacuchano/escena-1.webp",
        alt: "Vista aérea de la plaza con bailarinas de colores durante el carnaval",
      },
      {
        video: "/videos/festividades/carnaval-escena-2.mp4",
        imagen: "/imagenes-reales/carnaval-ayacuchano/escena-2.webp",
        alt: "Danza de una comparsa frente a la Catedral de Ayacucho",
      },
      {
        video: "/videos/festividades/carnaval-escena-3.mp4",
        imagen: "/imagenes-reales/carnaval-ayacuchano/escena-3.webp",
        alt: "Comparsa con cintas de colores y matracas en pleno desfile",
      },
      {
        video: "/videos/festividades/carnaval-escena-4.mp4",
        imagen: "/imagenes-reales/carnaval-ayacuchano/escena-4.webp",
        alt: "Vista aérea del desfile de comparsas en la Plaza Mayor, con filas de bailarinas de blanco",
      },
    ],
    preguntasTexto:
      "El carnaval se vive entre música, comparsas, gastronomía y encuentros en las calles de Huamanga. Si planeas asistir, estas son algunas preguntas útiles para organizar tu visita.",
    preguntas: [
      {
        pregunta: "¿Dónde se vive el Carnaval Ayacuchano?",
        respuesta:
          "El carnaval se vive en las calles de Huamanga. La Plaza Mayor es uno de sus puntos emblemáticos, mientras que la avenida Mariscal Cáceres fue escenario del recorrido y la calificación de comparsas en 2026. Durante la celebración, la ciudad se llena de música, baile y juegos con agua y talco.",
      },
      {
        pregunta: "¿Cuántos días dura?",
        respuesta:
          "Los días centrales suelen extenderse por cinco días, aunque las actividades previas comienzan antes. En 2026, la celebración oficial se realizó del 14 al 18 de febrero. Como las fechas cambian cada año, consulta el cronograma de la Municipalidad Provincial de Huamanga antes de viajar.",
      },
      {
        pregunta: "¿Qué comparsas no te puedes perder?",
        respuesta:
          "En 2026 participaron más de 200 comparsas, según información difundida por Andina. Entre las agrupaciones que puedes conocer están Los Legendarios Abuelos de Quinua, Cangallo Señorial, Cangallo Corazón, Sentimiento Fajardino y el Centro Cultural UQIS de Quispillacta. La cantidad de participantes y las agrupaciones pueden variar cada año.",
      },
      {
        pregunta: "¿Cómo se despide el Carnaval?",
        respuesta:
          "La celebración culmina con la lectura del testamento y la quema simbólica del Ño Carnavalón, una tradición que reúne a las comparsas y al público en la Plaza Mayor de Huamanga.",
      },
      {
        pregunta: "Antes de bailar, ¿dónde comer comida ayacuchana?",
        respuesta:
          "A solo 7 minutos de la Plaza Mayor, el Restaurante Las Flores ofrece desayunos y almuerzos con sabor ayacuchano. Una buena opción para recargar energías antes de salir a disfrutar de las comparsas.",
        carta: true,
      },
      {
        pregunta: "¿Dónde descansar después de la fiesta?",
        respuesta:
          "A solo 10 minutos de la Plaza de Armas, el Hotel Umaru, ubicado en el valle de Huatatas, ofrece un ambiente tranquilo rodeado de naturaleza, con piscina al aire libre, jardines y terrazas con vistas al valle. Es una alternativa para descansar lejos del bullicio del centro.",
      },
      {
        pregunta: "¿Cómo organizar tu día de carnaval?",
        respuesta:
          "Empieza con un desayuno o almuerzo en Las Flores, continúa con el recorrido de las comparsas por Huamanga y termina el día descansando en el Hotel Umaru. Así podrás combinar la fiesta con un momento de tranquilidad.",
      },
    ],
    comparsasTitulo: "Las comparsas, el alma del Carnaval",
    comparsasTexto:
      "Más de 200 comparsas de Huamanga y provincias como Cangallo, Huanta y Víctor Fajardo participan en la celebración. Cada agrupación aporta sus propias canciones, vestimentas y formas de bailar, convirtiendo las calles en un gran encuentro de música y tradición.",
    comparsas: [
      {
        imagen: "/imagenes-reales/carnaval-ayacucho/abuelos-quinua.webp",
        nombre: "Los Abuelos de Quinua",
        descripcion:
          "Una comparsa tradicional que representa a los machus o ancianos y forma parte de la identidad del carnaval ayacuchano.",
      },
      {
        imagen: "/imagenes-reales/carnaval-ayacucho/cangallo-senorial.webp",
        nombre: "Cangallo Señorial",
        descripcion:
          "Una comparsa que destaca por la participación de numerosos bailarines y por representar las tradiciones de la provincia de Cangallo.",
      },
      {
        imagen: "/imagenes-reales/carnaval-ayacuchano/cangallo-corazon.webp",
        nombre: "Cangallo Corazón",
        descripcion:
          "Fundada en Huamanga el 8 de febrero de 1987 por residentes de Cangallo, esta asociación cultural ganó cinco concursos de carnaval consecutivos y, en 2008, obtuvo el título de Comparsa Señorial.",
      },
      {
        imagen: "/imagenes-reales/carnaval-ayacuchano/sentimiento-fajardino.webp",
        nombre: "Sentimiento Fajardino",
        descripcion:
          "Comparsa de la provincia de Víctor Fajardo que lleva a Huamanga el pumpín fajardino, expresión musical declarada Patrimonio Cultural de la Nación. Sus canciones combinan picardía y crítica social, y sus cerca de 320 músicos y danzantes destacan por sus trajes morados.",
      },
    ],
  },
  {
    id: 1,
    slug: "semana-santa",
    invertido: true,
    nombre: "Semana Santa de Ayacucho",
    categoria: "Fe y Tradición",
    fecha: "Marzo / Abril",
    reconocimiento: "Patrimonio Cultural de la Nación (2022)",
    lugarPrincipal: "Centro histórico de Huamanga",
    heroTitulo: "Semana Santa de Ayacucho, festividad religiosa y cultural más importante del Perú",
    imagen: "/imagenes-reales/galeria/festividades/samana-santa-uno.webp",
    imagenSecundaria: "/imagenes-reales/galeria/festividades/semana-santa-tres.webp",
    descripcion:
      "Con raíces en la época virreinal y más de 150 años de celebración ininterrumpida, la Semana Santa de Ayacucho reúne procesiones, rituales católicos y tradiciones andinas en las calles de Huamanga. Declarada Patrimonio Cultural de la Nación en 2022, es una de las festividades religiosas y culturales más representativas del Perú. Sus celebraciones centrales se extienden durante once días, desde el Jueves de Pasión hasta el Domingo de Resurrección.",
    consejo:
      "Llegar con anticipación a la Plaza Mayor para presenciar la salida de las procesiones; los hospedajes se llenan con semanas de anticipación.",
    frase: "Cómo vivir la Semana Santa de Ayacucho",
    escenas: "Incienso, flores y fe: así se vive la Semana Santa en Huamanga.",
    dato: "Huamanga es conocida como la ciudad de las iglesias. Durante la Semana Santa, sus templos se convierten en punto de partida de procesiones y ceremonias que reúnen a fieles y visitantes.",
    clipTags: ["Anda cargada entre flores", "Alfombras de flores", "Fogatas de chamizo", "Pascua Toro por las calles"],
    video: {
      hero: "/videos/festividades/semana-santa.mp4",
      card: "/videos/festividades/semana-santa-card.mp4",
      poster: "/videos/festividades/semana-santa-poster.webp",
    },
    videoSeccion: {
      src: "/videos/festividades/semana-santa-seccion.mp4",
      srcMobile: "/videos/festividades/semana-santa-seccion-mobile.mp4",
      poster: "/videos/festividades/semana-santa-seccion-poster.webp",
    },
    diasTitulo: "Los días de Semana Santa",
    diasTexto:
      "Del Jueves de Pasión al Domingo de Resurrección, Huamanga vive jornadas de fe y tradición, con procesiones, misas y rituales propios de cada día. Descubre las celebraciones más representativas en este recorrido.",
    preguntasTitulo: "Antes de acompañar la procesión",
    preguntasTexto: "Fe, flores y tradición llenan las calles de Huamanga durante la Semana Santa. Descubre dónde vivir las principales celebraciones y cómo organizar tu visita.",
    preguntasImagen: {
      src: "/imagenes-reales/galeria/festividades/samana-santa-uno.webp",
      alt: "Anda iluminada avanzando entre miles de fieles en una procesión nocturna de Huamanga",
    },
    preguntas: [
      {
        pregunta: "¿Dónde se vive la Semana Santa de Ayacucho?",
        respuesta:
          "En el centro histórico de Huamanga, conocido por sus numerosas iglesias. Las procesiones parten de distintos templos y recorren sus calles. Uno de los momentos más esperados es el Encuentro, cuando las imágenes de Jesús Nazareno, la Virgen Dolorosa, San Juan y la Verónica se reúnen en la Plaza Mayor.",
      },
      {
        pregunta: "¿Cuántos días dura?",
        respuesta:
          "Las celebraciones abarcan once días, del Jueves de Pasión al Domingo de Resurrección. En 2026, se realizaron del 26 de marzo al 5 de abril. Como las fechas cambian cada año según el calendario de Pascua, consulta el programa oficial de la Municipalidad Provincial de Huamanga antes de viajar.",
      },
      {
        pregunta: "¿Qué procesiones no te puedes perder?",
        respuesta:
          "Entre los momentos más representativos están el Miércoles de Encuentro, cuando Jesús Nazareno y la Virgen Dolorosa se reúnen en medio de miles de velas, y la procesión del Santo Sepulcro, el Viernes Santo, acompañada por fieles en un ambiente de recogimiento. También puedes conocer las tradiciones del Sábado de Gloria, que varían según la programación de cada año.",
      },
      {
        pregunta: "¿Cómo se cierra la Semana Santa?",
        respuesta:
          "El Sábado de Gloria reúne diversas actividades tradicionales y preparativos para la celebración pascual. La festividad culmina el Domingo de Resurrección con la procesión del Señor Resucitado, que recorre la Plaza Mayor al amanecer.",
      },
      {
        pregunta: "Antes de la procesión, ¿dónde comer comida ayacuchana?",
        respuesta:
          "A solo 7 minutos de la Plaza Mayor, el Restaurante Las Flores sirve desayunos y almuerzos con sabor ayacuchano desde 1980. Una buena opción para disfrutar de la gastronomía local antes de salir a acompañar las procesiones.",
        carta: true,
      },
      {
        pregunta: "¿Dónde descansar después de las procesiones?",
        respuesta:
          "A 10 minutos de la Plaza de Armas, el Hotel Umaru, ubicado en el valle de Huatatas, ofrece un ambiente tranquilo rodeado de naturaleza, con piscina al aire libre, jardines y terrazas con vistas al valle. Durante la Semana Santa, la demanda de alojamiento puede aumentar, por lo que conviene reservar con anticipación.",
      },
      {
        pregunta: "¿Cómo organizar tu día en Semana Santa?",
        respuesta:
          "Empieza con un desayuno o almuerzo en Las Flores, a 7 minutos de la Plaza Mayor. Después, recorre el centro histórico y acompaña las procesiones programadas para ese día. Al terminar, puedes descansar en el Hotel Umaru, a 10 minutos, y disfrutar de un ambiente tranquilo lejos del bullicio del centro.",
      },
    ],
    escenasClips: [
      {
        video: "/videos/festividades/semana-santa-escena-1.mp4",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-escena-1.webp",
        alt: "Obispo con la mirada baja junto a una vela morada",
      },
      {
        video: "/videos/festividades/semana-santa-escena-2.mp4",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-escena-2.webp",
        alt: "Cargador con capa y cruz roja sosteniendo el anda entre flores",
      },
      {
        video: "/videos/festividades/semana-santa-escena-3.mp4",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-escena-3.webp",
        alt: "Mujer con corona de espinas y manto morado durante la procesión",
      },
      {
        video: "/videos/festividades/semana-santa-escena-4.mp4",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-escena-4.webp",
        alt: "Mujer con una vela en la procesión nocturna sobre una alfombra de flores",
      },
    ],
    dias: [
      {
        numero: "I",
        dia: "Jueves de Pasión",
        titulo: "Cristo Salvador del Mundo",
        texto:
          "La procesión de Cristo Salvador del Mundo, desde el templo de San Juan Bautista, marca el inicio de las celebraciones. El anda se adorna con velas y flores tradicionales.",
        imagen: "/imagenes-reales/semana-santa/jueves-de-pasion.webp",
      },
      {
        numero: "II",
        dia: "Viernes de Pasión",
        titulo: "Señor de la Agonía y Virgen Dolorosa",
        texto:
          "Desde el templo de Santa María Magdalena salen las imágenes del Señor de la Agonía y la Virgen Dolorosa, acompañadas por San Juan y la Verónica, en una procesión de recogimiento y devoción.",
        imagen: "/imagenes-reales/semana-santa/01-viernes-de-dolores.webp",
      },
      {
        numero: "III",
        dia: "Sábado de Pasión",
        titulo: "Señor de la Parra",
        texto:
          "La imagen del Señor de la Parra recorre las calles desde el templo de Pampa de San Agustín. Su anda destaca por los racimos de uvas, símbolo asociado a la tradición eucarística.",
        imagen: "/imagenes-reales/semana-santa/02-sabado-de-pasion.webp",
      },
      {
        numero: "IV",
        dia: "Domingo de Ramos",
        titulo: "Señor de Ramos",
        texto:
          "La imagen de Jesús montado en un pollino sale del monasterio de Santa Teresa y se dirige hacia la Catedral. La jornada recuerda la entrada de Jesús en Jerusalén y la bendición de las palmas.",
        imagen: "/imagenes-reales/semana-santa/03-domingo-de-ramos.webp",
      },
      {
        numero: "V",
        dia: "Lunes Santo",
        titulo: "Señor del Huerto",
        texto:
          "La procesión del Señor del Huerto parte del templo de la Buena Muerte y llega a la Plaza Mayor. La imagen representa la oración de Jesús en el huerto de Getsemaní.",
        imagen: "/imagenes-reales/semana-santa/04-lunes-santo.webp",
      },
      {
        numero: "VI",
        dia: "Martes Santo",
        titulo: "Señor de la Sentencia",
        texto:
          "Desde el templo de La Amargura sale la procesión del Señor de la Sentencia, que recuerda la condena de Jesús antes de su camino hacia la crucifixión.",
        imagen: "/imagenes-reales/semana-santa/05-martes-santo.webp",
      },
      {
        numero: "VII",
        dia: "Miércoles Santo",
        titulo: "El Encuentro",
        texto:
          "En la Plaza Mayor se encuentran las imágenes de Jesús Nazareno, la Virgen Dolorosa, San Juan y la Verónica. La procesión, iluminada por miles de velas, es uno de los momentos más conmovedores de la Semana Santa.",
        imagen: "/imagenes-reales/semana-santa/06-miercoles-de-encuentro.webp",
      },
      {
        numero: "VIII",
        dia: "Jueves Santo",
        titulo: "Visita a los siete templos",
        texto:
          "La jornada está dedicada a la oración y a la visita de los monumentos eucarísticos en siete iglesias de Huamanga. A diferencia de otros días, no se realizan las tradicionales procesiones nocturnas.",
        imagen: "/imagenes-reales/semana-santa/07-jueves-santo.webp",
      },
      {
        numero: "IX",
        dia: "Viernes Santo",
        titulo: "Santo Sepulcro y Virgen Dolorosa",
        texto:
          "Al anochecer, las imágenes del Señor del Santo Sepulcro y la Virgen Dolorosa salen del templo de Santo Domingo. La procesión recorre las calles en un ambiente de silencio, recogimiento y duelo.",
        imagen: "/imagenes-reales/semana-santa/08-viernes-santo.webp",
      },
      {
        numero: "X",
        dia: "Sábado de Gloria",
        titulo: "Preparativos para la Resurrección",
        texto:
          "Los mayordomos y sus colaboradores preparan el monumental anda del Señor de la Resurrección mediante el ritual conocido como *Trono Watay*. Por la noche, los fieles participan en la Vigilia Pascual.",
        imagen: "/imagenes-reales/semana-santa/sabado-de-gloria.webp",
      },
      {
        numero: "XI",
        dia: "Domingo de Resurrección",
        titulo: "Señor de la Resurrección",
        texto:
          "Antes del amanecer, el monumental anda del Señor de la Resurrección sale de la Catedral y recorre la Plaza Mayor entre cánticos, oraciones y repique de campanas. La procesión marca el momento culminante de la Semana Santa ayacuchana.",
        imagen: "/imagenes-reales/semana-santa/10-domingo-de-resurreccion.webp",
      },
    ],
  },
  {
    id: 3,
    slug: "9-de-diciembre",
    invertido: true,
    nombre: "Batalla de Ayacucho",
    categoria: "Historia Viva",
    fecha: "Diciembre",
    reconocimiento: "Feriado Nacional (Ley 31381)",
    lugarPrincipal: "Santuario Histórico Pampa de Ayacucho",
    heroTitulo: "9 de diciembre, Día de la Batalla de Ayacucho",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    imagenSeccion: "/imagenes-reales/9-de-diciembre/escenificacion-9-de-diciembre.webp",
    descripcion:
      "El 9 de diciembre de 1824, en la Pampa de Ayacucho, cerca de Quinua, las fuerzas patriotas al mando de Antonio José de Sucre derrotaron al ejército realista en una batalla decisiva para la independencia del Perú y de América del Sur. Cada año, esta fecha se conmemora con una ceremonia cívico-militar y una escenificación histórica en el Santuario Histórico Pampa de Ayacucho. Desde 2022, el 9 de diciembre es feriado nacional en el Perú.",
    consejo:
      "Asistir temprano a la ceremonia oficial en el Santuario Histórico Pampa de Ayacucho y complementar con una visita a Quinua, Pueblo con Encanto, y sus ceramistas.",
    frase: "Cómo vivir el 9 de Diciembre",
    escenas: "Historia, memoria y libertad: así se vive el 9 de Diciembre.",
    dato: "El monumento conmemorativo de la Pampa de Ayacucho se alza en el lugar donde se libró la batalla y rinde homenaje a quienes participaron en esta gesta histórica.",
    clipTags: [
      "Escenificación de la batalla",
      "Obelisco y los 6 generales",
      "Ceremonia cívico-militar",
      "Toma aérea de la pampa",
    ],
    video: {
      hero: "/videos/festividades/9-de-diciembre.mp4",
      card: "/videos/festividades/9-de-diciembre-card.mp4",
      poster: "/videos/festividades/9-de-diciembre-poster.webp",
    },
    cronologiaTitulo: "Cronograma del 9 de diciembre",
    cronologiaTexto:
      "Cada 9 de diciembre, el Santuario Histórico Pampa de Ayacucho, en Quinua, acoge actividades oficiales para recordar la batalla y rendir homenaje a sus protagonistas. El programa puede variar cada año.",
    cronologia: [
      {
        momento: "Ceremonia central",
        texto: "Acto cívico-militar con autoridades, izamiento de banderas, honores y ofrendas en memoria de quienes lucharon por la independencia.",
        imagen: "/imagenes-reales/9-de-diciembre/ceremonia-central.webp",
      },
      {
        momento: "Escenificación",
        texto:
          "Una representación de la batalla recrea el enfrentamiento entre las fuerzas patriotas y realistas en el escenario histórico de la Pampa de Ayacucho. La cantidad de participantes y el programa dependen de cada edición.",
        imagen: "/imagenes-reales/9-de-diciembre/escenificacion.webp",
      },
    ],
    escenasClips: [
      {
        video: "/videos/festividades/9-de-diciembre-escena-2.mp4",
        imagen: "/imagenes-reales/9-de-diciembre/escena-2.webp",
        alt: "Vuelo de dron al atardecer hacia el obelisco de la Pampa de Ayacucho, entre pastizales dorados",
      },
      {
        video: "/videos/festividades/9-de-diciembre-escena-1.mp4",
        imagen: "/imagenes-reales/9-de-diciembre/escena-1.webp",
        alt: "Visitante fotografiando las vitrinas de un museo con sables, fusiles y una pintura de la batalla",
      },
      {
        video: "/videos/festividades/9-de-diciembre-escena-4.mp4",
        imagen: "/imagenes-reales/9-de-diciembre/escena-4.webp",
        alt: "Oficial a caballo con el sable en alto, gritando durante la escenificación de la batalla",
      },
      {
        video: "/videos/festividades/9-de-diciembre-escena-3.mp4",
        imagen: "/imagenes-reales/9-de-diciembre/escena-3.webp",
        alt: "Vista aérea de la escenificación de la batalla en la Pampa de Ayacucho",
      },
    ],
    preguntasTitulo: "Antes de ir a la Pampa de Ayacucho",
    preguntasTexto:
      "Historia, memoria y paisajes andinos se encuentran en Quinua. Descubre qué actividades puedes presenciar y cómo organizar tu visita.",
    preguntasImagen: {
      src: "/imagenes-reales/9-de-diciembre/obelisco-de-quinua.webp",
      alt: "Visitantes frente al obelisco de la Pampa de Ayacucho, en Quinua",
    },
    preguntas: [
      {
        pregunta: "¿Qué se conmemora el 9 de diciembre?",
        respuesta:
          "Se recuerda la Batalla de Ayacucho de 1824, en la que el Ejército Unido Libertador, al mando de Antonio José de Sucre, derrotó a las fuerzas realistas en un enfrentamiento decisivo para la independencia del Perú y la emancipación sudamericana. Desde 2021, el 9 de diciembre es feriado nacional, según la Ley N.º 31381.",
      },
      {
        pregunta: "¿Dónde se vive la conmemoración?",
        respuesta:
          "En el Santuario Histórico Pampa de Ayacucho, en Quinua, donde se libró la batalla. Cada año, el lugar acoge una ceremonia cívico-militar y una escenificación histórica cuyo programa y número de participantes pueden variar.",
      },
      {
        pregunta: "¿Cómo llego a la Pampa de Ayacucho?",
        respuesta:
          "El Santuario se encuentra en el distrito de Quinua, a unos 37 km de Huamanga, en las faldas del cerro Condorcunca. Puedes llegar por carretera en vehículo particular o mediante un tour desde la ciudad. Para el 9 de diciembre, consulta los horarios, accesos y posibles restricciones con las autoridades locales.",
      },
      {
        pregunta: "¿Qué puedo ver en el Santuario?",
        respuesta:
          "Puedes visitar el obelisco conmemorativo y recorrer la planicie donde se libró la batalla, rodeada de paisajes andinos. Muy cerca se encuentra Quinua, conocido por su tradición alfarera y sus talleres de cerámica, ideales para complementar la visita.",
      },
      {
        pregunta: "Antes de la ceremonia, ¿dónde comer comida ayacuchana?",
        respuesta:
          "A solo 7 minutos de la Plaza Mayor, el Restaurante Las Flores sirve desayunos y almuerzos con sabor ayacuchano desde 1980. Una buena opción para empezar el día antes de viajar hacia la Pampa de Ayacucho.",
        carta: true,
      },
      {
        pregunta: "¿Dónde descansar después de la jornada?",
        respuesta:
          "A 10 minutos de la Plaza de Armas, el Hotel Umaru, ubicado en el valle de Huatatas, ofrece un entorno tranquilo rodeado de naturaleza, con piscina al aire libre, jardines y terrazas con vistas al valle, lejos del bullicio del centro.",
      },
      {
        pregunta: "¿Cómo organizar tu día del 9 de diciembre?",
        respuesta:
          "Empieza con un desayuno o almuerzo en Las Flores, a 7 minutos de la Plaza Mayor. Después, viaja a la Pampa de Ayacucho para asistir a las actividades conmemorativas y conocer el campo histórico. Al regresar, puedes descansar en el Hotel Umaru, a 10 minutos, y terminar el día en un ambiente tranquilo.",
      },
    ],
  },
];
