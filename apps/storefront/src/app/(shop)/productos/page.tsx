import { Metadata } from "next"
import { medusa } from "@/lib/medusa-client"
import ProductCard from "@/components/product-card"

export const metadata: Metadata = {
  title: "Catálogo | Ergonómica Desk",
  description:
    "Catálogo de muebles y accesorios ergonómicos para tu oficina en Panamá.",
}

type ProductListResponse = Awaited<
  ReturnType<typeof medusa.store.product.list>
>
type Product = ProductListResponse["products"][0]

function getUsdPrice(product: Product): number | null {
  const variants = product.variants ?? []
  for (const variant of variants) {
    const cp = variant.calculated_price
    if (cp?.calculated_amount != null) {
      return cp.calculated_amount
    }
  }
  return null
}

export default async function ProductosPage() {
  let products: Product[] = []

  try {
    const response = await medusa.store.product.list(
      {
        limit: 20,
        // country_code provides pricing context for calculated_price
        country_code: "pa",
        fields: "+variants.calculated_price",
      },
      { next: { tags: ["products"] } }
    )
    products = response.products
  } catch {
    // Backend unavailable — render empty state
  }

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">
          Catálogo
        </h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-stone-500 text-sm">No hay productos todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                handle={product.handle}
                title={product.title}
                thumbnail={product.thumbnail}
                priceCents={getUsdPrice(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
