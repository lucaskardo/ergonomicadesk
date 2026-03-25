import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; handle: string; sku: string }>
}

export default async function ProductSkuRedirect({ params }: Props) {
  const { countryCode, handle, sku } = await params
  redirect(`/${countryCode}/productos/${handle}/${sku}`)
}
