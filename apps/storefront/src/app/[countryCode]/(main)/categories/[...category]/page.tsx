import { redirect } from "next/navigation"
import { getLang } from "@lib/i18n"

type Props = {
  params: Promise<{ countryCode: string; category: string[] }>
}

export default async function CategoryRedirect({ params }: Props) {
  const { countryCode, category } = await params
  const lang = await getLang()
  const langPrefix = lang === "en" ? "/en" : ""
  redirect(`/${countryCode}${langPrefix}/categorias/${category.join("/")}`)
}
