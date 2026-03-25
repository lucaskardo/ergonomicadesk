import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; handle: string; sku: string }>
}

export default async function ProductSkuRedirectEN({ params }: Props) {
  const { countryCode, handle, sku } = await params
  redirect(`/${countryCode}/en/productos/${handle}/${sku}`)
}
