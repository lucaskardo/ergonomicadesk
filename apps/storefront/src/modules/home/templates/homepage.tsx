import { getRegion } from "@lib/data/regions"
import { withTimeout } from "@lib/util/fetch-safe"
import { OrganizationJsonLd } from "@modules/common/components/json-ld/organization"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import CategoryGrid from "@modules/home/components/category-grid"
import BuildYourDesk from "@modules/home/components/build-your-desk"
import FeaturedProductsHome from "@modules/home/components/featured-products-home"
import WhyErgonomica from "@modules/home/components/why-ergonomica"
import B2BBanner from "@modules/home/components/b2b-banner"
import SocialProof from "@modules/home/components/social-proof"

export default async function Homepage({
  countryCode,
  lang,
}: {
  countryCode: string
  lang: "es" | "en"
}) {
  const region = await withTimeout(getRegion(countryCode), {
    fallback: null,
    label: "getRegion-homepage",
  })

  return (
    <>
      <OrganizationJsonLd lang={lang} />
      <Hero lang={lang} countryCode={countryCode} />
      <TrustBar lang={lang} />
      <CategoryGrid lang={lang} countryCode={countryCode} />
      <BuildYourDesk lang={lang} countryCode={countryCode} />
      {region && <FeaturedProductsHome region={region} lang={lang} />}
      <WhyErgonomica lang={lang} />
      <B2BBanner lang={lang} />
      <SocialProof lang={lang} />
    </>
  )
}
