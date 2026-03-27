import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { getLang } from "@lib/i18n"
import { buildMetadata } from "@lib/util/metadata"
import { commercialPath, SITE_URL } from "@lib/util/routes"
import { sanityFetch } from "@/sanity/lib/live"
import { COMMERCIAL_SECTORS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"

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

type SanitySector = {
  _id: string
  slug: string
  title: { es?: string; en?: string }
  subtitle?: { es?: string; en?: string }
  heroImage?: { asset?: { _id: string; url: string }; alt?: string }
}

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
        subtitle: lang === "en" ? (s.subtitle?.en ?? s.subtitle?.es ?? "") : (s.subtitle?.es ?? ""),
        image: s.heroImage?.asset
          ? urlFor(s.heroImage).width(640).height(420).fit("crop").url()
          : undefined,
        imageAlt: s.heroImage?.alt ?? "",
      }))
    : FALLBACK_SECTORS.map((s) => ({
        slug: s.slug,
        title: lang === "en" ? s.title.en : s.title.es,
        subtitle: lang === "en" ? s.subtitle.en : s.subtitle.es,
        image: undefined,
        imageAlt: "",
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

      {/* Hero */}
      <section className="bg-ergo-950 pt-20 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto text-center">
          <span className="inline-block text-[0.65rem] uppercase tracking-[0.14em] text-ergo-sky font-semibold mb-4">
            {lang === "en" ? "Commercial Projects" : "Proyectos Comerciales"}
          </span>
          <h1
            className="font-display font-bold text-white tracking-tight mb-5"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            {lang === "en"
              ? "Commercial spaces, designed to perform"
              : "Diseñamos espacios comerciales que funcionan"}
          </h1>
          <p className="text-ergo-300 text-[0.95rem] max-w-xl mx-auto mb-8 leading-relaxed">
            {lang === "en"
              ? "Ergonomic furniture tailored to offices, schools, hotels and healthcare facilities in Panama. Free consulting and full installation."
              : "Mobiliario ergonómico a medida para oficinas, colegios, hoteles y clínicas en Panamá. Asesoría gratuita e instalación incluida."}
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-ergo-sky text-ergo-950 font-semibold text-[0.88rem] px-7 py-3.5 hover:bg-ergo-sky/90 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {lang === "en" ? "Request a free quote" : "Solicitar cotización gratis"}
          </a>
        </div>
      </section>

      {/* Sector grid */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <h2
          className="font-display font-bold text-ergo-950 tracking-tight text-center mb-10"
          style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
        >
          {lang === "en" ? "Industries we serve" : "Sectores que equipamos"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sectors.map((sector) => (
            <LocalizedClientLink
              key={sector.slug}
              href={commercialPath(sector.slug)}
              className="group flex flex-col overflow-hidden border border-ergo-100 hover:border-ergo-sky/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-ergo-100">
                {sector.image ? (
                  <Image
                    src={sector.image}
                    alt={sector.imageAlt || sector.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-ergo-950/5 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ergo-200">
                      <rect x="2" y="3" width="20" height="14" rx="1" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ergo-950/60 to-transparent" />
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5 bg-white">
                <h3 className="font-display font-bold text-ergo-950 text-[0.97rem] leading-tight mb-1.5 group-hover:text-ergo-sky transition-colors">
                  {sector.title}
                </h3>
                <p className="text-ergo-400 text-[0.8rem] leading-relaxed flex-1">{sector.subtitle}</p>
                <span className="mt-4 text-[0.72rem] font-semibold text-ergo-sky uppercase tracking-[0.08em] flex items-center gap-1">
                  {lang === "en" ? "View sector" : "Ver sector"}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-ergo-50 py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <h2
            className="font-display font-bold text-ergo-950 tracking-tight text-center mb-12"
            style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
          >
            {lang === "en" ? "How it works" : "Cómo trabajamos"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: { es: "Consulta gratuita", en: "Free consulting" },
                desc: { es: "Nos reunimos (virtual o presencial) para entender tu espacio, necesidades y presupuesto.", en: "We meet (online or in person) to understand your space, needs and budget." },
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ergo-sky">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: { es: "Diseño del espacio", en: "Space design" },
                desc: { es: "Preparamos una propuesta de distribución con los productos que mejor se adapten a tu proyecto.", en: "We prepare a layout proposal with the products that best fit your project." },
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ergo-sky">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: { es: "Entrega e instalación", en: "Delivery & installation" },
                desc: { es: "Coordinamos la entrega y el equipo de instalación para que no tengas que preocuparte por nada.", en: "We coordinate delivery and installation so you don't have to worry about a thing." },
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ergo-sky">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center border border-ergo-sky/30 bg-white">
                  {item.icon}
                </div>
                <span className="text-[0.62rem] font-bold text-ergo-sky tracking-[0.14em] uppercase">{item.step}</span>
                <h3 className="font-display font-bold text-ergo-950 text-[1rem]">
                  {lang === "en" ? item.title.en : item.title.es}
                </h3>
                <p className="text-ergo-400 text-[0.82rem] leading-relaxed max-w-xs">
                  {lang === "en" ? item.desc.en : item.desc.es}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-ergo-950 py-16 px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {lang === "en" ? "Ready to transform your space?" : "¿Listo para transformar tu espacio?"}
          </h2>
          <p className="text-ergo-300 text-[0.9rem] mb-8 leading-relaxed">
            {lang === "en"
              ? "Talk to our commercial team and get a custom quote for your project."
              : "Habla con nuestro equipo comercial y recibí una cotización personalizada para tu proyecto."}
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-ergo-sky text-ergo-950 font-semibold text-[0.88rem] px-8 py-4 hover:bg-ergo-sky/90 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {lang === "en" ? "Chat on WhatsApp" : "Escribinos por WhatsApp"}
          </a>
        </div>
      </section>
    </>
  )
}
