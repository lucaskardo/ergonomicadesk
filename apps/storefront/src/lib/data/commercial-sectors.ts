// Hardcoded sector data — fallback when Sanity returns null.
// When Sanity has data for a sector, Sanity wins.
// Slugs match the existing /comercial landing page (oficinas, educacion, horeca, salud).

export type SectorSpace = {
  key: string
  name: { es: string; en: string }
  description: { es: string; en: string }
  icon: string
}

export type Sector = {
  slug: string
  title: { es: string; en: string }
  subtitle: { es: string; en: string }
  description: { es: string; en: string }
  heroEyebrow: { es: string; en: string }
  spaces: SectorSpace[]
  whyCopy: { es: string[]; en: string[] }
  ctaText: { es: string; en: string }
  seoTitle: { es: string; en: string }
  seoDescription: { es: string; en: string }
}

export const COMMERCIAL_SECTORS: Sector[] = [
  {
    slug: "oficinas",
    heroEyebrow: { es: "SECTOR \u00B7 CORPORATIVO", en: "SECTOR \u00B7 CORPORATE" },
    title: { es: "Oficinas Corporativas", en: "Corporate Offices" },
    subtitle: {
      es: "Espacios de trabajo que retienen talento, cuidan la salud y proyectan profesionalismo.",
      en: "Workspaces that retain talent, protect health, and project professionalism.",
    },
    description: {
      es: "Dise\u00F1amos oficinas corporativas con mobiliario contract-grade que combina ergonom\u00EDa comprobada, est\u00E9tica moderna y durabilidad para uso intensivo de 8+ horas diarias. Desde estaciones de trabajo individuales hasta salas de reuni\u00F3n, \u00E1reas de descanso y recepci\u00F3n.",
      en: "We design corporate offices with contract-grade furniture combining proven ergonomics, modern aesthetics, and durability for 8+ hour daily use. From individual workstations to meeting rooms, lounge areas, and reception.",
    },
    spaces: [
      { key: "workstations", name: { es: "Estaciones de Trabajo", en: "Workstations" }, description: { es: "Standing desks ergon\u00F3micos y sillas de oficina premium para uso individual diario.", en: "Ergonomic standing desks and premium office chairs for daily individual use." }, icon: "desk" },
      { key: "reuniones", name: { es: "Salas de Reuni\u00F3n", en: "Meeting Rooms" }, description: { es: "Mesas conferenciales, sillas para visitantes y soluciones audiovisuales integradas.", en: "Conference tables, visitor chairs, and integrated AV solutions." }, icon: "meeting" },
      { key: "ejecutivas", name: { es: "Oficinas Ejecutivas", en: "Executive Offices" }, description: { es: "Mobiliario de alta gama para directores y gerencia, con materiales premium.", en: "High-end furniture for directors and management, with premium materials." }, icon: "chair" },
      { key: "lounge-seating", name: { es: "\u00C1reas de Descanso", en: "Lounge Areas" }, description: { es: "Sof\u00E1s, mesas auxiliares y sillones para zonas de caf\u00E9 y descanso.", en: "Sofas, side tables, and armchairs for caf\u00E9 and break areas." }, icon: "lounge" },
      { key: "recepcion", name: { es: "Recepci\u00F3n", en: "Reception" }, description: { es: "Mostradores, sillas de espera y mobiliario que da la primera impresi\u00F3n.", en: "Counters, waiting chairs, and furniture that creates first impressions." }, icon: "reception" },
      { key: "cafeteria", name: { es: "Cafeter\u00EDa", en: "Cafeteria" }, description: { es: "Mesas y sillas para \u00E1reas de comedor y break room corporativo.", en: "Tables and chairs for corporate dining and break rooms." }, icon: "lounge" },
    ],
    whyCopy: {
      es: [
        "Mobiliario contract-grade para uso intensivo diario",
        "Garant\u00EDa extendida hasta 5 a\u00F1os",
        "Dise\u00F1o coordinado para toda la oficina",
        "Entrega e instalaci\u00F3n incluidas en Panam\u00E1",
      ],
      en: [
        "Contract-grade furniture for intensive daily use",
        "Extended warranty up to 5 years",
        "Coordinated design across the entire office",
        "Delivery and installation included in Panama",
      ],
    },
    ctaText: { es: "Solicitar cotizaci\u00F3n corporativa", en: "Request corporate quote" },
    seoTitle: { es: "Mobiliario para Oficinas Corporativas en Panam\u00E1", en: "Corporate Office Furniture in Panama" },
    seoDescription: { es: "Equipamos oficinas corporativas en Panam\u00E1 con mobiliario ergon\u00F3mico contract-grade. Standing desks, sillas premium, salas de reuni\u00F3n.", en: "We equip corporate offices in Panama with ergonomic contract-grade furniture. Standing desks, premium chairs, meeting rooms." },
  },
  {
    slug: "educacion",
    heroEyebrow: { es: "SECTOR \u00B7 EDUCACI\u00D3N", en: "SECTOR \u00B7 EDUCATION" },
    title: { es: "Educaci\u00F3n", en: "Education" },
    subtitle: {
      es: "Estudiantes c\u00F3modos se concentran mejor y rinden m\u00E1s.",
      en: "Comfortable students focus better and perform more.",
    },
    description: {
      es: "Mobiliario para colegios, universidades y centros de capacitaci\u00F3n. Aulas tradicionales y modulares, salas de profesores, bibliotecas y \u00E1reas de estudio. Dise\u00F1ado para resistir el uso intensivo de estudiantes y promover postura saludable desde temprana edad.",
      en: "Furniture for schools, universities, and training centers. Traditional and modular classrooms, faculty lounges, libraries, and study areas. Designed to withstand intensive student use and promote healthy posture from a young age.",
    },
    spaces: [
      { key: "aulas", name: { es: "Aulas", en: "Classrooms" }, description: { es: "Pupitres ergon\u00F3micos y sillas adaptadas a diferentes edades.", en: "Ergonomic desks and chairs adapted to different ages." }, icon: "classroom" },
      { key: "labs", name: { es: "Laboratorios", en: "Labs" }, description: { es: "Mobiliario para laboratorios de ciencias, computaci\u00F3n y arte.", en: "Furniture for science, computing, and art labs." }, icon: "lab" },
      { key: "bibliotecas", name: { es: "Biblioteca", en: "Library" }, description: { es: "Mesas de estudio individual y grupal, sillas para sesiones largas.", en: "Individual and group study tables, chairs for long sessions." }, icon: "library" },
      { key: "auditorios", name: { es: "Auditorios", en: "Auditoriums" }, description: { es: "Sillas plegables, mesas modulares para conferencias y eventos.", en: "Folding chairs, modular tables for conferences and events." }, icon: "training" },
      { key: "profesores", name: { es: "Sala de Profesores", en: "Faculty Lounge" }, description: { es: "Estaciones de trabajo y \u00E1reas de descanso para el profesorado.", en: "Workstations and rest areas for faculty." }, icon: "desk" },
      { key: "admin", name: { es: "Administraci\u00F3n", en: "Administration" }, description: { es: "Oficinas de direcci\u00F3n, secretar\u00EDa y \u00E1reas administrativas.", en: "Principal offices, secretarial and administrative areas." }, icon: "desk" },
    ],
    whyCopy: {
      es: [
        "Mobiliario adaptado a m\u00FAltiples edades",
        "Resistente al uso diario intensivo de estudiantes",
        "Promueve postura saludable desde temprana edad",
        "Cotizaci\u00F3n por proyecto institucional",
      ],
      en: [
        "Furniture adapted to multiple ages",
        "Resistant to intensive daily student use",
        "Promotes healthy posture from a young age",
        "Quote per institutional project",
      ],
    },
    ctaText: { es: "Cotizar proyecto educativo", en: "Quote education project" },
    seoTitle: { es: "Mobiliario Escolar y Universitario en Panam\u00E1", en: "School & University Furniture in Panama" },
    seoDescription: { es: "Mobiliario ergon\u00F3mico para colegios, universidades y centros de capacitaci\u00F3n en Panam\u00E1.", en: "Ergonomic furniture for schools, universities, and training centers in Panama." },
  },
  {
    slug: "horeca",
    heroEyebrow: { es: "SECTOR \u00B7 HORECA", en: "SECTOR \u00B7 HOSPITALITY" },
    title: { es: "Horeca", en: "Hospitality" },
    subtitle: {
      es: "Hoteles, restaurantes y caf\u00E9s que combinan dise\u00F1o, durabilidad y experiencia.",
      en: "Hotels, restaurants, and caf\u00E9s combining design, durability, and guest experience.",
    },
    description: {
      es: "Mobiliario para hoteles, restaurantes, caf\u00E9s y espacios de hospitalidad con materiales resistentes al uso comercial 24/7. Dise\u00F1o que eleva la experiencia del hu\u00E9sped manteniendo la operatividad para el equipo. Lobbies, restaurantes, terrazas, salones de eventos y back office.",
      en: "Furniture for hotels, restaurants, caf\u00E9s, and hospitality spaces with materials resistant to 24/7 commercial use. Design that elevates guest experience while maintaining operational efficiency for staff. Lobbies, restaurants, terraces, event rooms, and back office.",
    },
    spaces: [
      { key: "lobby", name: { es: "Lobby y Recepci\u00F3n", en: "Lobby & Reception" }, description: { es: "Sof\u00E1s, sillones, mesas auxiliares para zonas de bienvenida.", en: "Sofas, armchairs, side tables for welcome areas." }, icon: "lounge" },
      { key: "restaurantes", name: { es: "Restaurante y Bar", en: "Restaurant & Bar" }, description: { es: "Sillas y mesas resistentes al uso diario en F&B.", en: "Chairs and tables resistant to daily F&B use." }, icon: "chair" },
      { key: "cafes", name: { es: "Caf\u00E9 y Coworking", en: "Caf\u00E9 & Coworking" }, description: { es: "Mobiliario h\u00EDbrido para hu\u00E9spedes que trabajan desde el caf\u00E9.", en: "Hybrid furniture for guests working from the caf\u00E9." }, icon: "desk" },
      { key: "terrazas", name: { es: "Terrazas", en: "Terraces" }, description: { es: "Mobiliario outdoor resistente al clima tropical de Panam\u00E1.", en: "Outdoor furniture resistant to Panama's tropical climate." }, icon: "lounge" },
      { key: "eventos", name: { es: "Salones para Eventos", en: "Event Rooms" }, description: { es: "Mesas modulares y sillas apilables para conferencias y banquetes.", en: "Modular tables and stackable chairs for conferences and banquets." }, icon: "meeting" },
      { key: "back-office", name: { es: "Back Office", en: "Back Office" }, description: { es: "Estaciones de trabajo para staff administrativo del hotel.", en: "Workstations for hotel administrative staff." }, icon: "desk" },
    ],
    whyCopy: {
      es: [
        "Materiales resistentes al uso comercial 24/7",
        "Garant\u00EDas comerciales para alto tr\u00E1fico",
        "Dise\u00F1os alineados con la marca del hotel/restaurante",
        "Entrega coordinada con cronograma de obra",
      ],
      en: [
        "Materials resistant to 24/7 commercial use",
        "Commercial warranties for high traffic",
        "Designs aligned with hotel/restaurant brand",
        "Delivery coordinated with construction schedule",
      ],
    },
    ctaText: { es: "Cotizar proyecto de hospitalidad", en: "Quote hospitality project" },
    seoTitle: { es: "Mobiliario para Hoteles y Restaurantes en Panam\u00E1", en: "Hotel & Restaurant Furniture in Panama" },
    seoDescription: { es: "Mobiliario contract-grade para hoteles, restaurantes, caf\u00E9s y espacios de hospitalidad en Panam\u00E1.", en: "Contract-grade furniture for hotels, restaurants, caf\u00E9s, and hospitality spaces in Panama." },
  },
  {
    slug: "salud",
    heroEyebrow: { es: "SECTOR \u00B7 SALUD", en: "SECTOR \u00B7 HEALTHCARE" },
    title: { es: "Salud", en: "Healthcare" },
    subtitle: {
      es: "Paciente c\u00F3modo, m\u00E9dico sin dolor. Todos ganan.",
      en: "Comfortable patient, pain-free doctor. Everyone wins.",
    },
    description: {
      es: "Mobiliario para cl\u00EDnicas, consultorios y centros m\u00E9dicos. Sillas con soporte lumbar cl\u00EDnico para profesionales que pasan jornadas largas, escritorios ajustables, y mobiliario para salas de espera con materiales f\u00E1ciles de desinfectar.",
      en: "Furniture for clinics, consulting rooms, and medical centers. Chairs with clinical lumbar support for professionals with long shifts, adjustable desks, and waiting room furniture with easy-to-disinfect materials.",
    },
    spaces: [
      { key: "espera", name: { es: "Salas de Espera", en: "Waiting Rooms" }, description: { es: "Sillas c\u00F3modas, resistentes y f\u00E1ciles de limpiar para pacientes.", en: "Comfortable, resistant, easy-to-clean chairs for patients." }, icon: "patient" },
      { key: "consultorios", name: { es: "Consultorios", en: "Consulting Rooms" }, description: { es: "Sillas ergon\u00F3micas y escritorios para uso prolongado de profesionales m\u00E9dicos.", en: "Ergonomic chairs and desks for prolonged medical professional use." }, icon: "exam" },
      { key: "recepcion", name: { es: "Recepci\u00F3n Cl\u00EDnica", en: "Clinical Reception" }, description: { es: "Mostradores y sillas para personal de admisi\u00F3n.", en: "Counters and chairs for admissions staff." }, icon: "reception" },
      { key: "admin", name: { es: "Administraci\u00F3n", en: "Administration" }, description: { es: "Estaciones de trabajo para personal administrativo.", en: "Workstations for administrative staff." }, icon: "desk" },
    ],
    whyCopy: {
      es: [
        "Sillas con soporte lumbar de grado cl\u00EDnico",
        "Materiales f\u00E1ciles de desinfectar",
        "Cumplimiento de normas de salud ocupacional",
        "Garant\u00EDa extendida para uso intensivo",
      ],
      en: [
        "Chairs with clinical-grade lumbar support",
        "Easy-to-disinfect materials",
        "Occupational health compliance",
        "Extended warranty for intensive use",
      ],
    },
    ctaText: { es: "Cotizar para cl\u00EDnica", en: "Quote for clinic" },
    seoTitle: { es: "Mobiliario M\u00E9dico y Cl\u00EDnico en Panam\u00E1", en: "Medical & Clinical Furniture in Panama" },
    seoDescription: { es: "Mobiliario ergon\u00F3mico para cl\u00EDnicas, consultorios y centros m\u00E9dicos en Panam\u00E1.", en: "Ergonomic furniture for clinics, consulting rooms, and medical centers in Panama." },
  },
]

export function getSectorBySlug(slug: string): Sector | undefined {
  return COMMERCIAL_SECTORS.find((s) => s.slug === slug)
}
