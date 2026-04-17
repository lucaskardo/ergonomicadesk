import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { FAQPageJsonLd } from "@modules/common/components/json-ld/faq"
import { FAQAccordion } from "@modules/commercial/components/faq-accordion"
import { getLang } from "@lib/i18n"
import { buildMetadata } from "@lib/util/metadata"
import { commercialPath, SITE_URL } from "@lib/util/routes"
import { sanityFetch } from "@/sanity/lib/live"
import { COMMERCIAL_SECTOR_QUERY, COMMERCIAL_SECTORS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import { getSectorBySlug, COMMERCIAL_SECTORS } from "@lib/data/commercial-sectors"

type SpaceImage = { asset?: { _id: string; url: string }; alt?: string; hotspot?: unknown; crop?: unknown }

type SectorData = {
  _id: string
  slug: string
  title: { es?: string; en?: string }
  subtitle?: { es?: string; en?: string }
  description?: { es?: string; en?: string }
  heroImage?: SpaceImage
  spaces?: Array<{
    _key: string
    name: { es?: string; en?: string }
    slug?: string
    description?: { es?: string; en?: string }
    icon?: string
    image?: SpaceImage
    gallery?: Array<{ _key: string; asset?: { _id: string; url: string }; alt?: string }>
  }>
  gallery?: Array<{ _key: string; asset?: { _id: string; url: string }; alt?: string }>
  catalogFile?: { asset?: { _id: string; url: string } }
  faqs?: Array<{
    _key: string
    question: { es?: string; en?: string }
    answer: { es?: string; en?: string }
  }>
  seoTitle?: { es?: string; en?: string }
  seoDescription?: { es?: string; en?: string }
  keywords?: string[]
  ctaText?: { es?: string; en?: string }
  ctaLink?: string
}

export async function generateStaticParams() {
  // Always pre-render all 4 sectors statically using hardcoded fallback.
  // Sanity data (when present) is fetched at request time and overrides fallback.
  return COMMERCIAL_SECTORS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ countryCode: string; slug: string }> }
): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const lang = await getLang()

  const result = await sanityFetch({ query: COMMERCIAL_SECTOR_QUERY, params: { slug } }).catch(() => ({ data: null }))
  const sanitySector = result?.data as SectorData | null
  const fallback = getSectorBySlug(slug)

  const title = sanitySector
    ? (lang === "en" ? (sanitySector.seoTitle?.en ?? sanitySector.seoTitle?.es ?? sanitySector.title.en ?? sanitySector.title.es ?? "") : (sanitySector.seoTitle?.es ?? sanitySector.title.es ?? ""))
    : (fallback ? (lang === "en" ? fallback.seoTitle.en : fallback.seoTitle.es) : slug)

  const description = sanitySector
    ? (lang === "en" ? (sanitySector.seoDescription?.en ?? sanitySector.seoDescription?.es ?? sanitySector.subtitle?.en ?? sanitySector.subtitle?.es ?? "") : (sanitySector.seoDescription?.es ?? sanitySector.subtitle?.es ?? ""))
    : (fallback ? (lang === "en" ? fallback.seoDescription.en : fallback.seoDescription.es) : "")

  return buildMetadata({
    title,
    description,
    countryCode,
    lang,
    path: commercialPath(slug),
    keywords: sanitySector?.keywords,
  })
}

