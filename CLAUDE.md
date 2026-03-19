# CLAUDE.md

## Project
E-commerce for ergonomic office furniture. Domain: ergonomicadesk.com. Market: Panama. Currency: USD. Language: Spanish (content), English (code). Monolith modular architecture.

## Stack
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js 16.2 (App Router, React Server Components, Tailwind CSS v3) — **Medusa Next.js Starter v1.0.3**
- Backend: Medusa.js v2 (v2.13+) — commerce engine, 17 modules, durable workflows
- CMS: Sanity.io — editorial content. MVP 1: homepage + static pages only. MVP 4: blog, guides, portable text.
- DB: PostgreSQL 16 (Railway managed)
- Cache/Events/Locking: Redis 7 (Railway managed)
- Search: Meilisearch via @rokmohar/medusa-plugin-meilisearch (80+ SKU catalog)
- Payments: NMI Payment Component (@nmipayments/nmi-pay-react) + custom Payment Provider
- Media: Cloudflare R2 (S3-compatible, Medusa File Module Provider)
- Email: Resend (Medusa Notification Module Provider)
- Bot protection: Cloudflare Turnstile (managed mode)
- Analytics: PostHog Cloud (JS SDK)
- Error tracking: Sentry
- Hosting: Railway (prod), Docker Compose (dev only)
- Testing: Vitest
- Validation: Zod

## Structure
```
apps/backend/              → Medusa v2 (port 9000)
apps/storefront/           → Next.js 16.2 Medusa Starter (port 8000)
  src/app/[countryCode]/   → All public pages (middleware injects country code)
    (main)/                → Storefront routes: /, /products, /store, /categories, /collections, /account, /order
    (checkout)/            → Checkout route
  src/app/studio/          → Sanity Studio (embedded)
  src/lib/                 → SDK config, data fetching, context, hooks, util
    config.ts              → Medusa JS SDK init (uses MEDUSA_BACKEND_URL server-side)
    data/                  → Server-side fetch functions: cart.ts, products.ts, regions.ts, etc.
    context/               → modal-context.tsx (client-side modals)
  src/modules/             → UI modules: account, cart, categories, checkout, collections,
                             common, home, layout, order, products, shipping, skeletons, store
  src/sanity/              → Sanity config, schemas, client, queries
  src/styles/              → Global CSS
  src/types/               → TypeScript types
packages/shared/           → Shared TypeScript types and enums
```

## Content architecture
TWO content systems with clear separation:
- **Medusa Admin**: products, prices, variants, SKUs, stock, orders, payments, customers, shipping, tax.
- **Sanity Studio**: homepage hero/sections/banners, blog posts, guides, about/contact/policy pages, announcements. Visual editing: editors click on live page to edit inline.
- Products fetched from Medusa. Editorial content from Sanity. Combined in Next.js.
- Sanity webhook triggers revalidateTag on content publish.
- Medusa subscriber triggers revalidatePath on product changes.

## Business rules
- Guest checkout ONLY. No customer accounts.
- ITBMS (Panama VAT): 7% on domestic sales. 0% on international. Prices stored WITHOUT tax. Tax calculated at checkout. Display: subtotal + ITBMS (7%) + shipping = total.
- Free shipping threshold: >$100 subtotal (before tax) in Panama City.
- Checkout required fields: nombre, apellido, email (required), telefono (required), NIT/RUC (optional).
- Phone required for delivery coordination and assembly.
- Two admin roles: `admin` (full access) and `sales_associate` (read orders/customers/payments/inventory only).
- RBAC is custom middleware — Medusa's built-in roles do NOT control permissions.
- Inventory source of truth: QuickBooks Online. QB → Medusa sync only (webhook + CDC catchup). No Medusa → QB quantity sync. Orders created manually in QB by operator.
- Delivery zones: pickup ($0), Panama City (free >$100 + assembly included), provinces (variable rate, no assembly), international (Uno Express, client assembles).
- Payments: NMI Payment Component with 3DS. Idempotency managed in OUR backend, not assumed from gateway. Payment intent lock before calling NMI. Dedup webhooks by transaction_id. On timeout: DO NOT auto-retry — surgical DLQ (only 3 events: payment_captured_order_failed, nmi_webhook_ambiguous, qb_webhook_unprocessable). Medusa workflows handle retries for everything else.
- Cart abandonment: email after 4h if email captured.
- All monetary amounts: integers (cents) in Medusa/PostgreSQL. Convert to "299.00" string (cents/100).toFixed(2) when calling NMI (both 3DS and transact.php). Never send cents to NMI.

