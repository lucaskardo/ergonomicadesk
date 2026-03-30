import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { getLang } from "@lib/i18n"
import { buildMetadata } from "@lib/util/metadata"
import { commercialPath, SITE_URL } from "@lib/util/routes"
import { sanityFetch } from "@/sanity/lib/live"
import { COMMERCIAL_SECTOR_QUERY, COMMERCIAL_SECTORS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"

// ─── Hardcoded product types per space ───────────────────────────────────────

type ProductType = { name: { es: string; en: string }; desc: { es: string; en: string } }

const SPACE_PRODUCT_TYPES: Record<string, Record<string, ProductType[]>> = {
  oficinas: {
    workstations: [
      { name: { es: "Standing desks", en: "Standing desks" }, desc: { es: "Altura regulable eléctrica. De pie o sentado en segundos.", en: "Electric height-adjustable. Sit or stand in seconds." } },
      { name: { es: "Sillas ergonómicas", en: "Ergonomic chairs" }, desc: { es: "Soporte lumbar, apoyabrazos 4D y malla transpirable.", en: "Lumbar support, 4D armrests and breathable mesh." } },
      { name: { es: "Brazos de monitor", en: "Monitor arms" }, desc: { es: "Un o dos monitores, ajuste libre en todo eje.", en: "Single or dual, full-axis adjustability." } },
      { name: { es: "Cable management", en: "Cable management" }, desc: { es: "Canaletas, bandejas y clips para escritorio limpio.", en: "Trays, raceways and clips for a clean desk." } },
      { name: { es: "Almacenamiento", en: "Storage" }, desc: { es: "Pedestales, archiveros y lockers individuales.", en: "Pedestals, filing cabinets and personal lockers." } },
    ],
    "lounge-seating": [
      { name: { es: "Sofás modulares", en: "Modular sofas" }, desc: { es: "Configuraciones en L, rectas o islas. Tapizado contract-grade.", en: "L-shape, straight or island configs. Contract-grade upholstery." } },
      { name: { es: "Sillones individuales", en: "Accent chairs" }, desc: { es: "Asientos de acento para complementar o crear rincones.", en: "Accent seats to complement or create nooks." } },
      { name: { es: "Mesas de centro", en: "Coffee tables" }, desc: { es: "Melamina, madera natural o metal. Diferentes tamaños.", en: "Melamine, solid wood or metal. Multiple sizes." } },
      { name: { es: "Mesas laterales", en: "Side tables" }, desc: { es: "Junto al sofá para laptop, café o revista.", en: "Next to the sofa for laptop, coffee or magazine." } },
      { name: { es: "Pufs y ottomans", en: "Poufs and ottomans" }, desc: { es: "Asientos casuales y versátiles para brainstorming.", en: "Casual and versatile seating for brainstorming." } },
      { name: { es: "Accesorios", en: "Accessories" }, desc: { es: "Plantas, lámparas, revisteros. Los detalles que completan.", en: "Plants, lamps, magazine racks. The details that complete." } },
    ],
    reuniones: [
      { name: { es: "Mesas de conferencia", en: "Conference tables" }, desc: { es: "De 6 a 20 personas. Madera, vidrio o laminado.", en: "6 to 20 people. Wood, glass or laminate." } },
      { name: { es: "Sillas ejecutivas", en: "Executive chairs" }, desc: { es: "Cuero o tela contract-grade. Ruedas con freno.", en: "Leather or contract-grade fabric. Brake casters." } },
      { name: { es: "Almacenamiento lateral", en: "Lateral storage" }, desc: { es: "Credenzas y buffets para documentos y tecnología.", en: "Credenzas and buffets for documents and tech." } },
      { name: { es: "Tecnología AV", en: "AV technology" }, desc: { es: "Bases de alimentación, pantallas y soporte para video.", en: "Power bases, screens and video conferencing support." } },
    ],
  },
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SpaceImage = { asset?: { _id: string; url: string }; alt?: string; hotspot?: unknown; crop?: unknown }

type SectorData = {
  _id: string
  slug: string
  title: { es?: string; en?: string }
  spaces?: Array<{
    _key: string
    name: { es?: string; en?: string }
    slug?: string
    description?: { es?: string; en?: string }
    image?: SpaceImage
    gallery?: Array<{ _key: string; asset?: { _id: string; url: string }; alt?: string }>
  }>
  gallery?: Array<{ _key: string; asset?: { _id: string; url: string }; alt?: string }>
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const result = await sanityFetch({ query: COMMERCIAL_SECTORS_QUERY })
    const sectors = result?.data as Array<{ slug: string }> | null
    if (!sectors) return []
    const params: Array<{ slug: string; space: string }> = []
    for (const sector of sectors) {
      const sectorResult = await sanityFetch({ query: COMMERCIAL_SECTOR_QUERY, params: { slug: sector.slug } })
      const sectorData = sectorResult?.data as SectorData | null
      if (sectorData?.spaces) {
        for (const sp of sectorData.spaces) {
          if (sp.slug) params.push({ slug: sector.slug, space: sp.slug })
        }
      }
      // Also include hardcoded space slugs
      const hardcodedSpaces = Object.keys(SPACE_PRODUCT_TYPES[sector.slug] ?? {})
      for (const spaceSlug of hardcodedSpaces) {
        if (!params.some((p) => p.slug === sector.slug && p.space === spaceSlug)) {
          params.push({ slug: sector.slug, space: spaceSlug })
        }
      }
    }
    return params
  } catch {
    const fallback: Array<{ slug: string; space: string }> = []
    for (const [sector, spaces] of Object.entries(SPACE_PRODUCT_TYPES)) {
      for (const space of Object.keys(spaces)) {
        fallback.push({ slug: sector, space })
      }
    }
    return fallback
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  props: { params: Promise<{ countryCode: string; slug: string; space: string }> }
): Promise<Metadata> {
  const { countryCode, slug, space } = await props.params
  const lang = await getLang()

  const result = await sanityFetch({ query: COMMERCIAL_SECTOR_QUERY, params: { slug } }).catch(() => ({ data: null }))
  const sector = result?.data as SectorData | null
  const spaceData = sector?.spaces?.find((s) => s.slug === space)

  const sectorTitle = sector
    ? (lang === "en" ? (sector.title.en ?? sector.title.es ?? "") : (sector.title.es ?? ""))
    : slug
  const spaceName = spaceData
    ? (lang === "en" ? (spaceData.name.en ?? spaceData.name.es ?? "") : (spaceData.name.es ?? ""))
    : space.replace(/-/g, " ")

  return buildMetadata({
    title: lang === "en"
      ? `${spaceName} for ${sectorTitle} | Ergonómica`
      : `${spaceName} para ${sectorTitle} | Ergonómica`,
    description: lang === "en"
      ? `Furniture and equipment for ${spaceName} in ${sectorTitle} spaces in Panama.`
      : `Mobiliario y equipamiento para ${spaceName} en espacios de ${sectorTitle} en Panamá.`,
    countryCode,
    lang,
    path: commercialPath(slug, space),
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CommercialSpacePage(
  props: { params: Promise<{ countryCode: string; slug: string; space: string }> }
) {
  const { countryCode, slug, space } = await props.params
  const lang = await getLang()

  const result = await sanityFetch({ query: COMMERCIAL_SECTOR_QUERY, params: { slug } }).catch(() => ({ data: null }))
  const sector = result?.data as SectorData | null

  if (!sector) notFound()

  const sectorTitle = lang === "en" ? (sector.title.en ?? sector.title.es ?? "") : (sector.title.es ?? "")
  const spaceData = sector.spaces?.find((s) => s.slug === space)
  const spaceName = spaceData
    ? (lang === "en" ? (spaceData.name.en ?? spaceData.name.es ?? "") : (spaceData.name.es ?? ""))
    : space.replace(/-/g, " ")
  const spaceDesc = spaceData
    ? (lang === "en" ? (spaceData.description?.en ?? spaceData.description?.es ?? "") : (spaceData.description?.es ?? ""))
    : ""

  const heroImageUrl = spaceData?.image?.asset
    ? urlFor(spaceData.image).width(1440).height(600).fit("crop").url()
    : undefined

  // Gallery: space gallery → sector gallery → none
  const galleryItems = (spaceData?.gallery && spaceData.gallery.length > 0)
    ? spaceData.gallery
    : (sector.gallery && sector.gallery.length > 0)
    ? sector.gallery
    : []

  const productTypes = SPACE_PRODUCT_TYPES[slug]?.[space] ?? []

  const WA_URL = "https://wa.me/50769533776?text=" + encodeURIComponent(
    lang === "en"
      ? `Hello, I need help designing a ${spaceName} space for ${sectorTitle}.`
      : `Hola, necesito ayuda diseñando un espacio de ${spaceName} para ${sectorTitle}.`
  )

  const breadcrumbs = [
    { name: lang === "en" ? "Home" : "Inicio", url: `${SITE_URL}/pa` },
    { name: lang === "en" ? "Commercial" : "Comercial", url: `${SITE_URL}/pa/comercial` },
    { name: sectorTitle, url: `${SITE_URL}/pa${commercialPath(slug)}` },
    { name: spaceName, url: `${SITE_URL}/pa${commercialPath(slug, space)}` },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero */}
      <section className="relative bg-ergo-950 overflow-hidden" style={{ minHeight: 480 }}>
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={spaceData?.image?.alt ?? spaceName}
            fill
            className="object-cover opacity-40"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ergo-900 to-ergo-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ergo-950/80 via-ergo-950/40 to-transparent" />
        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-20 flex flex-col justify-end h-full" style={{ minHeight: 480 }}>
          <LocalizedClientLink
            href={commercialPath(slug)}
            className="inline-flex items-center gap-1.5 text-[0.72rem] text-ergo-sky hover:text-ergo-sky/80 transition-colors mb-5 uppercase tracking-[0.1em] font-semibold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            ← {sectorTitle}
          </LocalizedClientLink>
          <h1
            className="font-display font-bold text-white tracking-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            {spaceName}
          </h1>
          {spaceDesc && (
            <p className="text-ergo-300 text-[0.95rem] max-w-xl leading-relaxed">{spaceDesc}</p>
          )}
        </div>
      </section>

      {/* Visual breadcrumb */}
      <nav className="bg-white border-b border-ergo-100 px-4 sm:px-6 lg:px-10 py-3">
        <div className="max-w-[1360px] mx-auto flex items-center gap-2 text-[0.75rem] text-ergo-400 flex-wrap">
          <LocalizedClientLink href="/" className="hover:text-ergo-sky transition-colors">
            {lang === "en" ? "Home" : "Inicio"}
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href={commercialPath()} className="hover:text-ergo-sky transition-colors">
            {lang === "en" ? "Commercial" : "Comercial"}
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href={commercialPath(slug)} className="hover:text-ergo-sky transition-colors">
            {sectorTitle}
          </LocalizedClientLink>
          <span>/</span>
          <span className="text-ergo-950 font-medium">{spaceName}</span>
        </div>
      </nav>

      {/* Gallery — asymmetric grid */}
      {galleryItems.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
          <div className="grid grid-cols-3 grid-rows-2 gap-3" style={{ height: 420 }}>
            {galleryItems[0]?.asset?.url && (
              <div className="col-span-1 row-span-2 relative overflow-hidden bg-ergo-100">
                <Image
                  src={urlFor(galleryItems[0]).width(480).height(840).fit("crop").url()}
                  alt={galleryItems[0].alt ?? spaceName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {galleryItems.slice(1, 5).map((img, i) => (
              img.asset?.url ? (
                <div key={img._key ?? i} className="relative overflow-hidden bg-ergo-100">
                  <Image
                    src={urlFor(img).width(480).height(360).fit("crop").url()}
                    alt={img.alt ?? spaceName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      {spaceDesc && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="max-w-3xl">
            <p className="text-ergo-600 text-[0.92rem] leading-[1.85]">{spaceDesc}</p>
          </div>
        </section>
      )}

      {/* Tipos de producto */}
      <section className="bg-ergo-50 py-14 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <h2
            className="font-display font-bold text-ergo-950 tracking-tight mb-10"
            style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
          >
            {lang === "en" ? "Product types" : "Tipos de producto"}
          </h2>
          {productTypes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productTypes.map((pt) => (
                <div key={pt.name.es} className="bg-white border border-ergo-100 overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-ergo-100 to-ergo-200" />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-ergo-950 text-[0.95rem] mb-2">
                      {lang === "en" ? pt.name.en : pt.name.es}
                    </h3>
                    <p className="text-ergo-400 text-[0.8rem] leading-relaxed flex-1">
                      {lang === "en" ? pt.desc.en : pt.desc.es}
                    </p>
                    <span className="mt-4 text-[0.72rem] font-semibold text-ergo-sky/60 uppercase tracking-[0.08em] cursor-not-allowed">
                      {lang === "en" ? "View products →" : "Ver productos →"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-ergo-100 p-10 text-center">
              <p className="text-ergo-500 text-[0.9rem] mb-6">
                {lang === "en"
                  ? "Contact us to learn about the options available for this space."
                  : "Contáctanos para conocer las opciones disponibles para este espacio."}
              </p>
              <a
                href={WA_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-ergo-sky text-ergo-950 font-semibold text-[0.85rem] px-6 py-3 hover:bg-ergo-sky/90 transition-colors"
              >
                WhatsApp →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Inspiración */}
      {galleryItems.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
          <h2
            className="font-display font-bold text-ergo-950 mb-8"
            style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)" }}
          >
            {lang === "en" ? "Inspiration" : "Inspiración"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryItems.slice(0, 4).map((img, i) => (
              img.asset?.url ? (
                <div key={img._key ?? i} className="relative aspect-[4/3] overflow-hidden bg-ergo-50">
                  <Image
                    src={urlFor(img).width(480).height(360).fit("crop").url()}
                    alt={img.alt ?? spaceName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ergo-950 py-16 px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
          >
            {lang === "en"
              ? `Need help designing your ${spaceName}?`
              : `¿Necesitas ayuda diseñando tu ${spaceName}?`}
          </h2>
          <p className="text-ergo-300 text-[0.88rem] mb-8">
            {lang === "en" ? "Free consultation. No commitment." : "Consulta gratuita. Sin compromiso."}
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
            WhatsApp →
          </a>
        </div>
      </section>
    </>
  )
}
