import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

const CURATED_HANDLES = [
  "frame-double-bl",
  "chair-xtcv2-mesh-sl-bl-gr",
  "desk-exec-core-black-coral-180x60",
  "sobre-melamina",
  "cabinet-3drawer-slim-bl",
  "stand-arm-single-bl",
]

function ProductCard({
  product,
  lang,
}: {
  product: HttpTypes.StoreProduct
  lang: string
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const fromLabel = lang === "en" ? "From" : "Desde"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
        />
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2 leading-snug">
          {product.title}
        </p>
        {cheapestPrice && (
          <p className="mt-1 text-teal-600 font-semibold text-base">
            {fromLabel} {cheapestPrice.calculated_price}
          </p>
        )}
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
  // Try fetching curated products by handle, fall back to latest 6
  let products: HttpTypes.StoreProduct[] = []

  try {
    const result = await listProducts({
      regionId: region.id,
      queryParams: {
        handle: CURATED_HANDLES,
        limit: 6,
        fields: "*variants.calculated_price",
      },
    })
    products = result.response.products
  } catch {
    // fallback
  }

  if (!products.length) {
    const result = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 6,
        fields: "*variants.calculated_price",
        order: "-created_at",
      },
    })
    products = result.response.products
  }

  if (!products.length) return null

  const title = lang === "en" ? "Bestsellers" : "Los Más Vendidos"
  const subtitle =
    lang === "en" ? "Customer favorites" : "Productos favoritos de nuestros clientes"
  const viewAll = lang === "en" ? "View all products →" : "Ver todos los productos →"

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-500">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <LocalizedClientLink
            href="/store"
            className="text-teal-600 hover:underline font-medium"
          >
            {viewAll}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
