/**
 * Sanity seed script — seeds 4 commercialSector documents.
 *
 * Run:
 *   cd apps/storefront && node scripts/seed-comercial.mjs
 *
 * Reads SANITY_API_READ_TOKEN from .env.local
 */

import { createClient } from "next-sanity"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

function readEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local")
    const content = readFileSync(envPath, "utf-8")
    const match = content.match(/^SANITY_API_READ_TOKEN=(.+)$/m)
    return match ? match[1].trim() : undefined
  } catch {
    return undefined
  }
}

const token = process.env.SANITY_API_READ_TOKEN || readEnv()

const client = createClient({
  projectId: "7b580fxk",
  dataset: "production",
  apiVersion: "2025-03-18",
  token,
  useCdn: false,
})

async function seed() {
  console.log("🌱 Seeding comercial sectors...")

  // ── Oficinas Corporativas ──────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "commercialSector-oficinas",
    _type: "commercialSector",
    title: {
      es: "Oficinas Corporativas",
      en: "Corporate Offices",
    },
    slug: { _type: "slug", current: "oficinas" },
    subtitle: {
      es: "Diseñamos y equipamos espacios de trabajo corporativos que aumentan la productividad y el bienestar de tu equipo.",
      en: "We design and furnish corporate workspaces that boost your team's productivity and wellbeing.",
    },
    description: {
      es: `Equipar una oficina corporativa en Panamá va mucho más allá de comprar escritorios y sillas. En Ergonómica, ofrecemos un servicio integral que comienza con una consulta gratuita para entender el espacio, los flujos de trabajo y el número de personas que lo ocuparán.

Nuestro equipo prepara una propuesta de distribución que maximiza el uso del espacio disponible, seleccionando los productos que mejor se adaptan a cada zona: estaciones de trabajo abiertas, salas de reuniones equipadas con mesas de conferencia, oficinas privadas para ejecutivos, áreas lounge para descanso y colaboración informal, y recepciones que proyectan la imagen de tu empresa.

Trabajamos con standing desks regulables en altura que ayudan a reducir el sedentarismo, sillas ergonómicas con soporte lumbar ajustable, y sistemas de almacenamiento modulares. Todos nuestros productos están pensados para espacios de trabajo de alto rendimiento.

Además, ofrecemos descuentos por volumen para proyectos corporativos, con precios especiales a partir de 10 unidades. La entrega e instalación están incluidas en Panamá Ciudad, y coordinamos el montaje para minimizar el impacto en tus operaciones.

Contamos con experiencia en proyectos en Coco del Mar, Costa del Este, Obarrio, San Francisco y otros centros empresariales de la capital. Contáctanos hoy para tu cotización personalizada.`,
      en: `Furnishing a corporate office in Panama goes far beyond buying desks and chairs. At Ergonómica, we offer a comprehensive service that starts with a free consultation to understand the space, workflows and headcount.

Our team prepares a layout proposal that maximizes the available space, selecting the right products for each area: open workstations, meeting rooms with conference tables, executive private offices, lounge areas for rest and informal collaboration, and reception areas that project your company's image.

We work with height-adjustable standing desks that help reduce sedentary behavior, ergonomic chairs with adjustable lumbar support, and modular storage systems. All our products are designed for high-performance work environments.

We also offer volume discounts for corporate projects, with special pricing from 10 units. Delivery and installation are included in Panama City, and we coordinate assembly to minimize impact on your operations.

We have experience in projects in Coco del Mar, Costa del Este, Obarrio, San Francisco and other business centers in the capital. Contact us today for your custom quote.`,
    },
    spaces: [
      { _key: "sp-of-1", name: { es: "Estaciones de trabajo", en: "Workstations" }, slug: "estaciones-de-trabajo", description: { es: "Open offices y puestos individuales con standing desks y sillas ergonómicas.", en: "Open offices and individual stations with standing desks and ergonomic chairs." }, icon: "🖥️" },
      { _key: "sp-of-2", name: { es: "Salas de reuniones", en: "Meeting rooms" }, slug: "salas-de-reuniones", description: { es: "Mesas de conferencia, sillas ejecutivas y accesorios audiovisuales.", en: "Conference tables, executive chairs and AV accessories." }, icon: "🤝" },
      { _key: "sp-of-3", name: { es: "Oficinas privadas", en: "Private offices" }, slug: "oficinas-privadas", description: { es: "Escritorios ejecutivos, sillones de dirección y estanterías a medida.", en: "Executive desks, director chairs and custom shelving." }, icon: "🏢" },
      { _key: "sp-of-4", name: { es: "Áreas lounge", en: "Lounge areas" }, slug: "areas-lounge", description: { es: "Sillones, mesas bajas y módulos para descanso y colaboración informal.", en: "Armchairs, coffee tables and modules for rest and informal collaboration." }, icon: "🛋️" },
      { _key: "sp-of-5", name: { es: "Recepción", en: "Reception" }, slug: "recepcion", description: { es: "Mostradores de recepción, sillas de espera y señalética corporativa.", en: "Reception counters, waiting chairs and corporate signage." }, icon: "🏛️" },
      { _key: "sp-of-6", name: { es: "Cafetería interna", en: "Break room" }, slug: "cafeteria", description: { es: "Mesas comedor, taburetes y mobiliario para zonas de descanso.", en: "Dining tables, stools and furniture for break areas." }, icon: "☕" },
      { _key: "sp-of-7", name: { es: "Áreas de colaboración", en: "Collaboration areas" }, slug: "colaboracion", description: { es: "Muebles flexibles para trabajo en equipo, brainstorming y formación.", en: "Flexible furniture for teamwork, brainstorming and training." }, icon: "💡" },
    ],
    faqs: [
      {
        _key: "faq-of-1",
        question: { es: "¿Cuánto cuesta equipar una oficina corporativa?", en: "How much does it cost to furnish a corporate office?" },
        answer: { es: "El costo depende del tamaño del espacio, el número de puestos y los productos elegidos. Ofrecemos cotizaciones personalizadas y gratuitas. Contáctanos para recibir una propuesta adaptada a tu presupuesto.", en: "The cost depends on the size of the space, number of workstations and products chosen. We offer free, personalized quotes. Contact us for a proposal tailored to your budget." },
      },
      {
        _key: "faq-of-2",
        question: { es: "¿Cuánto tiempo tarda la entrega e instalación?", en: "How long does delivery and installation take?" },
        answer: { es: "Los tiempos varían según el volumen del pedido. Para proyectos medianos (10–50 puestos) estimamos entre 5 y 10 días hábiles desde la confirmación. Proyectos más grandes requieren coordinación previa.", en: "Timelines vary by order size. For medium projects (10–50 workstations) we estimate 5–10 business days from confirmation. Larger projects require prior coordination." },
      },
      {
        _key: "faq-of-3",
        question: { es: "¿Ofrecen descuentos por volumen?", en: "Do you offer volume discounts?" },
        answer: { es: "Sí. A partir de 10 unidades aplicamos precios especiales. A partir de 30 unidades, los descuentos son significativos. Contáctanos para recibir una cotización de proyecto.", en: "Yes. From 10 units we apply special pricing. From 30 units, discounts are significant. Contact us for a project quote." },
      },
      {
        _key: "faq-of-4",
        question: { es: "¿Incluye el servicio de instalación y montaje?", en: "Does the service include installation and assembly?" },
        answer: { es: "Sí. La instalación está incluida para proyectos en Panamá Ciudad. Para interior del país, coordinamos el servicio con un costo adicional.", en: "Yes. Installation is included for projects in Panama City. For the interior, we coordinate the service at an additional cost." },
      },
      {
        _key: "faq-of-5",
        question: { es: "¿Pueden ayudarme con el diseño del espacio?", en: "Can you help with space design?" },
        answer: { es: "Sí. Preparamos una propuesta de distribución basada en el plano de tu oficina, sin costo adicional para proyectos corporativos. Solo necesitamos las medidas del espacio y el número de personas.", en: "Yes. We prepare a layout proposal based on your office floor plan at no extra cost for corporate projects. We just need the space dimensions and headcount." },
      },
    ],
    keywords: ["mobiliario oficina panamá", "muebles de oficina", "standing desk oficina", "diseño oficinas panamá", "equipamiento corporativo panamá"],
    ctaText: { es: "Solicitar cotización", en: "Request a quote" },
    ctaLink: "https://wa.me/50769533776",
    seoTitle: { es: "Mobiliario para Oficinas Corporativas en Panamá", en: "Corporate Office Furniture in Panama" },
    seoDescription: { es: "Diseñamos y equipamos oficinas corporativas en Panamá con standing desks, sillas ergonómicas y soluciones de almacenamiento. Asesoría gratuita, entrega e instalación incluidas.", en: "We design and furnish corporate offices in Panama with standing desks, ergonomic chairs and storage solutions. Free consulting, delivery and installation included." },
  })
  console.log("✓ Oficinas Corporativas")

  // ── Educación ──────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "commercialSector-educacion",
    _type: "commercialSector",
    title: { es: "Educación", en: "Education" },
    slug: { _type: "slug", current: "educacion" },
    subtitle: {
      es: "Mobiliario ergonómico para colegios, universidades y centros de capacitación en Panamá.",
      en: "Ergonomic furniture for schools, universities and training centers in Panama.",
    },
    description: {
      es: `Los espacios educativos modernos requieren mobiliario que acompañe distintas modalidades de aprendizaje: trabajo individual, colaboración en grupos, presentaciones y actividades prácticas. En Ergonómica, ofrecemos soluciones para todos los niveles: desde aulas de primaria hasta laboratorios universitarios.

Nuestra propuesta para el sector educativo incluye escritorios y sillas regulables en altura para aulas, mesas modulares para trabajo colaborativo, pupitres individuales para exámenes, estanterías y archiveros para bibliotecas, y mobiliario administrativo para las áreas de gestión.

Todos los materiales cumplen estándares de durabilidad para uso intensivo. Trabajamos con colegios privados, universidades, institutos técnicos y empresas de capacitación corporativa. El proceso incluye visita técnica, propuesta de distribución y presupuesto sin costo.

Ofrecemos financiamiento y condiciones especiales para instituciones educativas. Contáctanos para conocer los programas disponibles.`,
      en: `Modern educational spaces need furniture that supports different learning modes: individual work, group collaboration, presentations and hands-on activities. At Ergonómica, we offer solutions for all levels: from primary school classrooms to university laboratories.

Our proposal for the education sector includes height-adjustable desks and chairs for classrooms, modular tables for collaborative work, individual desks for exams, shelving and filing cabinets for libraries, and administrative furniture for management areas.

All materials meet durability standards for intensive use. We work with private schools, universities, technical institutes and corporate training companies. The process includes a technical visit, layout proposal and quote at no cost.

We offer financing and special terms for educational institutions. Contact us to learn about available programs.`,
    },
    spaces: [
      { _key: "sp-ed-1", name: { es: "Aulas", en: "Classrooms" }, slug: "aulas", description: { es: "Escritorios, sillas y pupitres regulables para todos los niveles.", en: "Desks, chairs and adjustable student desks for all levels." }, icon: "📚" },
      { _key: "sp-ed-2", name: { es: "Laboratorios", en: "Laboratories" }, slug: "laboratorios", description: { es: "Mesas de laboratorio resistentes y sillas de altura ajustable.", en: "Durable lab tables and height-adjustable stools." }, icon: "🔬" },
      { _key: "sp-ed-3", name: { es: "Bibliotecas", en: "Libraries" }, slug: "bibliotecas", description: { es: "Estanterías, mesas de estudio y sillas para zonas de lectura.", en: "Shelving, study tables and chairs for reading areas." }, icon: "📖" },
      { _key: "sp-ed-4", name: { es: "Áreas comunes", en: "Common areas" }, slug: "areas-comunes", description: { es: "Mobiliario para pasillos, cafeterías y zonas de descanso estudiantil.", en: "Furniture for hallways, cafeterias and student rest areas." }, icon: "🏫" },
      { _key: "sp-ed-5", name: { es: "Oficinas administrativas", en: "Administrative offices" }, slug: "admin", description: { es: "Escritorios, sillas ergonómicas y almacenamiento para el personal.", en: "Desks, ergonomic chairs and storage for staff." }, icon: "🗂️" },
    ],
    faqs: [
      {
        _key: "faq-ed-1",
        question: { es: "¿Tienen productos específicos para colegios?", en: "Do you have products specifically for schools?" },
        answer: { es: "Sí. Contamos con escritorios y sillas regulables pensados para aulas, resistentes al uso diario y fáciles de apilar. Contáctanos para ver opciones según el nivel educativo.", en: "Yes. We have height-adjustable desks and chairs designed for classrooms, resistant to daily use and easy to stack. Contact us to see options by education level." },
      },
      {
        _key: "faq-ed-2",
        question: { es: "¿Ofrecen condiciones especiales para instituciones educativas?", en: "Do you offer special terms for educational institutions?" },
        answer: { es: "Sí. Manejamos condiciones especiales para colegios y universidades, incluyendo precios de proyecto, opciones de financiamiento y plazos de entrega coordinados con el calendario escolar.", en: "Yes. We offer special terms for schools and universities, including project pricing, financing options and delivery timelines coordinated with the school calendar." },
      },
      {
        _key: "faq-ed-3",
        question: { es: "¿Pueden visitar el centro educativo para tomar medidas?", en: "Can you visit the educational center to take measurements?" },
        answer: { es: "Sí. Para proyectos de 20 unidades o más, ofrecemos visita técnica sin costo en Panamá Ciudad y área metropolitana.", en: "Yes. For projects of 20+ units, we offer a technical visit at no cost in Panama City and the metropolitan area." },
      },
      {
        _key: "faq-ed-4",
        question: { es: "¿Los muebles tienen garantía?", en: "Do the furniture items come with a warranty?" },
        answer: { es: "Sí. Todos los productos tienen garantía de al menos 1 año. Los standing desks tienen garantías de hasta 5 años en el mecanismo de elevación.", en: "Yes. All products come with at least a 1-year warranty. Standing desks carry up to 5-year warranties on the lifting mechanism." },
      },
    ],
    keywords: ["mobiliario educativo panamá", "muebles escuelas", "escritorios aulas", "sillas estudiantes", "equipamiento colegios panamá"],
    ctaText: { es: "Solicitar cotización", en: "Request a quote" },
    ctaLink: "https://wa.me/50769533776",
    seoTitle: { es: "Mobiliario Educativo para Colegios y Universidades en Panamá", en: "Educational Furniture for Schools and Universities in Panama" },
    seoDescription: { es: "Mobiliario ergonómico para aulas, laboratorios y bibliotecas en Panamá. Escritorios regulables, sillas resistentes y condiciones especiales para instituciones educativas.", en: "Ergonomic furniture for classrooms, labs and libraries in Panama. Adjustable desks, durable chairs and special terms for educational institutions." },
  })
  console.log("✓ Educación")

  // ── Horeca ─────────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "commercialSector-horeca",
    _type: "commercialSector",
    title: { es: "Horeca", en: "Hospitality" },
    slug: { _type: "slug", current: "horeca" },
    subtitle: {
      es: "Mobiliario para hoteles, restaurantes, cafeterías y espacios de eventos en Panamá.",
      en: "Furniture for hotels, restaurants, cafés and event spaces in Panama.",
    },
    description: {
      es: `El sector Horeca (Hoteles, Restaurantes y Catering) exige mobiliario que combine estética, durabilidad y funcionalidad. Un lobby de hotel, una terraza de restaurante o una cafetería de autor necesitan piezas que soporten el uso intensivo diario sin perder la elegancia que define la experiencia del huésped o comensal.

En Ergonómica, trabajamos con diseñadores de interiores, operadores hoteleros y restauranteros para seleccionar el mobiliario que mejor se adapte a la identidad de su espacio. Nuestro catálogo incluye sillas de comedor apilables, mesas con tapa laminada resistente a la humedad, sillones para lobby, mobiliario para salas de eventos y equipamiento para áreas lounge al aire libre.

Ofrecemos asesoría en selección de materiales según el clima y el uso previsto, con opciones para interiores climatizados y para exteriores tropicales. Todos los acabados disponibles en múltiples colores para adaptarse a cualquier concepto de diseño.

El proceso incluye consulta inicial, moodboard de propuesta, cotización por fases y coordinación de entrega. Trabajamos con hoteles boutique, cadenas internacionales, food courts y restaurantes de autor en Panamá.`,
      en: `The Horeca sector (Hotels, Restaurants and Catering) demands furniture that combines aesthetics, durability and functionality. A hotel lobby, restaurant terrace or specialty café needs pieces that withstand intensive daily use without losing the elegance that defines the guest or diner experience.

At Ergonómica, we work with interior designers, hotel operators and restaurateurs to select furniture that best fits the identity of their space. Our catalog includes stackable dining chairs, tables with moisture-resistant laminate tops, lobby armchairs, furniture for event rooms and equipment for outdoor lounge areas.

We offer consulting on material selection based on climate and intended use, with options for air-conditioned interiors and tropical outdoor environments. All finishes available in multiple colors to adapt to any design concept.

The process includes initial consultation, proposal moodboard, phased quotation and delivery coordination. We work with boutique hotels, international chains, food courts and fine dining restaurants in Panama.`,
    },
    spaces: [
      { _key: "sp-ho-1", name: { es: "Lobby", en: "Lobby" }, slug: "lobby", description: { es: "Sillones, mesas de centro y elementos decorativos para la recepción del hotel.", en: "Armchairs, coffee tables and decorative elements for hotel reception." }, icon: "🏨" },
      { _key: "sp-ho-2", name: { es: "Restaurantes", en: "Restaurants" }, slug: "restaurantes", description: { es: "Mesas y sillas de comedor resistentes para servicio continuo.", en: "Durable dining tables and chairs for continuous service." }, icon: "🍽️" },
      { _key: "sp-ho-3", name: { es: "Cafeterías", en: "Cafés" }, slug: "cafeterias", description: { es: "Mobiliario versátil para cafeterías y espacios de desayuno.", en: "Versatile furniture for cafés and breakfast areas." }, icon: "☕" },
      { _key: "sp-ho-4", name: { es: "Salas de eventos", en: "Event rooms" }, slug: "salas-eventos", description: { es: "Mesas plegables, sillas apilables y mobiliario flexible para eventos.", en: "Folding tables, stackable chairs and flexible furniture for events." }, icon: "🎪" },
      { _key: "sp-ho-5", name: { es: "Áreas lounge", en: "Lounge areas" }, slug: "lounge", description: { es: "Sofás, poufs y mesas auxiliares para zonas de relax y socialización.", en: "Sofas, poufs and side tables for relaxation and social areas." }, icon: "🛋️" },
    ],
    faqs: [
      {
        _key: "faq-ho-1",
        question: { es: "¿Tienen mobiliario apto para uso en exteriores tropicales?", en: "Do you have furniture suitable for tropical outdoor use?" },
        answer: { es: "Sí. Contamos con opciones en materiales resistentes a la humedad, lluvia y sol intenso. Consultanos las opciones disponibles para terrazas y piscinas.", en: "Yes. We carry options in materials resistant to humidity, rain and intense sun. Contact us for available options for terraces and pools." },
      },
      {
        _key: "faq-ho-2",
        question: { es: "¿Pueden personalizar el color o acabado?", en: "Can you customize the color or finish?" },
        answer: { es: "Muchos de nuestros productos están disponibles en múltiples colores y acabados. Para proyectos grandes, podemos coordinar opciones especiales con el fabricante.", en: "Many of our products are available in multiple colors and finishes. For large projects, we can coordinate special options with the manufacturer." },
      },
      {
        _key: "faq-ho-3",
        question: { es: "¿Trabajan con diseñadores de interiores?", en: "Do you work with interior designers?" },
        answer: { es: "Sí. Tenemos un programa para profesionales del diseño que incluye condiciones especiales y acceso a muestras. Contáctanos para conocer el programa.", en: "Yes. We have a designer program that includes special terms and sample access. Contact us to learn about the program." },
      },
      {
        _key: "faq-ho-4",
        question: { es: "¿Cuántas sillas necesito para un restaurante de X mesas?", en: "How many chairs do I need for a restaurant with X tables?" },
        answer: { es: "La regla general es 4 sillas por mesa cuadrada o redonda de 4 personas. Para mesas rectangulares de 6, se usan 6 sillas. Nuestro equipo puede ayudarte a calcular la cantidad exacta según el plano.", en: "The general rule is 4 chairs per square or round 4-person table. For 6-person rectangular tables, 6 chairs are used. Our team can help calculate the exact quantity based on your floor plan." },
      },
    ],
    keywords: ["mobiliario horeca panamá", "muebles hoteles", "sillas restaurantes", "mobiliario café panamá", "equipamiento hotelero"],
    ctaText: { es: "Solicitar cotización", en: "Request a quote" },
    ctaLink: "https://wa.me/50769533776",
    seoTitle: { es: "Mobiliario para Hoteles, Restaurantes y Cafeterías en Panamá", en: "Furniture for Hotels, Restaurants and Cafés in Panama" },
    seoDescription: { es: "Mobiliario para el sector Horeca en Panamá: hoteles, restaurantes, cafeterías y salones de eventos. Opciones para interiores y exteriores tropicales.", en: "Furniture for the Horeca sector in Panama: hotels, restaurants, cafés and event rooms. Options for tropical indoor and outdoor environments." },
  })
  console.log("✓ Horeca")

  // ── Salud ──────────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "commercialSector-salud",
    _type: "commercialSector",
    title: { es: "Salud", en: "Healthcare" },
    slug: { _type: "slug", current: "salud" },
    subtitle: {
      es: "Mobiliario ergonómico y funcional para clínicas, consultorios y centros de salud en Panamá.",
      en: "Ergonomic and functional furniture for clinics, offices and healthcare centers in Panama.",
    },
    description: {
      es: `Los espacios de salud tienen requerimientos únicos: materiales fáciles de limpiar y desinfectar, asientos cómodos para tiempos de espera prolongados, y mobiliario para consultorios que permita trabajar largas horas sin fatiga.

En Ergonómica, ofrecemos soluciones para salas de espera con sillas tapizadas en telas antimicrobiales y fáciles de limpiar, mesas auxiliares y mobiliario de apoyo. Para consultorios, proporcionamos escritorios médicos, sillas ergonómicas para médicos y personal de enfermería, y estaciones de trabajo compactas.

Las áreas administrativas de clínicas y hospitales también se benefician de nuestros standing desks y sillas de trabajo de largo aliento, ya que el personal pasa muchas horas frente al computador gestionando expedientes y citas.

Trabajamos con consultorios privados, clínicas multiespecialistas, centros de diagnóstico y áreas administrativas de hospitales. Todos los proyectos incluyen asesoría gratuita y propuesta de distribución.`,
      en: `Healthcare spaces have unique requirements: easy-to-clean and disinfect materials, comfortable seating for extended waiting times, and office furniture that allows working long hours without fatigue.

At Ergonómica, we offer solutions for waiting rooms with chairs upholstered in antimicrobial, easy-to-clean fabrics, auxiliary tables and support furniture. For consulting rooms, we provide medical desks, ergonomic chairs for doctors and nursing staff, and compact workstations.

Administrative areas of clinics and hospitals also benefit from our standing desks and long-endurance work chairs, as staff spend many hours in front of computers managing records and appointments.

We work with private practices, multi-specialty clinics, diagnostic centers and administrative areas of hospitals. All projects include free consulting and a layout proposal.`,
    },
    spaces: [
      { _key: "sp-sa-1", name: { es: "Salas de espera", en: "Waiting rooms" }, slug: "salas-de-espera", description: { es: "Sillas confortables y resistentes para tiempos de espera prolongados.", en: "Comfortable, durable chairs for extended waiting times." }, icon: "🪑" },
      { _key: "sp-sa-2", name: { es: "Consultorios", en: "Consulting rooms" }, slug: "consultorios", description: { es: "Escritorios médicos, sillas ergonómicas y almacenamiento para consultas.", en: "Medical desks, ergonomic chairs and storage for consultations." }, icon: "🩺" },
      { _key: "sp-sa-3", name: { es: "Áreas administrativas", en: "Administrative areas" }, slug: "admin", description: { es: "Standing desks, sillas de trabajo y organización para gestión de expedientes.", en: "Standing desks, work chairs and organization for records management." }, icon: "🗂️" },
    ],
    faqs: [
      {
        _key: "faq-sa-1",
        question: { es: "¿Tienen sillas fáciles de limpiar para salas de espera?", en: "Do you have easy-to-clean chairs for waiting rooms?" },
        answer: { es: "Sí. Contamos con sillas tapizadas en materiales vinílicos y telas antimicrobiales que permiten la limpieza con desinfectantes hospitalarios. Consultanos opciones y precios.", en: "Yes. We have chairs upholstered in vinyl and antimicrobial fabrics that can be cleaned with hospital disinfectants. Ask us about options and pricing." },
      },
      {
        _key: "faq-sa-2",
        question: { es: "¿Las sillas para médicos son ergonómicas?", en: "Are the chairs for doctors ergonomic?" },
        answer: { es: "Sí. Tenemos sillas específicas para profesionales de salud con soporte lumbar ajustable, reposabrazos regulables y mecanismo de reclinación. Son ideales para jornadas largas frente al escritorio.", en: "Yes. We have chairs specifically for healthcare professionals with adjustable lumbar support, adjustable armrests and reclining mechanism. They're ideal for long shifts at a desk." },
      },
      {
        _key: "faq-sa-3",
        question: { es: "¿Trabajan con proyectos de hospitales grandes?", en: "Do you work on large hospital projects?" },
        answer: { es: "Sí. Tenemos experiencia en proyectos de gran escala con entregas por fases. Para proyectos de más de 100 unidades, ofrecemos condiciones especiales de precio y logística.", en: "Yes. We have experience in large-scale projects with phased deliveries. For projects over 100 units, we offer special pricing and logistics terms." },
      },
    ],
    keywords: ["mobiliario clínico panamá", "muebles sala espera clínica", "sillas ergonómicas médicos", "escritorios consultorios", "equipamiento hospitales panamá"],
    ctaText: { es: "Solicitar cotización", en: "Request a quote" },
    ctaLink: "https://wa.me/50769533776",
    seoTitle: { es: "Mobiliario para Clínicas, Consultorios y Centros de Salud en Panamá", en: "Furniture for Clinics, Offices and Healthcare Centers in Panama" },
    seoDescription: { es: "Mobiliario ergonómico para el sector salud en Panamá: salas de espera, consultorios y áreas administrativas. Materiales fáciles de limpiar y asesoría gratuita.", en: "Ergonomic furniture for the healthcare sector in Panama: waiting rooms, consulting rooms and administrative areas. Easy-to-clean materials and free consulting." },
  })
  console.log("✓ Salud")

  console.log("\n✅ Seed completado — 4 sectores comerciales creados en Sanity.")
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
