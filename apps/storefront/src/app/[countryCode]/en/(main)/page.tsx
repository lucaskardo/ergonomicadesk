import { Metadata } from "next"
import Homepage from "@modules/home/templates/homepage"

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
  const { countryCode } = await props.params
  return <Homepage countryCode={countryCode} lang="en" />
}
