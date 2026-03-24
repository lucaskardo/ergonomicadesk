import { getRegion } from "@lib/data/regions"
import { withTimeout } from "@lib/util/fetch-safe"
import { OrganizationJsonLd } from "@modules/common/components/json-ld/organization"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import CategoryGrid from "@modules/home/components/category-grid"
import BuildYourDesk from "@modules/home/components/build-your-desk"
import FeaturedProductsHome from "@modules/home/components/featured-products-home"
import WorkspacesSection from "@modules/home/components/workspaces-section"
import SocialProof from "@modules/home/components/social-proof"
import BlogPreview from "@modules/home/components/blog-preview"
import ShowroomSection from "@modules/home/components/showroom-section"
import Newsletter from "@modules/home/components/newsletter"

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
      {region && <FeaturedProductsHome region={region} lang={lang} />}
      <BuildYourDesk lang={lang} countryCode={countryCode} />
      <WorkspacesSection lang={lang} countryCode={countryCode} />
      <SocialProof lang={lang} />
      <BlogPreview lang={lang} />
      <ShowroomSection lang={lang} />
      <Newsletter lang={lang} />
    </>
  )
}
