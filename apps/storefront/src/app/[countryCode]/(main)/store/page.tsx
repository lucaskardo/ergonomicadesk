import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getLang } from "@lib/i18n"
import { buildMetadata } from "@lib/util/metadata"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category_id?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { countryCode } = await props.params
  const lang = await getLang()
  const isEn = lang === "en"
  return buildMetadata({
    title: isEn ? "Store" : "Tienda",
    description: isEn
      ? "Explore our selection of standing desks, ergonomic chairs and accessories for your home office."
      : "Explora nuestra selección de escritorios standing, sillas ergonómicas y accesorios para tu home office.",
    countryCode,
    lang,
    path: "/store",
  })
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, category_id, q } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      categoryId={category_id}
      q={q}
    />
  )
}