## Code conventions
- TypeScript strict everywhere. No `any`.
- ESLint + Prettier (root config).
- Path aliases: `@/` per app, `@ergonomicadesk/shared` for shared package.
- File naming: kebab-case. Variables/functions: camelCase. Components/types: PascalCase.
- One component per file, default export.
- Logger: Medusa's logger (`container.resolve("logger")`), never console.log in prod.
- Custom errors: typed error classes, not string throws.
- All dates UTC in backend. Format for Panama timezone (America/Panama) in frontend.

## Medusa v2 patterns
- Custom modules: `src/modules/{name}/` with `models/` + `service.ts` + `index.ts`
- Data models with Medusa DML (not TypeORM direct)
- Services extend `MedusaService({Model})` from `@medusajs/framework/utils`
- Module links for cross-module relations (no direct foreign keys between modules)
- Workflows: `createWorkflow` + `createStep` with compensation functions for rollback
- Subscribers: one file per event in `src/subscribers/`
- Scheduled jobs: `src/jobs/`
- Custom API routes: `src/api/custom/`
- Admin widgets: `src/admin/widgets/`
- Admin UI routes: `src/admin/routes/`
- Register all custom modules in `medusa-config.ts`
- Migrations: `npx medusa db:migrate`

## Storefront (Medusa Next.js Starter) — key patterns

### Region / country-code routing
- `src/middleware.ts` fetches regions from Medusa (server-side only), maps ISO-2 country codes to regions.
- Every URL is prefixed with the country code: `/pa/products/chair-x`.
- Env var is `MEDUSA_BACKEND_URL` (NO `NEXT_PUBLIC_` prefix) — used only in middleware + server components.
- `NEXT_PUBLIC_DEFAULT_REGION` fallback (default "us") used when geo-detection fails.
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` required in both middleware and SDK.

### Cart
- Cart ID stored in a cookie (managed in `src/lib/data/cart.ts`).
- Cart context managed via React Context (not Redux/Zustand).
- Cart module at `src/modules/cart/` — components + templates.
- Cart MUST be created with `region_id`. Region is derived from country code cookie.

### Products
- Fetched server-side in `src/lib/data/products.ts`.
- Product pages at `src/app/[countryCode]/(main)/products/[handle]/`.
- Always pass `region_id` to get `calculated_price` on variants.

### Checkout
- Multi-step checkout in `src/modules/checkout/` — address, shipping, payment, review steps.
- Payment components in `src/modules/checkout/components/payment/` and `payment-wrapper/`.
- Starter includes Stripe payment template — REPLACE with NMI (do not add Stripe deps).
- Checkout step components: `shipping-address`, `shipping`, `payment`, `review`, `payment-button`.

### Where to add customizations (safe zones)
- **NMI payment provider**: replace `src/modules/checkout/components/payment/` and `payment-button/`. Keep the step structure intact.
- **Sanity CMS**: already at `src/sanity/` and `src/app/studio/`. Add queries/schemas there.
- **Delivery zones (Panama)**: shipping options created in Medusa Admin. Display in `src/modules/checkout/components/shipping/`.
- **ITBMS 7%**: displayed in `src/modules/checkout/templates/checkout-summary/`. Add tax line below subtotal.
- **WhatsApp floating button**: add as global client component in `src/modules/layout/` rendered in root layout.
- **Free shipping progress bar**: add to `src/modules/cart/` components.
- **Trust badges**: add to `src/modules/checkout/components/` summary area.

### What NOT to touch in the starter
- `src/middleware.ts` — core region routing. Extend only with care.
- `src/lib/config.ts` — SDK init. Don't rewire.
- `src/lib/data/` — server fetch functions. Add new ones; don't break existing.
- `src/modules/common/` — shared UI primitives used everywhere.
- Core checkout step flow in `src/modules/checkout/templates/checkout-form/`.

### Ports
- Storefront: **8000** (`next dev --turbopack -p 8000`)
- Backend: **9000**

## NMI Payment Component integration (verified from docs.nmi.com)
- Package: `@nmipayments/nmi-pay-react`
- Use `onChange` (NOT `onPay`) when integrating 3DS — gives control to intercept before authentication.
- `NmiPayments` component: tokenizationKey, layout="multiLine", paymentMethods={['card']}, onChange callback.
- `NmiThreeDSecure` component: separate, with ref. Call `startThreeDSecure(paymentInfo)` after getting token.
- `PaymentInformation.amount` is type STRING, not number. Example: "299.00".
- `ThreeDSecureCompleteEvent` fields: cardHolderAuth, cavv, directoryServerId, eci, threeDsVersion, xid.
- After failed payment with onChange flow, call `resetFields()` on NmiPayments ref to clear fields before retry. This is a hard requirement.
- Backend NMI API: POST to `https://secure.networkmerchants.com/api/transact.php`.
- Request format: `application/x-www-form-urlencoded` (NOT JSON). Amount as "299.00" string, NOT cents.
- Response format: `key=value` pairs (NOT JSON). Parse with URLSearchParams or split on '&' and '='.
- Security key goes in `security_key` field. NEVER expose to frontend.

