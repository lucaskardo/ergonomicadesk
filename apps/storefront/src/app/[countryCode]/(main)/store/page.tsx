import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { SITE_URL } from "@lib/util/routes"

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
  const baseUrl = `${SITE_URL}/${countryCode}`
  return {
    title: "Tienda | Ergonómica",
    description:
      "Explora nuestra selección de escritorios standing, sillas ergonómicas y accesorios para tu home office.",
    alternates: {
      canonical: `${baseUrl}/store`,
      languages: {
        es: `${baseUrl}/store`,
        en: `${baseUrl}/en/store`,
        "x-default": `${baseUrl}/store`,
      },
    },
  }
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
