import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { ProductJsonLd } from "@modules/common/components/json-ld/product"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { HttpTypes } from "@medusajs/types"

const SITE_URL = "https://ergonomicadesk.com"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )
    if (!countryCodes) return []
    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })
      return { country, products: response.products }
    })
    const countryProducts = await Promise.all(promises)
    return countryProducts
      .flatMap((cd) => cd.products.map((p) => ({ countryCode: cd.country, handle: p.handle })))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(`Failed to generate static paths: ${error instanceof Error ? error.message : "Unknown"}`)
    return []
  }
}

function getImagesForVariant(product: HttpTypes.StoreProduct, selectedVariantId?: string) {
  if (!selectedVariantId || !product.variants) return product.images
  const variant = product.variants.find((v) => v.id === selectedVariantId)
  if (!variant?.images?.length) return product.images
  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)
  if (!region) notFound()

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) notFound()

  const canonicalUrl = `${SITE_URL}/${params.countryCode}/en/productos/${handle}`
  return {
    title: `${product.title} | Ergonómica`,
    description: product.description
      ? product.description.slice(0, 160)
      : `${product.title} — Buy at Ergonómica Panama. Free shipping in Panama City. Warranty included.`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: `${SITE_URL}/${params.countryCode}/productos/${handle}`,
        en: canonicalUrl,
        "x-default": `${SITE_URL}/${params.countryCode}/productos/${handle}`,
      },
    },
    openGraph: {
      title: `${product.title} | Ergonómica`,
      description: product.description?.slice(0, 160) || `${product.title} — Ergonómica Panama`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPageEN(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams
  const selectedVariantId = searchParams.v_id
  if (!region) notFound()

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) notFound()

  const images = getImagesForVariant(pricedProduct, selectedVariantId)
  const selectedVariant = selectedVariantId
    ? pricedProduct.variants?.find((v) => v.id === selectedVariantId)
    : undefined
  const firstVariant = pricedProduct.variants?.[0]
  const priceAmount = firstVariant?.calculated_price?.calculated_amount ?? firstVariant?.calculated_price?.original_amount ?? 0
  const canonicalUrl = `${SITE_URL}/${params.countryCode}/en/productos/${params.handle}`

  return (
    <>
      <ProductJsonLd
        name={pricedProduct.title ?? ""}
        description={pricedProduct.description ?? null}
        image={pricedProduct.thumbnail ?? null}
        sku={firstVariant?.sku ?? null}
        price={priceAmount}
        currency="USD"
        url={canonicalUrl}
        lang="en"
        inStock={(firstVariant?.inventory_quantity ?? 1) > 0}
        weight={(pricedProduct as any).metadata?.weight_kg ? Number((pricedProduct as any).metadata.weight_kg) : null}
        material={(pricedProduct as any).metadata?.material ?? null}
        mpn={firstVariant?.sku ?? null}
        specs={(() => {
          const m = (pricedProduct as any).metadata
          if (!m) return null
          const s: Record<string, string> = {}
          if (m.warranty) s["Warranty"] = m.warranty
          if (m.max_weight_capacity) s["Weight capacity"] = m.max_weight_capacity
          if (m.speed) s["Speed"] = m.speed
          if (m.memory_presets) s["Memory positions"] = m.memory_presets
          if (m.dimensions) s["Dimensions"] = m.dimensions
          if (m.motors) s["Motors"] = m.motors
          if (m.lumbar) s["Lumbar support"] = m.lumbar
          return Object.keys(s).length > 0 ? s : null
        })()}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `${SITE_URL}/${params.countryCode}/en` },
        { name: "Products", url: `${SITE_URL}/${params.countryCode}/en/store` },
        { name: pricedProduct.title ?? "", url: canonicalUrl },
      ]} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images ?? []}
        selectedVariant={selectedVariant}
      />
    </>
  )
}
