import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import CategoryGrid from "@modules/home/components/category-grid"
import BuildYourDesk from "@modules/home/components/build-your-desk"
import FeaturedProductsHome from "@modules/home/components/featured-products-home"
import B2BBanner from "@modules/home/components/b2b-banner"
import SocialProof from "@modules/home/components/social-proof"
import { getRegion } from "@lib/data/regions"
import { getLang } from "@lib/i18n"
import { OrganizationJsonLd } from "@modules/common/components/json-ld/organization"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const baseUrl = `https://ergonomicadesk.com/${countryCode}`
  return {
    title: "Ergonómica — Home office a otro nivel | Muebles ergonómicos Panamá",
    description:
      "Escritorios standing, sillas ergonómicas y accesorios de oficina en Panamá. Envío gratis en Ciudad de Panamá. Garantía de 1-5 años.",
    alternates: {
      canonical: `${baseUrl}/`,
      languages: {
        es: `${baseUrl}/`,
        en: `${baseUrl}/en/`,
        "x-default": `${baseUrl}/`,
      },
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const [region, lang] = await Promise.all([getRegion(countryCode), getLang()])

  return (
    <>
      <OrganizationJsonLd lang={lang} />
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <BuildYourDesk />
      {region && <FeaturedProductsHome region={region} lang={lang} />}
      <B2BBanner />
      <SocialProof />
    </>
  )
}
