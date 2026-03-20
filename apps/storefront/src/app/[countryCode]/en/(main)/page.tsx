import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const baseUrl = `https://ergonomicadesk.com/${countryCode}`
  return {
    title: "Ergonómica — Your home office, elevated | Ergonomic Furniture Panama",
    description:
      "Standing desks, ergonomic chairs, and office accessories in Panama. Free delivery in Panama City. 1-5 year warranty.",
    alternates: {
      canonical: `${baseUrl}/en/`,
      languages: {
        es: `${baseUrl}/`,
        en: `${baseUrl}/en/`,
        "x-default": `${baseUrl}/`,
      },
    },
  }
}

export default async function HomeEn(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title" })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
