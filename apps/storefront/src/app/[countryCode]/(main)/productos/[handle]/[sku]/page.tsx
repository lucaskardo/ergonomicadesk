import { redirect } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getLang } from "@lib/i18n"

type Props = {
  params: Promise<{ countryCode: string; handle: string; sku: string }>
}

export default async function ProductSkuPage({ params }: Props) {
  const { countryCode, handle, sku } = await params
  const lang = await getLang()
  const langPrefix = lang === "en" ? "/en" : ""
  const productUrl = `/${countryCode}${langPrefix}/productos/${handle}`

  try {
    const region = await getRegion(countryCode)
    if (!region) redirect(productUrl)

    const { response } = await listProducts({
      countryCode,
      queryParams: { handle },
    })
    const product = response.products[0]
    if (!product) redirect(productUrl)

    const variant = product.variants?.find((v) => v.sku === sku)
    if (variant) {
      redirect(`${productUrl}?v_id=${variant.id}`)
    }
  } catch {
    // fall through
  }

  redirect(productUrl)
}
