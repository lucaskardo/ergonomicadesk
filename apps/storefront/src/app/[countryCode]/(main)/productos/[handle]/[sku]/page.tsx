import { redirect } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

type Props = {
  params: Promise<{ countryCode: string; handle: string; sku: string }>
}

export default async function ProductSkuPage({ params }: Props) {
  const { countryCode, handle, sku } = await params

  try {
    const region = await getRegion(countryCode)
    if (!region) redirect(`/${countryCode}/productos/${handle}`)

    const { response } = await listProducts({
      countryCode,
      queryParams: { handle },
    })
    const product = response.products[0]
    if (!product) redirect(`/${countryCode}/productos/${handle}`)

    const variant = product.variants?.find((v) => v.sku === sku)
    if (variant) {
      redirect(`/${countryCode}/productos/${handle}?v_id=${variant.id}`)
    }
  } catch {
    // fall through
  }

  redirect(`/${countryCode}/productos/${handle}`)
}