## Meilisearch integration (verified — community plugin for Medusa v2)
- Package: `@rokmohar/medusa-plugin-meilisearch` (NOT the old medusa-plugin-meilisearch which is v1 only).
- Register as `plugin` (not module) in medusa-config.ts under `plugins: []` array.
- Since plugin v1.0 + Medusa v2.4+, product event subscribers are INCLUDED in the plugin. Do NOT create custom subscribers for indexing.
- Storefront search: use `meilisearch` JS client directly with a search-only API key (public, safe for frontend).
- Create search-only API key via Meilisearch Keys API (POST /keys with actions: ["search"]).

## Sanity integration (verified from next-sanity npm + Sanity docs)
- Setup: `npx sanity@latest init` in storefront directory.
- Packages: `next-sanity` (includes @sanity/image-url), `@sanity/visual-editing`.
- Client: `createClient` from `next-sanity` with stega.studioUrl = '/studio'.
- API version: use today's date format '2025-03-18'.
- Queries: use `defineQuery` from `next-sanity` for type-safe GROQ queries.
- Data fetching: use `defineLive()` to create `sanityFetch` and `SanityLive` component.
- Fetch in Server Components with `const { data } = await sanityFetch({ query: MY_QUERY })`.
- Studio embedded at `src/app/studio/[[...tool]]/page.tsx` using `NextStudio` from `next-sanity/studio`.
- Visual Editing: `<VisualEditing />` from `next-sanity/visual-editing` rendered when draftMode is enabled. `<SanityLive />` always rendered.
- Revalidation webhook: use `parseBody` from `next-sanity/webhook` with HMAC signature verification.
- TypeGen: `npx sanity@latest typegen generate` for auto-generated TypeScript types from schemas.
- CORS: add localhost:8000 in manage.sanity.io > API > CORS origins (storefront runs on 8000).

## Responsive design (mobile-first, Tailwind v3)
- Mobile-first: base styles are mobile. Add `md:` and `lg:` for larger screens.
- Breakpoints: sm=640px, md=768px, lg=1024px, xl=1280px.
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Product grids: `grid-cols-2` mobile, `md:grid-cols-3` tablet, `lg:grid-cols-4` desktop.
- PDP: vertical stack mobile, `md:grid-cols-2` tablet+.
- Checkout: vertical stack mobile, `lg:grid-cols-[1.2fr_0.8fr]` desktop (form + summary sidebar).
- Nav: hamburger menu mobile, full links visible `md:` and up.
- Touch targets: minimum 44x44px on mobile.
- Images: Next.js `<Image>` with `sizes` prop for responsive loading. `priority` on hero/LCP images.
- Font: system font stack for zero loading time. Base 14px mobile, 16px desktop.
- Buttons: `w-full` on mobile, auto-width on desktop where appropriate.

