import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import ProductTemplate from "@modules/products/templates"
import { ProductJsonLd } from "@modules/common/components/json-ld/product"

type Props = {
  params: Promise<{ countryCode: string; handle: string; sku: string }>
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  variantId?: string
) {
  if (!variantId || !product.variants) return product.images
  const variant = product.variants.find((v) => v.id === variantId)
  if (!variant || !variant.images || !variant.images.length) return product.images
  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle, sku, countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) return notFound()

  const product = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) return notFound()

  const variant = product.variants?.find((v: any) => v.sku === sku)
  if (!variant) return notFound()

  const optionValues = variant.options?.map((o: any) => o.value).join(" - ") || sku
  const title = `${product.title} ${optionValues} | Ergonómica`
  const description = product.description || `${product.title} ${optionValues} — Ergonómica.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://ergonomicadesk.com/${countryCode}/productos/${handle}/${sku}`,
      languages: {
        es: `https://ergonomicadesk.com/${countryCode}/productos/${handle}/${sku}`,
        en: `https://ergonomicadesk.com/${countryCode}/en/products/${handle}/${sku}`,
        "x-default": `https://ergonomicadesk.com/${countryCode}/productos/${handle}/${sku}`,
      },
    },
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function VariantPage(props: Props) {
  const { handle, sku, countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) return notFound()

  const pricedProduct = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) return notFound()

  const variant = pricedProduct.variants?.find((v: any) => v.sku === sku)
  if (!variant) return notFound()

  const images = getImagesForVariant(pricedProduct, variant.id)

  const priceAmount =
    variant.calculated_price?.calculated_amount ??
    variant.calculated_price?.original_amount ??
    0

  return (
    <>
      <ProductJsonLd
        name={pricedProduct.title ?? ""}
        description={pricedProduct.description ?? null}
        image={pricedProduct.thumbnail ?? null}
        sku={variant.sku ?? null}
        price={priceAmount}
        currency="USD"
        url={`https://ergonomicadesk.com/${countryCode}/productos/${handle}/${sku}`}
        lang="es"
        inStock={(variant.inventory_quantity ?? 1) > 0}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={countryCode}
        images={images ?? []}
        initialVariantId={variant.id}
      />
    </>
  )
}
