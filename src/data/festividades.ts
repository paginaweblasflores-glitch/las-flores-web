export type DiaItem = { numero: string; dia: string; texto: string; imagen: string };
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
      "Nacido de la fusión entre los carnavales medievales españoles y el antiguo Pukllay andino —el juego ritual previo a la siembra—, el Carnaval Ayacuchano reúne comparsas de cada barrio, música de huayno y competencias tradicionales como el warakanakuy, en una de las fiestas más coloridas del sur peruano. Fue declarado Patrimonio Cultural de la Nación en 2003.",
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
      "Cinco días de música, color y comparsas en el corazón de Huamanga. Todo lo que tiene que saber antes de vivirlo.",
    preguntas: [
      {
        pregunta: "¿Dónde se vive el Carnaval Ayacuchano?",
        respuesta:
          "En el corazón de Huamanga. La Plaza Mayor es el punto de encuentro: allí ingresa el Ño Carnavalón y se despide la fiesta. Desde 2026 las comparsas recorren la avenida Mariscal Cáceres, y toda la ciudad se llena de música, baile y juego con agua y talco.",
      },
      {
        pregunta: "¿Cuántos días dura?",
        respuesta:
          "Cinco días centrales, precedidos por concursos y actividades previas: en 2026 fueron del 14 al 18 de febrero. Las fechas cambian cada año porque dependen del calendario litúrgico, así que confirma el cronograma oficial de la Municipalidad de Huamanga o de Dircetur Ayacucho antes de viajar.",
      },
      {
        pregunta: "¿Cuántas comparsas desfilan y cuáles no se lo puede perder?",
        respuesta:
          "Más de 200 comparsas, según la Municipalidad de Huamanga. La cifra exacta cambia cada año. Y las comparsas que no debes perderte son: Los Legendarios Abuelos de Quinua, Cangallo Señorial, Cangallo Corazón, Sentimiento Fajardino y el Centro Cultural UQIS de Quispillacta.",
      },
      {
        pregunta: "¿Cómo se despide el Carnaval?",
        respuesta:
          "Con la lectura del testamento y la quema del Ño Carnavalón en la Plaza Mayor, un cierre simbólico hasta el año siguiente.",
      },
      {
        pregunta: "Antes de bailar, ¿dónde comer sabor ayacuchano?",
        respuesta:
          "En el Restaurante Las Flores, a 7 minutos de la Plaza Mayor. Desde 1980 sirve desayuno y almuerzo con cocina ayacuchana, para empezar el día con energía antes de salir a bailar. Revisa nuestra carta: hay muchos más platos para elegir.",
        carta: true,
      },
      {
        pregunta: "¿Dónde descansar tranquilo después de la fiesta?",
        respuesta:
          "En el Hotel Umaru, a 10 minutos de la Plaza de Armas, en el valle de Huatatas: un escape tranquilo rodeado de naturaleza, con piscina al aire libre, jardines y terrazas con vista al valle, lejos del bullicio del centro.",
      },
      {
        pregunta: "¿Cómo organizo mi día de carnaval?",
        respuesta:
          "Una idea: desayuna o almuerza en Las Flores (a 7 minutos de la Plaza Mayor), vive las comparsas y termina el día descansando en Umaru (a 10 minutos). Así disfrutas la fiesta y la cierras en calma.",
      },
    ],
    comparsasTitulo: "Las comparsas, el alma del Carnaval",
    comparsasTexto:
      "Más de 200 comparsas de los barrios de Huamanga y de provincias como Cangallo, Huanta y Víctor Fajardo renuevan cada año sus canciones para llenar de música y baile las calles. Conoce algunas de ellas.",
    comparsas: [
      {
        imagen: "/imagenes-reales/carnaval-ayacucho/abuelos-quinua.webp",
        nombre: "Los Abuelos de Quinua",
        descripcion:
          "Comparsa legendaria que representa a los ancianos (\"machus\") de la zona oriental de Ayacucho — un clásico inmortal del carnaval huamanguino.",
      },
      {
        imagen: "/imagenes-reales/carnaval-ayacucho/cangallo-senorial.webp",
        nombre: "Cangallo Señorial",
        descripcion:
          "Una de las comparsas más numerosas, con 200 a 300 bailarines representando a la provincia de Cangallo.",
      },
      {
        imagen: "/imagenes-reales/seccion-festividades/carnaval-musica.webp",
        nombre: "Cangallo Corazón",
        descripcion:
          "Fundada en Huamanga el 8 de febrero de 1987 por residentes de Cangallo, la Asociación Cultural Cangallo Corazón ganó cinco concursos de carnaval consecutivos y en 2008 obtuvo el título de Comparsa Señorial.",
      },
      {
        imagen: "/imagenes-reales/seccion-festividades/carnaval-ayacuchano.webp",
        nombre: "Sentimiento Fajardino",
        descripcion:
          "Comparsa de la provincia de Víctor Fajardo que lleva a Huamanga el pumpín fajardino, Patrimonio Cultural de la Nación, con letras de picardía y crítica social. Reúne a unos 320 músicos y danzantes y se reconoce por sus trajes morados.",
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
      "Declarada Patrimonio Cultural de la Nación por el Ministerio de Cultura en 2022, la Semana Santa de Ayacucho es la fiesta religiosa más grande del Perú y la segunda más espectacular del mundo, después de la de Sevilla. Con raíces coloniales del siglo XVI y consolidada a mediados del siglo XIX, comienza el Viernes de Dolores y culmina el Domingo de Resurrección: diez días de procesiones ininterrumpidas por las calles de Huamanga.",
    consejo:
      "Llegar con anticipación a la Plaza Mayor para presenciar la salida de las procesiones; los hospedajes se llenan con semanas de anticipación.",
    frase: "Cómo vivir la Semana Santa de Ayacucho",
    escenas: "Incienso, flores y fe: así se vive la Semana Santa en Huamanga.",
    dato: "Huamanga, la ciudad de las 33 iglesias, vive la Semana Santa con procesiones que parten desde distintos templos.",
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
    diasTitulo: "Los 10 días de Semana Santa",
    diasTexto:
      "Del Viernes de Dolores al Domingo de Resurrección, Huamanga vive diez jornadas de fe: procesiones que parten de sus templos, misas, ritos y tradiciones propias de cada día. Recórrelas una a una con las flechas.",
    preguntasTitulo: "Antes de acompañar la procesión",
    preguntasTexto: "Diez días de fe, flores y procesiones en el corazón de Huamanga. Todo lo que tiene que saber antes de vivirlos.",
    preguntasImagen: {
      src: "/imagenes-reales/galeria/festividades/samana-santa-uno.webp",
      alt: "Anda iluminada avanzando entre miles de fieles en una procesión nocturna de Huamanga",
    },
    preguntas: [
      {
        pregunta: "¿Dónde se vive la Semana Santa de Ayacucho?",
        respuesta:
          "En todo el centro histórico de Huamanga, la ciudad de las 33 iglesias: las procesiones parten de distintos templos y recorren sus calles. La Plaza Mayor reúne el momento del Encuentro, cuando se juntan Jesús Nazareno, la Virgen Dolorosa, San Juan y la Verónica.",
      },
      {
        pregunta: "¿Cuántos días dura?",
        respuesta:
          "Diez días, del Viernes de Dolores al Domingo de Resurrección: en 2026 fueron del 27 de marzo al 5 de abril. Las fechas cambian cada año con la Pascua, así que confirma el programa oficial de la Municipalidad de Huamanga o del Gobierno Regional de Ayacucho antes de viajar.",
      },
      {
        pregunta: "¿Qué procesiones no puede perderse?",
        respuesta:
          "El Miércoles de Encuentro, la de mayor emotividad, cuando Jesús Nazareno y la Virgen Dolorosa se reúnen entre miles de velas; la del Santo Sepulcro el Viernes Santo, con mujeres de luto que entonan el “Apuyaya Jesucristo” en quechua; y el Pascua Toro del Sábado de Gloria.",
      },
      {
        pregunta: "¿Cómo se cierra la Semana Santa?",
        respuesta:
          "Con el Sábado de Gloria, entre ferias, fogatas y el tradicional Pascua Toro, y con el Domingo de Resurrección, que culmina con la procesión del Señor Resucitado.",
      },
      {
        pregunta: "Antes de la procesión, ¿dónde comer sabor ayacuchano?",
        respuesta:
          "En el Restaurante Las Flores, a 7 minutos de la Plaza Mayor. Desde 1980 sirve desayuno y almuerzo con cocina ayacuchana, para empezar el día con energía antes de acompañar las procesiones. Revisa nuestra carta: hay muchos más platos para elegir.",
        carta: true,
      },
      {
        pregunta: "¿Dónde descansar tranquilo después de las procesiones?",
        respuesta:
          "En el Hotel Umaru, a 10 minutos de la Plaza de Armas, en el valle de Huatatas: un escape tranquilo rodeado de naturaleza, con piscina al aire libre, jardines y terrazas con vista al valle, lejos del bullicio del centro. Los hospedajes se llenan con semanas de anticipación, así que conviene reservar temprano.",
      },
      {
        pregunta: "¿Cómo organizo mi día en Semana Santa?",
        respuesta:
          "Una idea: desayuna o almuerza en Las Flores (a 7 minutos de la Plaza Mayor), acompaña las procesiones que salen al caer la tarde y termina el día descansando en Umaru (a 10 minutos). Así vives la fe de la ciudad y la cierras en calma.",
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
        dia: "Viernes de Dolores",
        texto:
          "Procesión de la Virgen Dolorosa desde la iglesia de La Magdalena, junto al Señor de la Agonía, la Verónica y San Juan; por la noche se queman chamizos y ninatoros.",
        imagen: "/imagenes-reales/semana-santa/01-viernes-de-dolores.webp",
      },
      {
        numero: "II",
        dia: "Sábado de Pasión",
        texto:
          "Llegada de las palmas desde La Mar y, por la noche, procesión del Señor de la Parra desde la iglesia de Pampa San Agustín, con su anda decorada en racimos de uvas.",
        imagen: "/imagenes-reales/semana-santa/02-sabado-de-pasion.webp",
      },
      {
        numero: "III",
        dia: "Domingo de Ramos",
        texto:
          "Bendición de las palmas en la Basílica Catedral y procesión del Señor de Ramos, montado en un pollino blanco, desde el Monasterio de Santa Teresa.",
        imagen: "/imagenes-reales/semana-santa/03-domingo-de-ramos.webp",
      },
      {
        numero: "IV",
        dia: "Lunes Santo",
        texto:
          "Procesión de Jesús del Huerto desde el Templo de la Buena Muerte hasta la Plaza Mayor, organizada tradicionalmente por la Facultad de Agronomía de la UNSCH.",
        imagen: "/imagenes-reales/semana-santa/04-lunes-santo.webp",
      },
      {
        numero: "V",
        dia: "Martes Santo",
        texto:
          "Procesión del Señor de la Sentencia desde la iglesia de La Amargura, recorriendo las catorce estaciones del Vía Crucis, organizada por el Poder Judicial de Ayacucho.",
        imagen: "/imagenes-reales/semana-santa/05-martes-santo.webp",
      },
      {
        numero: "VI",
        dia: "Miércoles de Encuentro",
        texto:
          "La procesión de mayor emotividad de la semana: Jesús Nazareno y la Virgen Dolorosa se encuentran entre miles de velas encendidas, junto a San Juan, la Verónica y María Magdalena.",
        imagen: "/imagenes-reales/semana-santa/06-miercoles-de-encuentro.webp",
      },
      {
        numero: "VII",
        dia: "Jueves Santo",
        texto:
          "Sin procesiones en las calles: misas al amanecer y romería de los fieles a los monumentos eucarísticos en los templos de la ciudad.",
        imagen: "/imagenes-reales/semana-santa/07-jueves-santo.webp",
      },
      {
        numero: "VIII",
        dia: "Viernes Santo",
        texto:
          "Al atardecer sale la gran procesión del Santo Sepulcro desde Santo Domingo, acompañada por miles de mujeres de luto que entonan el 'Apuyaya Jesucristo' en quechua.",
        imagen: "/imagenes-reales/semana-santa/08-viernes-santo.webp",
      },
      {
        numero: "IX",
        dia: "Sábado de Gloria",
        texto:
          "Peleas de gallos, ferias en el cerro Acuchimay, fogatas de chamizo, la entrada de los Morochucos y el tradicional Pascua Toro por las calles.",
        imagen: "/imagenes-reales/semana-santa/09-sabado-de-gloria.webp",
      },
      {
        numero: "X",
        dia: "Domingo de Resurrección",
        texto:
          "Procesión del Señor Resucitado al amanecer desde la Catedral, el Watacuy de los mayordomos y, por la tarde, la carrera de caballos de los Morochucos.",
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
      "El 9 de diciembre de 1824, en la Pampa de Ayacucho (Quinua), el Ejército Unido Libertador al mando de Antonio José de Sucre venció a un ejército realista más numeroso, sellando la independencia de todo el continente sudamericano. Hoy es feriado nacional: cada año, el obelisco erigido en el campo de batalla recibe una ceremonia cívico-militar y una escenificación histórica.",
    consejo:
      "Asistir temprano a la ceremonia oficial en el Santuario Histórico Pampa de Ayacucho y complementar con una visita a Quinua, Pueblo con Encanto, y sus ceramistas.",
    frase: "Cómo vivir el 9 de Diciembre",
    escenas: "Historia, memoria y libertad: así se vive el 9 de Diciembre.",
    dato: "El obelisco conmemorativo lleva las esculturas de los seis generales que lideraron la contienda.",
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
      "Las actividades de la conmemoración de la Batalla de Ayacucho en el Santuario Histórico Pampa de Ayacucho, en Quinua.",
    cronologia: [
      {
        momento: "Ceremonia central",
        texto: "Acto oficial de conmemoración en el Santuario Histórico Pampa de Ayacucho.",
        imagen: "/imagenes-reales/9-de-diciembre/ceremonia-central.webp",
      },
      {
        momento: "Escenificación",
        texto:
          "Más de mil actores recrean la batalla en el Santuario Histórico, ante miles de espectadores.",
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
      "Un día de historia entre Huamanga y la Pampa de Ayacucho. Todo lo que tiene que saber antes de vivirlo.",
    preguntasImagen: {
      src: "/imagenes-reales/9-de-diciembre/obelisco-de-quinua.webp",
      alt: "Visitantes frente al obelisco de la Pampa de Ayacucho, en Quinua",
    },
    preguntas: [
      {
        pregunta: "¿Qué se conmemora el 9 de diciembre?",
        respuesta:
          "La Batalla de Ayacucho de 1824, en la que el Ejército Unido Libertador, al mando de Antonio José de Sucre, venció a un ejército realista más numeroso y selló la independencia de Sudamérica. Es feriado nacional (Ley 31381).",
      },
      {
        pregunta: "¿Dónde se vive la conmemoración?",
        respuesta:
          "En el Santuario Histórico Pampa de Ayacucho, en Quinua, el mismo campo donde se libró la batalla. Allí se realizan la ceremonia oficial y la escenificación, con más de mil actores.",
      },
      {
        pregunta: "¿Cómo llego a la Pampa de Ayacucho?",
        respuesta:
          "El Santuario está en el distrito de Quinua, a unos 37 km de la ciudad de Huamanga, al pie del cerro Condorcunca. Se llega por carretera, en auto o con un tour desde Huamanga. Para el 9 de diciembre, confirma los accesos y el horario de la ceremonia con la Municipalidad de Huamanga o el Gobierno Regional de Ayacucho.",
      },
      {
        pregunta: "¿Qué puedo ver en el Santuario?",
        respuesta:
          "El obelisco de mármol de 44 metros, con las esculturas de los seis generales que lideraron la contienda, en la planicie donde se libró la batalla y que fue declarada Santuario Histórico en 1980. Muy cerca, Quinua, Pueblo con Encanto, es conocido por sus ceramistas.",
      },
      {
        pregunta: "Antes de la ceremonia, ¿dónde comer sabor ayacuchano?",
        respuesta:
          "En el Restaurante Las Flores, a 7 minutos de la Plaza Mayor. Desde 1980 sirve desayuno y almuerzo con cocina ayacuchana, para empezar el día con energía antes de salir rumbo a la Pampa. Revisa nuestra carta: hay muchos más platos para elegir.",
        carta: true,
      },
      {
        pregunta: "¿Dónde descansar tranquilo después de la jornada?",
        respuesta:
          "En el Hotel Umaru, a 10 minutos de la Plaza de Armas, en el valle de Huatatas: un escape tranquilo rodeado de naturaleza, con piscina al aire libre, jardines y terrazas con vista al valle, lejos del bullicio del centro.",
      },
      {
        pregunta: "¿Cómo organizo mi día del 9 de diciembre?",
        respuesta:
          "Una idea: desayuna o almuerza en Las Flores (a 7 minutos de la Plaza Mayor), viaja a la Pampa de Ayacucho para la ceremonia y la escenificación, y termina el día descansando en Umaru (a 10 minutos). Así vives la historia en el lugar donde ocurrió y la cierras en calma.",
      },
    ],
  },
];
