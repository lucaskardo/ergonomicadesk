import { Suspense } from "react"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { medusa } from "@/lib/medusa-client"

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  try {
    const { products } = await medusa.store.product.list({
      handle,
      region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID,
      fields: "title,description",
      limit: 1,
    })
    const product = products[0]
    if (!product) return { title: "Producto | Ergonómica Desk" }
    return {
      title: `${product.title} | Ergonómica Desk`,
      description: product.description ?? undefined,
    }
  } catch {
    return { title: "Producto | Ergonómica Desk" }
  }
}

type ProductListResponse = Awaited<ReturnType<typeof medusa.store.product.list>>
type Product = ProductListResponse["products"][0]
type Variant = NonNullable<Product["variants"]>[0]

function getVariantPrice(variant: Variant): number | null {
  const cp = variant.calculated_price
  return cp?.calculated_amount ?? null
}

async function Inner({ paramsPromise }: { paramsPromise: Promise<{ handle: string }> }) {
  await connection()
  const { handle } = await paramsPromise

  const { products } = await medusa.store.product.list({
    handle,
    region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID,
    fields: "*variants.calculated_price",
    limit: 1,
  })

  const product = products[0]
  if (!product) notFound()

  const variants = product.variants ?? []
  const firstVariant = variants[0]
  const priceCents = firstVariant ? getVariantPrice(firstVariant) : null
  const priceDisplay = priceCents != null ? `$${(priceCents / 100).toFixed(2)}` : null
  const thumbnail = product.images?.[0]?.url ?? product.thumbnail ?? null

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-800 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-stone-800 transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium line-clamp-1">{product.title}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={product.title ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" d="M3 9l4-4 4 4 4-4 4 4" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 leading-snug">
                {product.title}
              </h1>
              {product.description && (
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {priceDisplay != null ? (
                <>
                  <span className="text-2xl font-bold text-stone-900">
                    {priceDisplay}
                  </span>
                  <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500 font-medium">
                    +ITBMS 7%
                  </span>
                </>
              ) : (
                <span className="text-stone-400 text-sm">Precio no disponible</span>
              )}
            </div>

            {/* Variant selector */}
            {variants.length > 1 && (
              <div>
                <p className="text-sm font-medium text-stone-700 mb-2">Variante</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors first:border-stone-900 first:text-stone-900 first:font-medium"
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              type="button"
              className="w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-stone-700 transition-colors md:w-auto"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-xl bg-stone-100 animate-pulse" />
            <div className="flex flex-col gap-4">
              <div className="h-8 w-3/4 rounded bg-stone-100 animate-pulse" />
              <div className="h-4 w-full rounded bg-stone-100 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-stone-100 animate-pulse" />
              <div className="h-8 w-1/3 rounded bg-stone-100 animate-pulse" />
              <div className="h-12 w-full rounded-lg bg-stone-100 animate-pulse md:w-48" />
            </div>
          </div>
        </div>
      }
    >
      <Inner paramsPromise={params} />
    </Suspense>
  )
}
