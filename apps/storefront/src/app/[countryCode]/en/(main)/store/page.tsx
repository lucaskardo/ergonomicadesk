import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { SITE_URL } from "@lib/util/routes"

type Params = {
  searchParams: Promise<{ sortBy?: SortOptions; page?: string }>
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { countryCode } = await props.params
  const baseUrl = `${SITE_URL}/${countryCode}`
  return {
    title: "Store | Ergonómica",
    description: "Explore our full selection of standing desks, ergonomic chairs, and home office accessories.",
    alternates: {
      canonical: `${baseUrl}/en/store`,
      languages: {
        es: `${baseUrl}/store`,
        en: `${baseUrl}/en/store`,
        "x-default": `${baseUrl}/store`,
      },
    },
  }
}

export default async function StoreEnPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
