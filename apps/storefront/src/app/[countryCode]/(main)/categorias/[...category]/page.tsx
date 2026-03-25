import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name + " | Ergonómica"

    const description = productCategory.description ?? `${productCategory.name} — Ergonómica.`

    const baseUrl = `https://ergonomicadesk.com/${params.countryCode}`
    const categoryPath = params.category.join("/")

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/categorias/${categoryPath}`,
        languages: {
          es: `${baseUrl}/categorias/${categoryPath}`,
          en: `${baseUrl}/en/categorias/${categoryPath}`,
          "x-default": `${baseUrl}/categorias/${categoryPath}`,
        },
      },
      openGraph: {
        title,
        description,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, q } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const categoryPath = params.category.join("/")

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://ergonomicadesk.com/${params.countryCode}` },
        { name: productCategory.name, url: `https://ergonomicadesk.com/${params.countryCode}/categorias/${categoryPath}` },
      ]} />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        q={q}
      />
    </>
  )
}
