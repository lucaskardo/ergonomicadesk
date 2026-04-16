import { redirect } from "next/navigation"
import { getLang } from "@lib/i18n"

type Props = {
  params: Promise<{ countryCode: string; handle: string; sku: string }>
}

export default async function ProductSkuRedirect({ params }: Props) {
  const { countryCode, handle, sku } = await params
  const lang = await getLang()
  const langPrefix = lang === "en" ? "/en" : ""
  redirect(`/${countryCode}${langPrefix}/productos/${handle}/${sku}`)
}
