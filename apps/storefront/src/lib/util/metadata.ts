import { Metadata } from "next"
import { canonicalUrl, alternateUrls } from "@lib/util/routes"

type BuildMetadataOptions = {
  /** Page title WITHOUT the " | Ergonómica" suffix */
  title: string
  description: string
  countryCode: string
  lang: "es" | "en"
  /** Relative path, e.g. "/blog/my-post" */
  path: string
  keywords?: string[]
  image?: string
  /** Defaults to "Ergonómica" */
  suffix?: string
}

/**
 * Central metadata builder for all pages.
 * Always use this instead of building Metadata objects manually.
 */
export function buildMetadata({
  title,
  description,
  countryCode,
  lang,
  path,
  keywords,
  image,
  suffix = "Ergonómica",
}: BuildMetadataOptions): Metadata {
  const fullTitle = `${title} | ${suffix}`
  const canonical = canonicalUrl(countryCode, lang, path)

  return {
    title: fullTitle,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical,
      languages: alternateUrls(countryCode, path),
    },
    openGraph: {
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
  }
}