## SEO + AI Engine Optimization (GEO/AEO)

### Technical SEO
- SSR for all pages. Critical content server-rendered in HTML.
- On-demand revalidation (not fixed ISR). Subscriber → revalidatePath.
- Sitemap XML dynamic from Medusa products + Sanity pages.
- Meta tags: title, description, og:image on every page.
- Canonical URLs on all pages.
- No index on checkout, cart, account pages.
- Internal linking: categories ↔ products ↔ guides ↔ blog posts.
- All links as `<a href>` tags (Google doesn't crawl JS-only navigation).

### Structured data (JSON-LD)
- **PDP**: Product schema with name, description, sku, brand, image, offers (price, priceCurrency, availability), aggregateRating. Prices WITHOUT ITBMS.
- **PDP**: BreadcrumbList schema.
- **PDP**: FAQPage schema with 3-5 preguntas frecuentes about the product.
- **Homepage**: Organization + LocalBusiness schema.
- **All pages**: BreadcrumbList schema.
- No FAQPage schema as SEO play on category/listing pages (Google reduced rich results).
- Offer always includes OfferShippingDetails and MerchantReturnPolicy.

### robots.txt — AI crawlers
Allow these bots explicitly: GPTBot, ClaudeBot, PerplexityBot, Googlebot, Amazonbot, CCBot, anthropic-ai, ChatGPT-User. Do NOT block any major AI crawler.

### GEO/AEO content rules
- Product descriptions: conversational, benefit-first, not just specs. Answer "which chair is best for X?" style queries.
- Registrar en chatgpt.com/merchants y Perplexity Merchant Program (gratuito).
- Include brand name "ErgonomicaDesk" in titles and H1s for brand entity recognition.

## Google Merchant Center + Shopping Feed
- Endpoint: `src/app/api/feed/google.xml/route.ts` — generates product feed from Medusa.
- Required fields per item: `id`, `title`, `description`, `link`, `image_link`, `price` (e.g. "299.00 USD"), `availability`, `brand`, `condition` (new), `gtin` or `mpn`.
- Price WITHOUT ITBMS in feed (pre-tax price).
- Register in Google Merchant Center with "Scheduled Fetch" pointing to `https://ergonomicadesk.com/api/feed/google.xml`.
- Structured data on PDPs complements the feed — Google uses both.
- Update feed whenever product prices/availability change (on-demand revalidation via webhook).

## UX — Panama market specifics
- **WhatsApp flotante**: client component in `src/modules/layout/components/whatsapp-button/`. Fixed position bottom-right. Links to WhatsApp Business number. Always visible except during active checkout payment step.
- **Barra envío gratis**: "Te faltan $X para envío GRATIS" in cart drawer. Calculates against $100 threshold.
- **Trust badges en checkout**: SSL, "Envío GRATIS en Ciudad de Panamá >$100", "Ensamblaje incluido", "Garantía del fabricante".
- **Badge ITBMS**: All prices displayed with "+ITBMS" badge. Show breakdown: subtotal + ITBMS 7% + envío = total.
- **Precios en USD**: Always show $ symbol. No other currency.

## Environment variables

### Storefront (apps/storefront/.env.local)
```
MEDUSA_BACKEND_URL=http://localhost:9000          # Server-side only (middleware + SDK)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000  # Client-side (legacy, keep for safety)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_BASE_URL=http://localhost:8000        # Must match storefront port
NEXT_PUBLIC_DEFAULT_REGION=pa                    # Panama as default
REVALIDATE_WINDOW=0
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
```

### Backend (apps/backend/.env.local)
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
COOKIE_SECRET=...
STORE_CORS=http://localhost:8000                 # Must match storefront port
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:8000,http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000
```

## Commands
```bash
pnpm dev              # All (turbo)
pnpm build            # Build all
pnpm lint             # Lint all
pnpm test             # Test all
pnpm typecheck        # TypeScript check

cd apps/backend && npx medusa db:migrate    # Run migrations
cd apps/backend && npx medusa develop       # Backend only
cd apps/storefront && npx sanity@latest typegen generate  # Sanity types

docker compose up     # Dev: postgres + redis + meilisearch
```

## Testing
- Vitest. Test files colocated: `service.test.ts` next to `service.ts`.
- Mock external services (NMI, QuickBooks, Resend, Sanity, Meilisearch).
- Each custom module has unit tests for its service.
- Integration tests for checkout flow, payment flow, QB sync.
- NMI test card: 4111111111111111 (approved), use NMI sandbox mode.

## Security
- NEVER include real API key values in code or comments.
- NEVER log card tokens, security keys, customer PII.
- All API routes validate input with Zod schemas.
- All webhook endpoints verify signatures/secrets before processing.
- Rate limiting: login 5/15min/IP, checkout 10/min/IP.
- Turnstile: token travels with checkout payload to Medusa backend. Backend validates with Cloudflare INSIDE the checkout workflow BEFORE calling NMI. Never validate in a separate frontend route.
- Cloudflare R2: use scoped API token (R2 only), never Global API Key.
- Railway: configure env vars in dashboard only, never via CLI with real values.

## Verified API patterns (DO NOT deviate — from official docs March 2026)

### Next.js 16 + cacheComponents (CRITICAL — applies to ALL pages)
- params is an ASYNC Promise. ALWAYS: { params: Promise<{ slug: string }> } then: const { slug } = await params
- searchParams is ASYNC too: { searchParams: Promise<{ cat?: string }> }
- cookies(), headers(), draftMode() are ALL async — must await
- Page pattern with data fetching (THE ONLY CORRECT PATTERN):
```
// page.tsx — sync wrapper, async inner
function Page({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Inner paramsPromise={params} />
    </Suspense>
  )
}
async function Inner({ paramsPromise }: { paramsPromise: Promise<{ handle: string }> }) {
  await connection() // from "next/server"
  const { handle } = await paramsPromise
  const data = await fetchSomething(handle)
  return <div>{data.title}</div>
}
export default Page
```
- Do NOT put async on the page-level exported component when it accesses params
- Do NOT use export const dynamic = "force-dynamic" — removed in Next.js 16
- Do NOT use "use server" at top of page files — that directive is ONLY for Server Actions
- Sanity Studio route needs "use client" directive
- Do NOT use new Date() in server components — hardcode or use client component
- generateMetadata also receives async params: export async function generateMetadata({ params }: { params: Promise<{ handle: string }> })

### Medusa v2 Store API — Products
- List: sdk.store.product.list({ limit: 20, region_id: REGION_ID, fields: "+variants.calculated_price" })
- Retrieve by ID: sdk.store.product.retrieve(id, { fields: "*variants.calculated_price", region_id: REGION_ID })
- ALWAYS use region_id for pricing context. country_code alone DOES NOT return calculated_price
- fields prefix: + adds to defaults, * returns ALL nested, - excludes
- x-publishable-api-key header required (SDK sends automatically)
- Products visible only if: status=published AND linked to sales channel AND sales channel linked to publishable API key

### Medusa v2 Store API — Cart (for checkout implementation)
- Create: sdk.store.cart.create({ region_id: region.id })
- Add item: sdk.store.cart.createLineItem(cartId, { variant_id, quantity: 1 })
- Update item: sdk.store.cart.updateLineItem(cartId, itemId, { quantity })
- Remove item: sdk.store.cart.deleteLineItem(cartId, itemId) — returns { parent: cart }
- Update cart: sdk.store.cart.update(cartId, { email, shipping_address: {...} })
- Complete: sdk.store.cart.complete(cartId) — returns { type: "order", order } on success or { type: "cart", cart, error } on failure
- Cart ID stored in localStorage on client side
- Cart MUST have region_id set at creation
- Cart must be associated with sales channel (automatic via publishable key)

### Medusa v2 Store API — Checkout flow order
1. Create cart with region_id
2. Add line items (variant_id + quantity)
3. Update cart with email + shipping_address
4. Add shipping method: sdk.store.cart.addShippingMethod(cartId, { option_id })
5. Initialize payment session (provider-specific)
6. Complete cart: sdk.store.cart.complete(cartId)

### Medusa v2 — Custom Payment Provider (NMI)
- Amount is STRING "299.00" not number — NMI 3DS and transact.php require string
- Use onChange (not onPay) on NMI Payment Component when integrating 3DS
- Backend POST to transact.php: Content-Type application/x-www-form-urlencoded (NOT JSON)
- Response is key=value pairs NOT JSON — parse with URLSearchParams
- After failed payment: call resetFields() on NmiPayments ref
- Turnstile validation happens INSIDE backend checkout workflow, not separate frontend route

### Medusa v2 — Tax
- Tax regions created via Modules.TAX
- ITBMS 7% for Panama (country_code "pa")
- Prices stored WITHOUT tax. Tax calculated at checkout based on region
- Store API returns tax-inclusive totals in cart when region has tax rate

### Medusa v2 — Configuration
- Node.js MUST be v20 LTS. v25 is NOT compatible (causes "Cannot read 'def'" errors)
- `.nvmrc` in repo root contains `20` — always `nvm use` before running backend commands
- loadEnv must point to directory containing .env.local
- Redis: env var is REDIS_URL. "redisUrl not found" = .env.local missing or wrong path
- File module dev: no file provider configured (Medusa defaults to local storage). Production: @medusajs/medusa/file-s3
- Module names: no hyphens. Use underscores (delivery_panama not delivery-panama)
- Custom modules registered in medusa-config.ts modules array: { resolve: "./src/modules/my_module" }

### Sanity + next-sanity 12
- defineLive() from "next-sanity/experimental/live" — requires cacheComponents: true
- Studio embebido: "use client" + NextStudio component
- CORS: add localhost:8000 in manage.sanity.io > API > CORS origins (storefront on port 8000)
- Revalidation webhook: parseBody from "next-sanity/webhook"
- sanityFetch for data fetching, SanityLive component in layout

### Meilisearch
- Plugin: @rokmohar/medusa-plugin-meilisearch (NOT old medusa-plugin-meilisearch)
- Registered as plugin in medusa-config.ts, not module
- Subscribers included in plugin since v1.0 + Medusa v2.4+

### Cloudflare
- Free plan sufficient: CDN, DDoS, SSL, DNS, 5 WAF rules, Turnstile, R2
- Turnstile is free on ALL plans, even without Cloudflare account
- R2 pricing: $0.015/GB/month
- Domain: keep on Namecheap, only change nameservers to Cloudflare (at launch, not now)

### Environment variables
- NEVER duplicate vars in .env.local — dotenv uses FIRST occurrence, duplicates are IGNORED
- Storefront critical: MEDUSA_BACKEND_URL (no prefix, server-side), NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, NEXT_PUBLIC_BASE_URL=http://localhost:8000
- Backend critical: DATABASE_URL, REDIS_URL, COOKIE_SECRET, JWT_SECRET, STORE_CORS=http://localhost:8000, ADMIN_CORS

### Before writing ANY code
- ALWAYS query official docs via context7 MCP BEFORE implementing any integration
- ALWAYS verify API response with curl BEFORE writing frontend code
- ALWAYS test with curl AFTER implementing to confirm it works
- NEVER catch errors silently — always console.error in catch blocks
- NEVER guess API parameters — check docs first
- When creating new pages: follow the Suspense wrapper pattern above EVERY TIME

## Claude Code execution rules
- Execute immediately. Never brainstorm, never propose designs, never write design docs.
- Do not load skills unless explicitly requested. No superpowers:brainstorming.
- Zero questions if the task is clear. Maximum 1 question if ambiguous.
- Short answers. Show what was done in a brief summary table. No essays.
- If a command fails, fix it and retry immediately. Do not explain options.
- Do not ask "would you like me to proceed" — just proceed.
- Prefer editing existing files over proposing rewrites.
- One git commit per completed task with conventional commit message.
- Use /compact proactively when context grows.
