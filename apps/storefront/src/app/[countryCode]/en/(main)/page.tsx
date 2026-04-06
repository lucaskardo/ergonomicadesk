import Homepage from "@modules/home/templates/homepage"
import { SITE_URL } from "@lib/util/routes"
import { buildMetadata } from "@lib/util/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  return buildMetadata({
    title: "Your home office, elevated | Ergonomic Furniture Panama",
    description:
      "Standing desks, ergonomic chairs, and office accessories in Panama. Free delivery in Panama City. 1-5 year warranty.",
    countryCode,
    lang: "en",
    path: "/",
    image: `${SITE_URL}/images/hero-homepage.png`,
  })
}

export default async function HomeEn(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  return <Homepage countryCode={countryCode} lang="en" />
}
