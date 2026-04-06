import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { getLang } from "@lib/i18n"
import { buildMetadata } from "@lib/util/metadata"
import { commercialPath, SITE_URL } from "@lib/util/routes"
import { sanityFetch } from "@/sanity/lib/live"
import { COMMERCIAL_SECTORS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import {
  IconFactoryDirect,
  IconStandingDesk,
  IconSkyline,
  IconChat,
  IconFloorPlan,
  IconDelivery,
} from "@modules/commercial/components/animated-icons"

export async function generateMetadata(
  props: { params: Promise<{ countryCode: string }> }
): Promise<Metadata> {
  const { countryCode } = await props.params
  const lang = await getLang()
  return buildMetadata({
    title: lang === "en"
      ? "Commercial Projects | Office, Education & Hospitality Furniture"
      : "Proyectos Comerciales | Mobiliario para Oficinas, Educación y Horeca",
    description: lang === "en"
      ? "We design and furnish commercial spaces in Panama. Offices, schools, hotels, restaurants and healthcare facilities. Free consulting."
      : "Diseñamos y equipamos espacios comerciales en Panamá. Oficinas, colegios, hoteles, restaurantes y clínicas. Asesoría gratuita.",
    countryCode,
    lang,
    path: "/comercial",
  })
}

const FALLBACK_SECTORS = [
  { slug: "oficinas", title: { es: "Oficinas Corporativas", en: "Corporate Offices" }, subtitle: { es: "Estaciones de trabajo, salas de reuniones y más", en: "Workstations, meeting rooms and more" } },
  { slug: "educacion", title: { es: "Educación", en: "Education" }, subtitle: { es: "Aulas, laboratorios y áreas administrativas", en: "Classrooms, labs and admin areas" } },
  { slug: "horeca", title: { es: "Horeca", en: "Hospitality" }, subtitle: { es: "Hoteles, restaurantes y cafeterías", en: "Hotels, restaurants and cafés" } },
  { slug: "salud", title: { es: "Salud", en: "Healthcare" }, subtitle: { es: "Salas de espera, consultorios y administración", en: "Waiting rooms, offices and administration" } },
]

const SECTOR_COPY: Record<string, { copy: { es: string; en: string }; tags: { es: string[]; en: string[] } }> = {
  oficinas: {
    copy: {
      es: "Tu equipo pasa 2,000 horas al año aquí. Que se sienta bien.",
      en: "Your team spends 2,000 hours a year here. Make it count.",
    },
    tags: { es: ["Workstations", "Reuniones", "Ejecutivas", "Lounge", "Cafetería"], en: ["Workstations", "Meetings", "Executive", "Lounge", "Cafeteria"] },
  },
  educacion: {
    copy: {
      es: "Estudiantes cómodos se concentran mejor y rinden más.",
      en: "Comfortable students focus better and perform more.",
    },
    tags: { es: ["Aulas", "Labs", "Bibliotecas", "Auditorios", "Admin"], en: ["Classrooms", "Labs", "Libraries", "Auditoriums", "Admin"] },
  },
  horeca: {
    copy: {
      es: "La experiencia empieza en el mobiliario.",
      en: "The experience starts with the furniture.",
    },
    tags: { es: ["Lobby", "Restaurantes", "Cafés", "Terrazas", "Eventos"], en: ["Lobby", "Restaurants", "Cafés", "Terraces", "Events"] },
  },
  salud: {
    copy: {
      es: "Paciente cómodo, médico sin dolor. Todos ganan.",
      en: "Comfortable patient, pain-free doctor. Everyone wins.",
    },
    tags: { es: ["Espera", "Consultorios", "Recepción", "Admin"], en: ["Waiting", "Offices", "Reception", "Admin"] },
  },
}

type SanitySector = {
  _id: string
  slug: string
  title: { es?: string; en?: string }
  subtitle?: { es?: string; en?: string }
  heroImage?: { asset?: { _id: string; url: string }; alt?: string }
  spaces?: Array<{ _key: string }>
}

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default async function ComercialPage(
  props: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await props.params
  const lang = await getLang()

  const result = await sanityFetch({ query: COMMERCIAL_SECTORS_QUERY }).catch(() => ({ data: null }))
  const sanitySectors: SanitySector[] | null =
    result?.data && Array.isArray(result.data) && result.data.length > 0
      ? result.data
      : null

  const sectors = sanitySectors
    ? sanitySectors.map((s) => ({
        slug: s.slug,
        title: lang === "en" ? (s.title.en ?? s.title.es ?? "") : (s.title.es ?? ""),
        image: s.heroImage?.asset
          ? urlFor(s.heroImage).width(800).height(560).fit("crop").url()
          : undefined,
        imageAlt: s.heroImage?.alt ?? "",
        spaceCount: s.spaces?.length ?? 0,
      }))
    : FALLBACK_SECTORS.map((s) => ({
        slug: s.slug,
        title: lang === "en" ? s.title.en : s.title.es,
        image: undefined,
        imageAlt: "",
        spaceCount: 0,
      }))

  const WA_URL = "https://wa.me/50769533776?text=" + encodeURIComponent(
    lang === "en" ? "Hello, I'm interested in a commercial project." : "Hola, estoy interesado en un proyecto comercial."
  )

  const breadcrumbs = [
    { name: lang === "en" ? "Home" : "Inicio", url: `${SITE_URL}/pa` },
    { name: lang === "en" ? "Commercial" : "Comercial", url: `${SITE_URL}/pa/comercial` },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Sección 1 — Hero */}
      <section className="relative bg-ergo-950 overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-ergo-950/90 via-ergo-950/70 to-transparent z-10" />
        <div className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-24 w-full">
          <span className="inline-block text-[0.65rem] uppercase tracking-[0.14em] text-ergo-sky font-semibold mb-4">
            {lang === "en" ? "Commercial Projects" : "Proyectos Comerciales"}
          </span>
          <h1
            className="font-display font-bold text-white tracking-tight mb-5 max-w-2xl"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            {lang === "en"
              ? "Spaces that look good and make your team perform better"
              : "Espacios que se ven bien y hacen que tu equipo rinda más"}
          </h1>
          <p className="text-ergo-300 text-[0.95rem] max-w-lg mb-8 leading-relaxed">
            {lang === "en"
              ? "Ergonomic furniture with modern design for offices, schools, hotels and clinics in Panama."
              : "Mobiliario ergonómico con diseño moderno para oficinas, colegios, hoteles y clínicas en Panamá."}
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-ergo-sky text-ergo-950 font-semibold text-[0.88rem] px-7 py-3.5 hover:bg-ergo-sky/90 transition-colors"
          >
            {lang === "en" ? "Schedule a free consultation →" : "Agendar consulta gratuita →"}
          </a>
        </div>
      </section>

      {/* Sección 2 — Trust stats */}
      <section style={{ background: "#F8F5F0" }} className="py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "5+", label: { es: "Años en Panamá", en: "Years in Panama" } },
              { value: "500+", label: { es: "Espacios equipados", en: "Spaces furnished" } },
              { value: "100%", label: { es: "Instalación incluida", en: "Installation included" } },
              { value: "5 años", label: { es: "Garantía promedio", en: "Avg. warranty" } },
            ].map((stat) => (
              <div key={stat.value}>
                <p className="font-display font-bold text-ergo-950 mb-1" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}>
                  {stat.value}
                </p>
                <p className="text-ergo-500 text-[0.8rem]">{lang === "en" ? stat.label.en : stat.label.es}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 3 — Visión */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="font-display font-bold text-ergo-950 tracking-tight mb-5"
              style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
            >
              {lang === "en"
                ? "We design where your best work happens"
                : "Diseñamos donde sucede tu mejor trabajo"}
            </h2>
            <p className="text-ergo-600 text-[0.92rem] leading-[1.85] mb-6">
              {lang === "en"
                ? "Each product selected for its modern design, proven ergonomics and commercial-grade quality. Offices that impress clients and take care of your team."
                : "Cada producto seleccionado por su diseño moderno, ergonomía comprobada y calidad para uso comercial. Oficinas que impresionan clientes y cuidan a tu equipo."}
            </p>
            <p className="text-ergo-400 text-[0.75rem] leading-relaxed">
              {lang === "en"
                ? "ISO 9001 certified factories · BIFMA and EN 1335 standard · Up to 5-year warranty"
                : "Fábricas certificadas ISO 9001 · Estándar BIFMA y EN 1335 · Garantía hasta 5 años"}
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-ergo-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-ergo-200">
                <rect x="2" y="3" width="20" height="14" rx="1" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4 — Escoge tu sector */}
      <section style={{ background: "#F8F5F0" }} className="py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <h2
            className="font-display font-bold text-ergo-950 tracking-tight text-center mb-12"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
          >
            {lang === "en" ? "Choose your sector" : "Escoge tu sector"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sectors.map((sector) => {
              const copy = SECTOR_COPY[sector.slug]
              const copyText = copy ? (lang === "en" ? copy.copy.en : copy.copy.es) : ""
              const tags = copy ? (lang === "en" ? copy.tags.en : copy.tags.es) : []
              return (
                <LocalizedClientLink
                  key={sector.slug}
                  href={commercialPath(sector.slug)}
                  className="group flex flex-col overflow-hidden border border-ergo-100 hover:border-ergo-sky/50 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image with overlay */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-ergo-100">
                    {sector.image ? (
                      <Image
                        src={sector.image}
                        alt={sector.imageAlt || sector.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ergo-200 to-ergo-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ergo-950/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <h3 className="font-display font-bold text-white text-[1.1rem] leading-tight">{sector.title}</h3>
                      {sector.spaceCount > 0 && (
                        <span className="text-[0.68rem] text-white/70 font-medium flex-shrink-0 ml-2">
                          {sector.spaceCount} {lang === "en" ? "spaces" : "espacios"}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 bg-white">
                    {copyText && (
                      <p className="text-ergo-600 text-[0.82rem] leading-relaxed mb-3 flex-1 italic">{copyText}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.65rem] px-2 py-0.5 bg-ergo-50 text-ergo-500 font-medium border border-ergo-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sección 5 — Servicio llave en mano */}
      <section style={{ background: "#F8F5F0" }} className="py-20 px-4 sm:px-6 lg:px-10 border-t border-ergo-100">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-12">
            <h2
              className="font-display font-bold text-ergo-950 tracking-tight mb-3"
              style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
            >
              {lang === "en" ? "Turnkey service" : "Servicio llave en mano"}
            </h2>
            <p className="text-ergo-500 text-[0.9rem]">
              {lang === "en" ? "Your office ready in weeks. No hassle." : "Tu oficina lista en semanas. Sin complicaciones."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                num: "01",
                icon: <IconChat />,
                key: "consult",
                title: { es: "Consulta", en: "Consultation" },
                desc: {
                  es: "Entendemos tu espacio, equipo y visión. Virtual o presencial, sin costo.",
                  en: "We understand your space, team and vision. Virtual or in-person, free of charge.",
                },
              },
              {
                num: "02",
                icon: <IconFloorPlan />,
                key: "design",
                title: { es: "Diseño", en: "Design" },
                desc: {
                  es: "Propuesta con layout, productos seleccionados y presupuesto a medida.",
                  en: "Proposal with layout, selected products and custom budget.",
                },
              },
              {
                num: "03",
                icon: <IconDelivery />,
                key: "install",
                title: { es: "Instalación", en: "Installation" },
                desc: {
                  es: "Entrega, ensamblaje y configuración. Tu equipo llega y trabaja.",
                  en: "Delivery, assembly and setup. Your team arrives and works.",
                },
              },
            ].map((item, i, arr) => (
              <div key={item.key} className="flex items-stretch gap-4">
                <div className="flex-1 bg-white p-7 border border-ergo-100">
                  <div className="mb-4 flex items-center gap-3">
                    {item.icon}
                    <span className="font-display font-extrabold text-[1.6rem] text-ergo-sky leading-none">{item.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-ergo-950 text-[1rem] mb-2">
                    {lang === "en" ? item.title.en : item.title.es}
                  </h3>
                  <p className="text-ergo-500 text-[0.82rem] leading-relaxed">
                    {lang === "en" ? item.desc.en : item.desc.es}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:flex items-center text-ergo-300 text-xl font-light self-center">→</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-ergo-400 text-[0.78rem]">
            {lang === "en"
              ? "All included: consulting, delivery and assembly in Panama City"
              : "Todo incluido: asesoría, entrega y ensamblaje en Ciudad de Panamá"}
          </p>
        </div>
      </section>

      {/* Sección 6 — Por qué Ergonómica */}
      <section className="bg-ergo-bg-warm py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <h2
            className="font-display font-bold text-ergo-950 tracking-tight text-center mb-14"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
          >
            {lang === "en" ? "Why Ergonómica" : "Por qué Ergonómica"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ergo-200">
            {[
              {
                icon: <IconFactoryDirect />,
                key: "direct",
                title: { es: "Precio directo", en: "Direct pricing" },
                desc: {
                  es: "Sin intermediarios ni distribuidores. Trabajas directo con nosotros — mejor calidad, menos costo.",
                  en: "No middlemen or distributors. You work directly with us — better quality, lower cost.",
                },
              },
              {
                icon: <IconStandingDesk />,
                key: "ergonomics",
                title: { es: "Diseño + ergonomía", en: "Design + ergonomics" },
                desc: {
                  es: "Cada producto elegido por cómo se ve Y cómo se siente. Tu oficina impresiona y tu equipo lo agradece.",
                  en: "Each product chosen for how it looks AND how it feels. Your office impresses and your team appreciates it.",
                },
              },
              {
                icon: <IconSkyline />,
                key: "panama",
                title: { es: "Expertise en Panamá", en: "Panama expertise" },
                desc: {
                  es: "5+ años equipando empresas aquí. Conocemos los edificios, la logística y el mercado local.",
                  en: "5+ years equipping companies here. We know the buildings, the logistics and the local market.",
                },
              },
            ].map((item) => (
              <div key={item.key} className="px-8 py-8 md:py-0 first:pl-0 last:pr-0 text-center md:text-left">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-ergo-950 text-[1rem] mb-3">
                  {lang === "en" ? item.title.en : item.title.es}
                </h3>
                <p className="text-ergo-400 text-[0.82rem] leading-relaxed">
                  {lang === "en" ? item.desc.en : item.desc.es}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 7 — Testimonio */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto text-center">
          <h2
            className="font-display font-bold text-ergo-950 tracking-tight mb-10"
            style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
          >
            {lang === "en" ? "What our clients say" : "Lo que dicen nuestros clientes"}
          </h2>
          <div className="max-w-xl mx-auto border border-ergo-100 p-10">
            <div className="flex justify-center gap-0.5 mb-6 text-ergo-sky text-lg">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <blockquote className="text-ergo-700 text-[0.95rem] leading-[1.85] italic mb-8">
              &ldquo;{lang === "en"
                ? "The office looks incredible and the team is much more comfortable. Clients notice it when they visit us."
                : "La oficina se ve increíble y el equipo está mucho más cómodo. Los clientes lo notan cuando nos visitan."}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ergo-100 flex items-center justify-center text-ergo-400 font-bold text-sm">RS</div>
              <div className="text-left">
                <p className="font-semibold text-ergo-950 text-[0.85rem]">Roberto S.</p>
                <p className="text-ergo-400 text-[0.75rem]">
                  {lang === "en" ? "Operations Director · 24 workstations" : "Dir. Operaciones · 24 estaciones"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 8 — CTA final */}
      <section className="bg-ergo-950 py-20 px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {lang === "en" ? "Ready to transform your space?" : "¿Listo para transformar tu espacio?"}
          </h2>
          <p className="text-ergo-300 text-[0.9rem] mb-8 leading-relaxed">
            {lang === "en" ? "Free consultation. Your office ready in weeks." : "Consulta gratuita. Tu oficina lista en semanas."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-ergo-sky text-ergo-950 font-semibold text-[0.88rem] px-8 py-4 hover:bg-ergo-sky/90 transition-colors"
            >
              {WA_SVG}
              WhatsApp →
            </a>
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-ergo-sky text-ergo-sky font-semibold text-[0.88rem] px-8 py-4 hover:bg-ergo-sky/10 transition-colors"
            >
              {lang === "en" ? "PDF Catalog" : "Catálogo PDF"}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