export default async function CommercialSectorPage(
  props: { params: Promise<{ countryCode: string; slug: string }> }
) {
  const { countryCode, slug } = await props.params
  const lang = await getLang()

  const result = await sanityFetch({ query: COMMERCIAL_SECTOR_QUERY, params: { slug } }).catch(() => ({ data: null }))
  const sanitySector = result?.data as SectorData | null
  const fallbackSector = getSectorBySlug(slug)

  if (!sanitySector && !fallbackSector) {
    notFound()
  }

  // Build the sector object: Sanity wins where present, fallback fills gaps.
  const sector: SectorData = sanitySector ?? {
    _id: `fallback-${slug}`,
    slug: fallbackSector!.slug,
    title: fallbackSector!.title,
    subtitle: fallbackSector!.subtitle,
    description: fallbackSector!.description,
    spaces: fallbackSector!.spaces.map((s) => ({
      _key: s.key,
      name: s.name,
      slug: s.key,
      description: s.description,
      icon: s.icon,
    })),
    ctaText: fallbackSector!.ctaText,
    seoTitle: fallbackSector!.seoTitle,
    seoDescription: fallbackSector!.seoDescription,
  }

  const title = lang === "en" ? (sector.title.en ?? sector.title.es ?? "") : (sector.title.es ?? "")
  const subtitle = lang === "en" ? (sector.subtitle?.en ?? sector.subtitle?.es ?? "") : (sector.subtitle?.es ?? "")
  const description = lang === "en" ? (sector.description?.en ?? sector.description?.es ?? "") : (sector.description?.es ?? "")
  const ctaText = sector.ctaText
    ? (lang === "en" ? (sector.ctaText.en ?? sector.ctaText.es ?? "") : (sector.ctaText.es ?? ""))
    : (lang === "en" ? "Request a quote" : "Solicitar cotización")

  const waMessage = encodeURIComponent(
    lang === "en"
      ? `Hello, I'm interested in a ${title} project.`
      : `Hola, estoy interesado en un proyecto de ${title}.`
  )
  const WA_URL = `${sector.ctaLink ?? "https://wa.me/50769533776"}${sector.ctaLink?.includes("?") ? "&" : "?"}text=${waMessage}`

  const heroImageUrl = sector.heroImage?.asset
    ? urlFor(sector.heroImage).width(1440).height(600).fit("crop").url()
    : undefined

  const breadcrumbs = [
    { name: lang === "en" ? "Home" : "Inicio", url: `${SITE_URL}/pa` },
    { name: lang === "en" ? "Commercial" : "Comercial", url: `${SITE_URL}/pa/comercial` },
    { name: title, url: `${SITE_URL}/pa${commercialPath(slug)}` },
  ]

  const faqItems = sector.faqs?.map((faq) => ({
    q: lang === "en" ? (faq.question.en ?? faq.question.es ?? "") : (faq.question.es ?? ""),
    a: lang === "en" ? (faq.answer.en ?? faq.answer.es ?? "") : (faq.answer.es ?? ""),
  })) ?? []

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {faqItems.length > 0 && <FAQPageJsonLd faqs={faqItems} />}

      {/* Visual breadcrumb */}
      <nav className="bg-white border-b border-ergo-100 px-4 sm:px-6 lg:px-10 py-3">
        <div className="max-w-[1360px] mx-auto flex items-center gap-2 text-[0.75rem] text-ergo-400">
          <LocalizedClientLink href="/" className="hover:text-ergo-sky transition-colors">
            {lang === "en" ? "Home" : "Inicio"}
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href={commercialPath()} className="hover:text-ergo-sky transition-colors">
            {lang === "en" ? "Commercial" : "Comercial"}
          </LocalizedClientLink>
          <span>/</span>
          <span className="text-ergo-950 font-medium">{title}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-ergo-950 overflow-hidden" style={{ minHeight: 320 }}>
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={sector.heroImage?.alt ?? title}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <LocalizedClientLink
            href={commercialPath()}
            className="inline-flex items-center gap-1 text-[0.72rem] text-ergo-sky hover:text-ergo-sky/80 transition-colors mb-6 uppercase tracking-[0.1em] font-semibold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {lang === "en" ? "All sectors" : "Todos los sectores"}
          </LocalizedClientLink>
          <h1
            className="font-display font-bold text-white tracking-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-ergo-300 text-[0.95rem] max-w-xl leading-relaxed">{subtitle}</p>
          )}
        </div>
      </section>

      {/* Description */}
      {description && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="max-w-3xl">
            <p className="text-ergo-600 text-[0.92rem] leading-[1.85] whitespace-pre-line">{description}</p>
          </div>
        </section>
      )}

      {/* Spaces */}
      {sector.spaces && sector.spaces.length > 0 && (
        <section className="bg-ergo-50 py-14 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1360px] mx-auto">
            <h2
              className="font-display font-bold text-ergo-950 tracking-tight mb-10"
              style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
            >
              {lang === "en" ? "Choose your space" : "Escoge tu espacio"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sector.spaces.map((space) => {
                const spaceName = lang === "en" ? (space.name.en ?? space.name.es ?? "") : (space.name.es ?? "")
                const spaceDesc = lang === "en" ? (space.description?.en ?? space.description?.es ?? "") : (space.description?.es ?? "")
                const spaceImageUrl = space.image?.asset
                  ? urlFor(space.image).width(640).height(420).fit("crop").url()
                  : undefined
                const cardContent = (
                  <div className="group flex flex-col overflow-hidden border border-ergo-100 hover:border-ergo-sky/50 hover:-translate-y-1 transition duration-base bg-white">
                    {/* Photo */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      {spaceImageUrl ? (
                        <Image
                          src={spaceImageUrl}
                          alt={space.image?.alt ?? spaceName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-base"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-ergo-100 to-ergo-200" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ergo-950/60 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <h3 className="font-display font-bold text-white text-[0.95rem] leading-tight">{spaceName}</h3>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="flex flex-col flex-1 p-5">
                      {spaceDesc && (
                        <p className="text-ergo-400 text-[0.8rem] leading-relaxed flex-1 mb-4">{spaceDesc}</p>
                      )}
                      <span className="text-[0.72rem] font-semibold text-ergo-sky uppercase tracking-[0.08em] flex items-center gap-1">
                        {lang === "en" ? "See product types →" : "Ver tipos de producto →"}
                      </span>
                    </div>
                  </div>
                )
                return space.slug ? (
                  <LocalizedClientLink key={space._key} href={commercialPath(slug, space.slug)}>
                    {cardContent}
                  </LocalizedClientLink>
                ) : (
                  <div key={space._key}>{cardContent}</div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {sector.gallery && sector.gallery.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <h2
            className="font-display font-bold text-ergo-950 mb-8"
            style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)" }}
          >
            {lang === "en" ? "Gallery" : "Galería"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sector.gallery.map((img) => {
              if (!img.asset?.url) return null
              const imgUrl = urlFor(img).width(480).height(360).fit("crop").url()
              return (
                <div key={img._key} className="relative aspect-[4/3] overflow-hidden bg-ergo-50">
                  <Image src={imgUrl} alt={img.alt ?? title} fill className="object-cover" />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* FAQs */}
      {sector.faqs && sector.faqs.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="max-w-2xl">
            <h2
              className="font-display font-bold text-ergo-950 mb-8"
              style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)" }}
            >
              {lang === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}
            </h2>
            <FAQAccordion faqs={sector.faqs} lang={lang} />
          </div>
        </section>
      )}

      {/* CTA Catalog + WhatsApp */}
      <section className="bg-ergo-950 py-14 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2
              className="font-display font-bold text-white mb-2"
              style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
            >
              {lang === "en" ? `Ready to furnish your ${title.toLowerCase()}?` : `¿Listo para equipar tu espacio de ${title.toLowerCase()}?`}
            </h2>
            <p className="text-ergo-300 text-[0.85rem]">
              {lang === "en" ? "Contact us for a free quote and space design." : "Contáctanos para una cotización gratuita y diseño del espacio."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {sector.catalogFile?.asset?.url && (
              <a
                href={sector.catalogFile.asset.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-ergo-sky text-ergo-sky font-semibold text-[0.83rem] px-5 py-3 hover:bg-ergo-sky hover:text-ergo-950 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {lang === "en" ? "Download catalog" : "Descargar catálogo"}
              </a>
            )}
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-ergo-sky text-ergo-950 font-semibold text-[0.83rem] px-5 py-3 hover:bg-ergo-sky/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {ctaText}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
