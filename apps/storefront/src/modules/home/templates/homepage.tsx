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
import B2BBanner from "@modules/home/components/b2b-banner"
import CommercialPreview from "@modules/home/components/commercial-preview"
import Newsletter from "@modules/home/components/newsletter"
import CtaImageSection from "@modules/home/components/cta-image-section"
import { sanityFetch } from "@/sanity/lib/live"
import { HOMEPAGE_QUERY } from "@/sanity/lib/queries"

// ─── Type for a single page builder section ─────────────────────────────────
type Section = {
  _key: string
  _type: string
  [key: string]: unknown
}

// ─── Page builder renderer ────────────────────────────────────────────────────
function PageBuilder({
  sections,
  lang,
  countryCode,
  region,
}: {
  sections: Section[]
  lang: "es" | "en"
  countryCode: string
  region: unknown
}) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "heroSection":
            return (
              <Hero
                key={section._key}
                lang={lang}
                countryCode={countryCode}
                sanityData={section as Parameters<typeof Hero>[0]["sanityData"]}
              />
            )
          case "trustBarSection":
            return (
              <TrustBar
                key={section._key}
                lang={lang}
                sanityData={section as Parameters<typeof TrustBar>[0]["sanityData"]}
              />
            )
          case "categoryGridSection":
            return (
              <CategoryGrid key={section._key} lang={lang} countryCode={countryCode} />
            )
          case "featuredProductsSection":
            return region ? (
              <FeaturedProductsHome
                key={section._key}
                region={region as Parameters<typeof FeaturedProductsHome>[0]["region"]}
                lang={lang}
              />
            ) : null
          case "buildYourDeskSection": {
            const build = section as { visible?: boolean }
            return build.visible !== false ? (
              <BuildYourDesk key={section._key} lang={lang} countryCode={countryCode} />
            ) : null
          }
          case "testimonialsSection":
            return (
              <SocialProof
                key={section._key}
                lang={lang}
                sanityData={section as Parameters<typeof SocialProof>[0]["sanityData"]}
              />
            )
          case "ctaImageSection":
            return (
              <CtaImageSection
                key={section._key}
                lang={lang}
                data={section as Parameters<typeof CtaImageSection>[0]["data"]}
              />
            )
          case "blogPreviewSection":
            return <BlogPreview key={section._key} lang={lang} />
          case "commercialPreviewSection":
            return (
              <CommercialPreview key={section._key} lang={lang} countryCode={countryCode} />
            )
          case "newsletterSection":
            return (
              <Newsletter
                key={section._key}
                lang={lang}
                sanityData={section as Parameters<typeof Newsletter>[0]["sanityData"]}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

// ─── Homepage template ────────────────────────────────────────────────────────
export default async function Homepage({
  countryCode,
  lang,
}: {
  countryCode: string
  lang: "es" | "en"
}) {
  const [region, sanityResult] = await Promise.all([
    withTimeout(getRegion(countryCode), { fallback: null, label: "getRegion-homepage" }),
    sanityFetch({ query: HOMEPAGE_QUERY }).catch((err) => {
      console.error("[Homepage] sanityFetch error:", err)
      return { data: null }
    }),
  ])

  const sections: Section[] | null =
    sanityResult?.data?.sections && Array.isArray(sanityResult.data.sections)
      ? (sanityResult.data.sections as Section[])
      : null

  return (
    <>
      <OrganizationJsonLd lang={lang} />
      {sections && sections.length > 0 ? (
        <PageBuilder
          sections={sections}
          lang={lang}
          countryCode={countryCode}
          region={region}
        />
      ) : (
        // Fallback: render current hardcoded homepage
        <>
          <Hero lang={lang} countryCode={countryCode} />
          <TrustBar lang={lang} />
          <CategoryGrid lang={lang} countryCode={countryCode} />
          {region && <FeaturedProductsHome region={region} lang={lang} />}
          <BuildYourDesk lang={lang} countryCode={countryCode} />
          <WorkspacesSection lang={lang} countryCode={countryCode} />
          <SocialProof lang={lang} />
          <CommercialPreview lang={lang} countryCode={countryCode} />
          <BlogPreview lang={lang} />
          <ShowroomSection lang={lang} />
          <Newsletter lang={lang} />
        </>
      )}
    </>
  )
}
