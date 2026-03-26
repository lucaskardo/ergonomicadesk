@AGENTS.md

## SEO Rules for New Pages

### URLs
- All internal links, canonicals, sitemap entries, and JSON-LD urls MUST use helpers from `src/lib/util/routes.ts`
- Never hardcode `/pa/` or domain names in page files

### Metadata
- All pages MUST use `buildMetadata()` from `src/lib/util/metadata.ts`
- Never construct a `Metadata` object manually
- Title format: `"Page Name | Ergonómica"` (default suffix)
- Blog posts use `suffix: "Ergonómica Blog"`
- Always include `countryCode`, `lang`, `path` for correct canonical + hreflang

### JSON-LD (structured data)
- All indexable pages MUST render `<BreadcrumbJsonLd>` (from `@modules/common/components/json-ld/breadcrumb`)
- Product pages: `<ProductJsonLd>` (from `@modules/common/components/json-ld/product`)
- Blog posts: `<ArticleJsonLd>` (from `@modules/common/components/json-ld/article`)
- Blog posts with FAQs: `<FAQPageJsonLd>` (from `@modules/common/components/json-ld/faq`)
- All JSON-LD components are server-rendered RSC — never import them in client components

### English pages
- EN routes re-export the ES component: `export { default, generateMetadata } from "../../../(main)/page"`
- Language detection at runtime via `getLang()` from `@lib/i18n`
- Do NOT duplicate page logic for EN routes

### Tracking
- All event tracking functions live in `src/lib/tracking/index.ts`
- Tracking functions are client-only — always check `typeof window !== "undefined"` or use in client components

### Sitemap
- `next-sitemap.js` auto-generates sitemap entries for products, categories, collections, and blog posts
- When adding a new route type, add a `additionalPaths` entry in `next-sitemap.config.js`
