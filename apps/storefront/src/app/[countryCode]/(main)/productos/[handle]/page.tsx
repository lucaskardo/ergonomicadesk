import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { ProductJsonLd } from "@modules/common/components/json-ld/product"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { productCanonical, categoryCanonical, alternateUrls, productPath, SITE_URL } from "@lib/util/routes"
import { getLang } from "@lib/i18n"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const lang = await getLang()
  const isEn = lang === "en"
  const canonical = productCanonical(params.countryCode, lang, handle)
  const fallbackDescription = isEn
    ? `${product.title} — Buy at Ergonómica Panama. Free shipping in Panama City. Warranty included.`
    : `${product.title} — Compra en Ergonómica Panamá. Envío gratis en Ciudad de Panamá. Garantía incluida.`
  const description = product.description
    ? product.description.slice(0, 160)
    : fallbackDescription
  const title = `${product.title} | Ergonómica Panamá`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternateUrls(params.countryCode, productPath(handle)),
    },
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  const selectedVariant = selectedVariantId
    ? pricedProduct.variants?.find((v) => v.id === selectedVariantId)
    : undefined

  const firstVariant = pricedProduct.variants?.[0]
  const priceAmount =
    firstVariant?.calculated_price?.calculated_amount ??
    firstVariant?.calculated_price?.original_amount ??
    0

  const lang = await getLang()
  const isEn = lang === "en"
  const langPrefix = isEn ? "/en" : ""
  const canonicalUrl = productCanonical(params.countryCode, lang, params.handle)
  const specLabels = isEn
    ? {
        warranty: "Warranty",
        max_weight_capacity: "Weight capacity",
        speed: "Speed",
        memory_presets: "Memory presets",
        dimensions: "Dimensions",
        motors: "Motors",
        lumbar: "Lumbar support",
      }
    : {
        warranty: "Garantía",
        max_weight_capacity: "Capacidad de peso",
        speed: "Velocidad",
        memory_presets: "Posiciones de memoria",
        dimensions: "Dimensiones",
        motors: "Motores",
        lumbar: "Soporte lumbar",
      }
  const homeLabel = isEn ? "Home" : "Inicio"
  const storeLabel = isEn ? "Store" : "Tienda"

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
        lang={lang}
        inStock={(firstVariant?.inventory_quantity ?? 1) > 0}
        weight={(pricedProduct as any).metadata?.weight_kg ? Number((pricedProduct as any).metadata.weight_kg) : null}
        material={(pricedProduct as any).metadata?.material ?? null}
        mpn={firstVariant?.sku ?? null}
        specs={(() => {
          const m = (pricedProduct as any).metadata
          if (!m) return null
          const s: Record<string, string> = {}
          if (m.warranty) s[specLabels.warranty] = m.warranty
          if (m.max_weight_capacity) s[specLabels.max_weight_capacity] = m.max_weight_capacity
          if (m.speed) s[specLabels.speed] = m.speed
          if (m.memory_presets) s[specLabels.memory_presets] = m.memory_presets
          if (m.dimensions) s[specLabels.dimensions] = m.dimensions
          if (m.motors) s[specLabels.motors] = m.motors
          if (m.lumbar) s[specLabels.lumbar] = m.lumbar
          return Object.keys(s).length > 0 ? s : null
        })()}
      />
      <BreadcrumbJsonLd items={[
        { name: homeLabel, url: `${SITE_URL}/${params.countryCode}${langPrefix}` },
        ...(pricedProduct.categories?.[0]
          ? [{ name: pricedProduct.categories[0].name ?? "", url: categoryCanonical(params.countryCode, lang, pricedProduct.categories[0].handle ?? "") }]
          : [{ name: storeLabel, url: `${SITE_URL}/${params.countryCode}${langPrefix}/store` }]),
        { name: pricedProduct.title ?? "", url: canonicalUrl },
      ]} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images ?? []}
        selectedVariant={selectedVariant}
        lang={lang}
      />
    </>
  )
}
