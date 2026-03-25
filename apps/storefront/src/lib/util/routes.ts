/**
 * Route Manifest — single source of truth for all public URLs.
 * Every internal link, canonical, sitemap entry, and JSON-LD url MUST use these helpers.
 */

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://ergonomicadesk.com"

// ── Path builders (relative, for internal links via LocalizedClientLink) ──

export function productPath(handle: string, sku?: string): string {
  return sku ? `/productos/${handle}/${sku}` : `/productos/${handle}`
}

export function categoryPath(handle: string): string {
  return `/categorias/${handle}`
}

export function collectionPath(handle: string): string {
  return `/colecciones/${handle}`
}

export function blogPath(slug: string): string {
  return `/blog/${slug}`
}

// Static paths
export const PATHS = {
  home: "/",
  store: "/store",
  catalog: "/catalog",
  cart: "/cart",
  faq: "/faq",
  returns: "/returns",
  warranty: "/warranty",
  terms: "/terms",
  privacy: "/privacy",
  blog: "/blog",
} as const

// ── Canonical URL builders (absolute, for metadata + JSON-LD + sitemap) ──

export function canonicalUrl(countryCode: string, lang: "es" | "en", path: string): string {
  const langPrefix = lang === "en" ? "/en" : ""
  return `${SITE_URL}/${countryCode}${langPrefix}${path}`
}

export function productCanonical(countryCode: string, lang: "es" | "en", handle: string): string {
  return canonicalUrl(countryCode, lang, productPath(handle))
}

export function categoryCanonical(countryCode: string, lang: "es" | "en", handle: string): string {
  return canonicalUrl(countryCode, lang, categoryPath(handle))
}

// ── Alternate URLs (for hreflang) ──

export function alternateUrls(countryCode: string, path: string): Record<string, string> {
  return {
    es: canonicalUrl(countryCode, "es", path),
    en: canonicalUrl(countryCode, "en", path),
    "x-default": canonicalUrl(countryCode, "es", path),
  }
}

// ── Absolute site URL ──
export { SITE_URL }
