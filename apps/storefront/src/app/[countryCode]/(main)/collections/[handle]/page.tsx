import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { collectionCanonical, alternateUrls, collectionPath, SITE_URL } from "@lib/util/routes"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const path = collectionPath(params.handle)
  const description =
    (collection as any).metadata?.description ||
    `Colección ${collection.title} — escritorios, sillas y accesorios ergonómicos en Ergonómica Panamá.`

  const metadata: Metadata = {
    title: `${collection.title} | Ergonómica`,
    description,
    alternates: {
      canonical: collectionCanonical(params.countryCode, "es", params.handle),
      languages: alternateUrls(params.countryCode, path),
    },
    openGraph: {
      title: `${collection.title} | Ergonómica`,
      description,
    },
  }

  return metadata
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `${SITE_URL}/${params.countryCode}` },
        { name: collection.title, url: collectionCanonical(params.countryCode, "es", params.handle) },
      ]} />
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </>
  )
}
