import { listProducts } from "@lib/data/products"
import { withTimeout } from "@lib/util/fetch-safe"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { productPath } from "@lib/util/routes"
import TrackViewList from "@modules/store/components/track-view-list"
import TrackProductClick from "@modules/products/components/product-preview/track-click"

const CURATED_HANDLES = [
  "frame-double-bl",
  "chair-xtcv2-mesh-sl-bl-gr",
  "desk-exec-core-black-coral-180x60",
  "sobre-melamina",
  "cabinet-3drawer-slim-bl",
  "stand-arm-single-bl",
]

const CONTENT = {
  es: {
    heading: "Los Más",
    headingAccent: "Vendidos",
    subtitle: "Productos favoritos de nuestros clientes",
    viewAll: "Ver todos los productos",
    from: "Desde",
    badge: "Más vendido",
  },
  en: {
    heading: "Best",
    headingAccent: "Sellers",
    subtitle: "Customer favorites",
    viewAll: "View all products",
    from: "From",
    badge: "Best seller",
  },
}

function ProductCard({
  product,
  lang,
  index,
}: {
  product: HttpTypes.StoreProduct
  lang: "es" | "en"
  index: number
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const c = CONTENT[lang]

  const firstSku = product.variants?.[0]?.sku
  // productPath() returns /productos/[handle] — LocalizedClientLink prepends /pa or /pa/en
  const productHref = productPath(product.handle || "", firstSku ?? undefined)

  return (
    <LocalizedClientLink
      href={productHref}
      className="group bg-white border border-ergo-200/60 overflow-hidden transition-all duration-300 cursor-pointer hover:border-transparent hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-ergo-bg-warm overflow-hidden">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
        />
        {/* Badge */}
        {index < 2 && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.04em] bg-ergo-950 text-white">
            {c.badge}
          </span>
        )}
        {/* Heart icon on hover */}
        <button className="absolute top-2.5 right-2.5 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300" aria-label="Save">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ergo-400">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      {/* Body */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.07em] text-ergo-sky-dark">
          {product.categories?.[0]?.name ?? ""}
        </p>
        <p className="text-[0.88rem] font-semibold mt-0.5 leading-[1.3] text-ergo-950 line-clamp-2">
          {product.title}
        </p>
        {product.description && (
          <p className="text-[0.75rem] text-ergo-400 mt-0.5 line-clamp-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          {cheapestPrice && (
            <span className="text-[1.05rem] font-bold text-ergo-950">
              {c.from} {cheapestPrice.calculated_price}
            </span>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default async function FeaturedProductsHome({
  region,
  lang,
}: {
  region: HttpTypes.StoreRegion
  lang: string
}) {
  let products: HttpTypes.StoreProduct[] = []

  const curatedResult = await withTimeout(
    listProducts({
      regionId: region.id,
      queryParams: {
        handle: CURATED_HANDLES,
        limit: 8,
        fields: "*variants.calculated_price,*categories",
      },
    }),
    { fallback: { response: { products: [], count: 0 }, nextPage: null }, label: "featuredProducts-curated" }
  )
  products = curatedResult.response.products

  if (!products.length) {
    const fallbackResult = await withTimeout(
      listProducts({
        regionId: region.id,
        queryParams: {
          limit: 8,
          fields: "*variants.calculated_price,*categories",
          order: "-created_at",
        },
      }),
      { fallback: { response: { products: [], count: 0 }, nextPage: null }, label: "featuredProducts-fallback" }
    )
    products = fallbackResult.response.products
  }

  if (!products.length) return null

  const typedLang = (lang === "en" ? "en" : "es") as "es" | "en"
  const c = CONTENT[typedLang]

  return (
    <section className="bg-ergo-bg py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-9">
          <div>
            <h2
              className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              {c.heading}{" "}
              <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
            </h2>
            <p className="text-[0.88rem] text-ergo-400 mt-1.5">{c.subtitle}</p>
          </div>
          <LocalizedClientLink
            href="/store"
            className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-ergo-sky-dark hover:gap-3 transition-all duration-300 flex-shrink-0"
          >
            {c.viewAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </LocalizedClientLink>
        </div>

        {/* 4-column grid, 3px gaps */}
        <TrackViewList
          products={products.slice(0, 8).map((p) => ({
            id: p.id!,
            title: p.title!,
            variants: p.variants?.map((v) => ({ sku: v.sku ?? undefined, id: v.id })),
          }))}
          listName="featured_products"
        />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "3px" }}
        >
          {products.slice(0, 8).map((product, i) => (
            <TrackProductClick
              key={product.id}
              product={{
                id: product.id!,
                title: product.title!,
                variants: product.variants?.map((v) => ({ sku: v.sku ?? undefined, id: v.id })),
              }}
              listName="featured_products"
              index={i}
            >
              <ProductCard
                product={product}
                lang={typedLang}
                index={i}
              />
            </TrackProductClick>
          ))}
        </div>
      </div>
    </section>
  )
}
