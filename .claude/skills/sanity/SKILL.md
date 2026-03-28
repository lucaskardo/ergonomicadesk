---
name: sanity-cms
description: Use when working with Sanity CMS — schemas, queries, content, Studio, images, page builder sections, or any file in src/sanity/
---

## Sanity en Ergonómica
- Project: 7b580fxk, dataset: production
- Client: src/sanity/lib/client.ts (uses next-sanity, NOT @sanity/client)
- Image builder: urlFor() from src/sanity/lib/image.ts
- Queries: GROQ in src/sanity/lib/queries.ts

## Page builder architecture
- Homepage document has sections[] array
- Each section = Sanity schema block + React component + GROQ projection
- Fallback: if Sanity empty → hardcoded components render

## Singletons (NEVER duplicate or delete)
siteSettings, announcementBar, headerNav, footerNav, homepage

## Localization pattern
- Page builder blocks: field-level {es, en} objects (localizedString / localizedText)
- Blog posts: one document per language with `lang` field
- This separation is intentional — blocks are compact bilingual, posts are long monolingual

## Existing block schemas
heroSection, trustBarSection, categoryGridSection, featuredProductsSection, buildYourDeskSection, testimonialsSection, ctaImageSection, blogPreviewSection, newsletterSection, commercialPreviewSection

## Existing document schemas
homepage, siteSettings, announcementBar, headerNav, footerNav, blogPost, page, commercialSector

## Shared schemas
localizedFields.ts (localizedString, localizedText, localizedSlug)

## Revalidation
- Webhook: POST /api/sanity/revalidate with SANITY_REVALIDATE_SECRET
- Visual editing: disabled by default (set SANITY_VISUAL_EDITING=true)

## Gotchas
- GROQ nested object syntax in fragments (e.g., statFragment) is invalid — use flat projections
- Always use cdn.sanity.io in next.config.ts remotePatterns for images
- Use Editor token (not Viewer) for seed scripts that write data
- Seed scripts must use `next-sanity` createClient, NOT `@sanity/client`

## To add a new homepage section
1. Create schema: src/sanity/schemas/blocks/[name]Section.ts (use defineType, defineField)
2. Register in src/sanity/schemas/index.ts
3. Add defineArrayMember({ type: "[name]Section" }) in homepage.ts sections array
4. Create React component: src/modules/home/components/[name]/index.tsx
5. Add case "[name]Section" in homepage.tsx PageBuilder switch
6. Add GROQ projection in queries.ts inside HOMEPAGE_QUERY
7. Run: cd apps/storefront && npx next build
