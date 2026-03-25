import { Metadata } from "next"
import { getLang } from "@lib/i18n"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { categoryPath, SITE_URL } from "@lib/util/routes"
import Image from "next/image"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const lang = await getLang()
  const baseUrl = `${SITE_URL}/${countryCode}`
  const isEn = lang === "en"

  return {
    title: isEn
      ? "Catalog | Ergonómica — Ergonomic Furniture Panama"
      : "Catálogo | Ergonómica — Muebles Ergonómicos Panamá",
    description: isEn
      ? "Browse our full catalog of ergonomic furniture: standing desks, ergonomic chairs, accessories, and more."
      : "Explora nuestro catálogo completo de muebles ergonómicos: standing desks, sillas ergonómicas, accesorios y más.",
    alternates: {
      canonical: `${baseUrl}/catalog`,
      languages: {
        es: `${baseUrl}/catalog`,
        en: `${baseUrl}/en/catalog`,
        "x-default": `${baseUrl}/catalog`,
      },
    },
  }
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const lang = await getLang()
  const isEn = lang === "en"

  const categories = await listCategories().catch(() => [])
  const topLevel = categories.filter((c) => !c.parent_category_id)

  const t = {
    title: isEn ? "Product Catalog" : "Catálogo de Productos",
    subtitle: isEn
      ? "Explore our full range of ergonomic furniture for your home office"
      : "Explora toda nuestra línea de muebles ergonómicos para tu home office",
    products: isEn ? "products" : "productos",
    breadcrumbHome: isEn ? "Home" : "Inicio",
    breadcrumbCatalog: isEn ? "Catalog" : "Catálogo",
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ui-fg-subtle" aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
                {t.breadcrumbHome}
              </LocalizedClientLink>
            </li>
            <li className="text-ui-fg-muted">/</li>
            <li className="text-ui-fg-base">{t.breadcrumbCatalog}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            {t.title}
          </h1>
          <p className="text-ui-fg-subtle text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {topLevel.map((category) => {
            const thumbnail = (category.products as any[])?.[0]?.thumbnail
            const productCount = (category.products as any[])?.length ?? 0

            return (
              <LocalizedClientLink
                key={category.id}
                href={categoryPath(category.handle)}
                className="group relative block overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] shadow-sm hover:shadow-md transition-shadow"
              >
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white font-semibold text-base sm:text-lg leading-tight">
                    {category.name}
                  </h2>
                  {productCount > 0 && (
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                      {productCount} {t.products}
                    </p>
                  )}
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
