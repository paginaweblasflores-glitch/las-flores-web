export type DiaItem = { numero: string; dia: string; texto: string; imagen: string };
export type ComparsaItem = { imagen: string; nombre: string; descripcion: string };
export type MomentoItem = { momento: string; hora: string; texto: string; imagen: string };

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
  /** Día a día (solo Semana Santa: 7 jornadas, se presentan con un selector numerado). */
  dias?: DiaItem[];
  /** Comparsas reales (solo Carnaval: se presentan paginadas de dos en dos). */
  comparsas?: ComparsaItem[];
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
    reconocimiento: "Patrimonio Cultural de la Nación",
    lugarPrincipal: "Plaza Mayor y barrios de Huamanga",
    heroTitulo: "Donde el juego andino se viste de mil colores",
    imagen: "/imagenes-reales/galeria/festividades/carnaval-uno.webp",
    imagenSecundaria: "/imagenes-reales/galeria/festividades/carnaval-tres.webp",
    descripcion:
      "Nacido de la fusión entre los carnavales medievales españoles y el antiguo Pukllay andino —el juego ritual previo a la siembra—, el Carnaval Ayacuchano reúne comparsas de cada barrio, música de huayno y competencias tradicionales como el warakanakuy, en una de las fiestas más coloridas del sur peruano.",
    consejo:
      "Llevar ropa que se pueda mojar: el agua, el talco y la espuma son parte esencial de la fiesta.",
    frase: "Un duelo festivo donde nadie pierde, solo se celebra.",
    escenas: "Color, música y comparsas: así se vive el Carnaval Ayacuchano.",
    dato: "Sus huaynos de carnaval tienen melodías propias, reconocidas a nivel internacional.",
    clipTags: [
      "Comparsas en la plaza",
      "Yunza y corta-montes",
      "Warakanakuy (duelo ritual)",
      "Huaynos de carnaval",
    ],
    comparsas: [
      {
        imagen: "/imagenes-reales/galeria/festividades/carnaval-uno.webp",
        nombre: "Los Abuelos de Quinua",
        descripcion:
          "Comparsa legendaria que representa a los ancianos (\"machus\") de la zona oriental de Ayacucho — un clásico inmortal del carnaval huamanguino.",
      },
      {
        imagen: "/imagenes-reales/galeria/festividades/carnaval-tres.webp",
        nombre: "Cangallo Corazón",
        descripcion:
          "Una de las comparsas más numerosas, con 200 a 300 bailarines representando a la provincia de Cangallo.",
      },
      {
        imagen: "/imagenes-reales/seccion-festividades/carnaval-musica.webp",
        nombre: "Comparsa de Chuschi",
        descripcion:
          "Representa la Qachwa, el ritual de la cosecha compartido con Totos, Paras y Pomabamba, en la provincia de Cangallo — una danza que mezcla los antiguos ritos agrícolas con el carnaval.",
      },
      {
        imagen: "/imagenes-reales/seccion-festividades/carnaval-ayacuchano.webp",
        nombre: "Comparsa de Totos",
        descripcion:
          "Una de las más fotografiadas del desfile: cada año, los clubes de residentes de Totos, en Cangallo, la traen de vuelta a las calles de Huamanga.",
      },
    ],
  },
  {
    id: 1,
    slug: "semana-santa",
    nombre: "Semana Santa Ayacuchana",
    categoria: "Fe y Tradición",
    fecha: "Marzo / Abril",
    reconocimiento: "Patrimonio Cultural de la Nación (2022)",
    lugarPrincipal: "Centro histórico de Huamanga",
    heroTitulo: "Una semana en la que toda una ciudad se vuelve procesión",
    imagen: "/imagenes-reales/galeria/festividades/samana-santa-uno.webp",
    imagenSecundaria: "/imagenes-reales/galeria/festividades/semana-santa-tres.webp",
    descripcion:
      "Con raíces coloniales del siglo XVI y consolidada a mediados del siglo XIX, la Semana Santa Ayacuchana es una de las celebraciones religiosas más multitudinarias de Latinoamérica, superada solo por Sevilla. Comienza el Viernes de Dolores y culmina el Domingo de Resurrección: diez días de procesiones ininterrumpidas por las calles de Huamanga.",
    consejo:
      "Llegar con anticipación a la Plaza Mayor para presenciar la salida de las procesiones; los hospedajes se llenan con semanas de anticipación.",
    frase: "Una ciudad entera convertida en altar, noche tras noche.",
    escenas: "Incienso, flores y fe: así se vive la Semana Santa en Huamanga.",
    dato: "Recibe hasta 80,000 visitantes cada año, con más de un siglo y medio de tradición ininterrumpida.",
    clipTags: ["Anda cargada entre flores", "Alfombras de flores", "Quema del Judas", "Jala Toro en la plaza"],
    dias: [
      {
        numero: "I",
        dia: "Viernes de Dolores",
        texto:
          "Procesión de la Virgen Dolorosa desde la iglesia de La Magdalena, junto al Señor de la Agonía, la Verónica y San Juan; por la noche se queman chamizos y ninatoros.",
        imagen: "/imagenes-reales/seccion-turs/catedral-semana-santa.webp",
      },
      {
        numero: "II",
        dia: "Sábado de Pasión",
        texto:
          "Llegada de las palmas desde La Mar y, por la noche, procesión del Señor de la Parra desde la iglesia de Pampa San Agustín, con su anda decorada en racimos de uvas.",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-senor-parra.webp",
      },
      {
        numero: "III",
        dia: "Domingo de Ramos",
        texto:
          "Bendición de las palmas en la Basílica Catedral y procesión del Señor de Ramos, montado en un pollino blanco, desde el Monasterio de Santa Teresa.",
        imagen: "/imagenes-reales/galeria/festividades/samana-santa-uno.webp",
      },
      {
        numero: "IV",
        dia: "Lunes Santo",
        texto:
          "Procesión de Jesús del Huerto desde el Templo de la Buena Muerte hasta la Plaza Mayor, organizada tradicionalmente por la Facultad de Agronomía de la UNSCH.",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-anda-nocturna.webp",
      },
      {
        numero: "V",
        dia: "Martes Santo",
        texto:
          "Procesión del Señor de la Sentencia desde la iglesia de La Amargura, recorriendo las catorce estaciones del Vía Crucis, organizada por el Poder Judicial de Ayacucho.",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-incienso.webp",
      },
      {
        numero: "VI",
        dia: "Miércoles de Encuentro",
        texto:
          "La procesión de mayor emotividad de la semana: Jesús Nazareno y la Virgen Dolorosa se encuentran entre miles de velas encendidas, junto a San Juan, la Verónica y María Magdalena.",
        imagen: "/imagenes-reales/galeria/festividades/semana-santa-tres.webp",
      },
      {
        numero: "VII",
        dia: "Jueves Santo",
        texto:
          "Sin procesiones en las calles: misas al amanecer y romería de los fieles a los monumentos eucarísticos en los templos de la ciudad.",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-senor-parra.webp",
      },
      {
        numero: "VIII",
        dia: "Viernes Santo",
        texto:
          "Al atardecer sale la gran procesión del Santo Sepulcro desde Santo Domingo, acompañada por miles de mujeres de luto que entonan el 'Apuyaya Jesucristo' en quechua.",
        imagen: "/imagenes-reales/seccion-turs/catedral-semana-santa.webp",
      },
      {
        numero: "IX",
        dia: "Sábado de Gloria",
        texto:
          "Peleas de gallos, ferias en el cerro Acuchimay, fogatas de chamizo, la entrada de los Morochucos y el tradicional Pascua Toro por las calles.",
        imagen: "/imagenes-reales/galeria/festividades/samana-santa-uno.webp",
      },
      {
        numero: "X",
        dia: "Domingo de Resurrección",
        texto:
          "Procesión del Señor Resucitado al amanecer desde la Catedral, el Watacuy de los mayordomos y, por la tarde, la carrera de caballos de los Morochucos.",
        imagen: "/imagenes-reales/seccion-festividades/semana-santa-anda-nocturna.webp",
      },
    ],
  },
  {
    id: 3,
    slug: "9-de-diciembre",
    nombre: "Batalla de Ayacucho",
    categoria: "Historia Viva",
    fecha: "Diciembre",
    reconocimiento: "Feriado Nacional",
    lugarPrincipal: "Santuario Histórico de la Pampa de Quinua",
    heroTitulo: "El día en que un continente dejó de ser colonia",
    imagen: "/imagenes-reales/seccion-turs/pampa-quinua.webp",
    imagenSecundaria: "/imagenes-reales/galeria/destino/Quinua1.webp",
    descripcion:
      "El 9 de diciembre de 1824, en la Pampa de Quinua, el Ejército Unido Libertador al mando de Antonio José de Sucre venció a un ejército realista casi el doble de numeroso, sellando la independencia de todo el continente sudamericano. Cada año, el obelisco erigido en el campo de batalla recibe una ceremonia cívico-militar y una escenificación histórica.",
    consejo:
      "Asistir temprano a la ceremonia oficial en la Pampa de Quinua y complementar con una visita al pueblo de Quinua y sus ceramistas.",
    frase: "Un campo de batalla convertido en santuario de la libertad.",
    escenas: "Historia, memoria y libertad: así se vive el 9 de Diciembre.",
    dato: "El obelisco conmemorativo lleva las esculturas de los seis generales que lideraron la contienda.",
    clipTags: [
      "Escenificación de la batalla",
      "Obelisco y los 6 generales",
      "Ceremonia cívico-militar",
      "Toma aérea de la pampa",
    ],
    cronologia: [
      {
        momento: "Víspera",
        hora: "8 de diciembre",
        texto:
          "Te Deum y desfile militar en la Plaza Mayor de Huamanga, seguido de sesión solemne en el Concejo Municipal.",
        imagen: "/imagenes-reales/galeria/destino/Plaza3.webp",
      },
      {
        momento: "Ceremonia central",
        hora: "9 de diciembre, 11:00 a.m.",
        texto: "Acto oficial de conmemoración en el Santuario Histórico de la Pampa de Quinua.",
        imagen: "/imagenes-reales/galeria/destino/Quinua2.webp",
      },
      {
        momento: "Escenificación",
        hora: "9 de diciembre, 12:30 p.m.",
        texto:
          "Más de 2,000 actores recrean la batalla en el cerro Condorcunca, ante miles de espectadores.",
        imagen: "/imagenes-reales/seccion-festividades/monumento-sucre.webp",
      },
    ],
  },
];
