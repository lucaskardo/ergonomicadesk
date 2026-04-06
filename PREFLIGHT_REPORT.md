# Preflight Report — 2026-04-06

## bg-ergo-950 usage
Used in: footer, announcement-bar, social-proof, cta-image-section, hero, commercial-preview, build-your-desk, featured-products-home, comercial pages, blog pages, store templates.
All usages are appropriate (dark sections, hero/footer/cta contexts). No issues found.

## og-home.jpg references
- `src/app/[countryCode]/(main)/page.tsx:29` — references `/og-home.jpg`
- `src/app/[countryCode]/en/(main)/page.tsx:28` — references `/og-home.jpg`
- **File does NOT exist:** `public/og-home.jpg` — 404 in production
- **Alternative exists:** `public/images/hero-homepage.png`

## nmi-payment-section imports
NINGUNO — no file imports from `nmi-payment-section/`. Safe to delete.

## Hardcoded /pa/ paths
- `src/content/blog/posts.ts` — 6 occurrences in blog HTML content (lines 143, 151, 159, 294, 298, 302)
- `src/app/robots.ts` — 5 occurrences (lines 14-18) for disallowed paths
Note: robots.ts hardcoded paths are acceptable (disallow rules). Blog posts.ts should be migrated to route helpers eventually but is low-risk static content.

## console.log/warn (excluding console.error)
- `src/proxy.ts:55` — console.warn for missing regions (legitimate warning)
- `src/modules/checkout/components/addresses/index.tsx:70` — honeypot bot warning (legitimate)
- `src/modules/home/components/build-your-desk/index.tsx:291` — SKU not found warning (legitimate)
- `src/app/api/turnstile-verify/route.ts:73` — Turnstile verification warning (legitimate)
- `src/lib/util/fetch-safe.ts:22` — timeout warning (legitimate)
All are legitimate operational warnings, not debug logs.

## NEXT_PUBLIC env vars used in code
- NEXT_PUBLIC_BASE_URL
- NEXT_PUBLIC_DEFAULT_REGION
- NEXT_PUBLIC_GTM_ID
- NEXT_PUBLIC_MEDUSA_BACKEND_URL
- NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
- NEXT_PUBLIC_MEILISEARCH_API_KEY
- NEXT_PUBLIC_MEILISEARCH_HOST
- NEXT_PUBLIC_NMI_TOKENIZATION_KEY
- NEXT_PUBLIC_SANITY_DATASET
- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_TURNSTILE_SITE_KEY

## Backend env vars used in code
- ADMIN_NOTIFICATION_EMAIL
- BACKEND_PUBLIC_URL
- INDEXNOW_API_KEY
- META_CAPI_ACCESS_TOKEN
- META_PIXEL_ID
- META_TEST_EVENT_CODE
- NMI_3DS_MODE (NOT in .env.template — missing)
- NMI_API_LANE
- NMI_SECURITY_KEY
- NODE_ENV
- REDIS_URL
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- STOREFRONT_URL
- TURNSTILE_SECRET_KEY

## TypeScript check
`npx tsc --noEmit` — **0 errors** ✓

## Lint check
`npx next lint` — ESLint config has circular structure error (pre-existing issue with eslintrc.js + Next.js 16 flat config). Not blocking build.

## Env template gaps
### Storefront
- All NEXT_PUBLIC_* vars present in .env.template ✓
- NEXT_PUBLIC_SENTRY_DSN in template but not used in code (Sentry uses its own config)

### Backend
- Missing: `NMI_3DS_MODE` (used in nmi-charge route, defaults to "best_effort") → **FIXED**
- Missing: `TURNSTILE_SECRET_KEY` (used in nmi-charge route for server-side verification) → **FIXED**
- All other vars present ✓

---

## Session S33A Results

### Files modified
- `PREFLIGHT_REPORT.md` — new (this file)
- `apps/storefront/src/app/[countryCode]/(main)/page.tsx` — OG image fix + buildMetadata()
- `apps/storefront/src/app/[countryCode]/en/(main)/page.tsx` — OG image fix + buildMetadata()
- `apps/storefront/next.config.ts` — CSP connect-src R2 domains
- `apps/storefront/.env.template` — restructured, rotation warning
- `apps/backend/.env.template` — added NMI_3DS_MODE, TURNSTILE_SECRET_KEY

### Files deleted
- `apps/storefront/src/modules/checkout/components/nmi-payment-section/index.tsx` — unused dead code

### Build result
- `npx tsc --noEmit` — **0 errors** ✓
- `npx next build` — fails with ECONNREFUSED (Medusa backend not running). This is expected in dev without backend. No new errors introduced by these changes.

### Risks detected
1. **Backend must be running for full build verification** — category pages do SSG fetches to localhost:9000. Cannot fully verify build without backend.
2. **ESLint config broken** — pre-existing circular structure error in `.eslintrc.js` with Next.js 16 flat config migration. Should be fixed separately.
3. **Blog hardcoded /pa/ paths** — `src/content/blog/posts.ts` has 6 hardcoded `/pa/` links in HTML blog content. Low risk (static content) but should be migrated to route helpers.
4. **SANITY_API_READ_TOKEN rotation** — previous token was exposed. Must rotate before production deploy.
5. **Backend TypeScript warnings** — `get-product-feed-items.ts` has 2 TS errors (type mismatch + unknown property `limit`). Pre-existing, not introduced by S33A.
