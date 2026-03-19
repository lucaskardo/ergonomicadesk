# CLAUDE.md

## Project
E-commerce for ergonomic office furniture. Domain: ergonomicadesk.com. Market: Panama. Currency: USD. Language: Spanish (content), English (code). Monolith modular architecture.

## Stack
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js 15 (App Router, React Server Components, Tailwind CSS v4)
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
apps/storefront/           → Next.js 15 (port 3000)
  app/(shop)/              → Public storefront pages
  app/studio/[[...tool]]/  → Sanity Studio (embedded, protected)
  sanity/                  → Sanity config, schemas, client, queries
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
- Studio embedded at `app/studio/[[...tool]]/page.tsx` using `NextStudio` from `next-sanity/studio`.
- Visual Editing: `<VisualEditing />` from `next-sanity/visual-editing` rendered when draftMode is enabled. `<SanityLive />` always rendered.
- Revalidation webhook: use `parseBody` from `next-sanity/webhook` with HMAC signature verification.
- TypeGen: `npx sanity@latest typegen generate` for auto-generated TypeScript types from schemas.

## Responsive design (mobile-first, Tailwind v4)
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

## SEO rules (per Google Search Central)
- SSR for all pages. Critical content server-rendered in HTML.
- On-demand revalidation (not fixed ISR). Subscriber → revalidatePath.
- Product schema (JSON-LD) on PDP only. Never on category pages.
- Schemas: Product+Offer (with OfferShippingDetails), BreadcrumbList, Organization+MerchantReturnPolicy, LocalBusiness.
- No FAQPage schema as SEO play (Google reduced rich results for these).
- Sitemap XML dynamic from Medusa products + Sanity pages.
- Internal linking: categories ↔ products ↔ guides ↔ blog posts.
- All links as `<a href>` tags (Google doesn't crawl JS-only navigation).
- Prices in structured data: without ITBMS (the actual product price).

## Environment variables
See `.env.example` for full list. NEVER hardcode secrets. Frontend public vars use `NEXT_PUBLIC_` prefix.

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
- loadEnv must point to directory containing .env.local
- Redis: env var is REDIS_URL. "redisUrl not found" = .env.local missing or wrong path
- File module dev: no file provider configured (Medusa defaults to local storage). Production: @medusajs/medusa/file-s3
- Module names: no hyphens. Use underscores (delivery_panama not delivery-panama)
- Custom modules registered in medusa-config.ts modules array: { resolve: "./src/modules/my_module" }

### Sanity + next-sanity 12
- defineLive() from "next-sanity/experimental/live" — requires cacheComponents: true
- Studio embebido: "use client" + NextStudio component
- CORS: add localhost:3000 in manage.sanity.io > API > CORS origins
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
- Required storefront: NEXT_PUBLIC_MEDUSA_BACKEND_URL, NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, NEXT_PUBLIC_MEDUSA_REGION_ID, NEXT_PUBLIC_SANITY_PROJECT_ID
- Required backend: DATABASE_URL, REDIS_URL, COOKIE_SECRET, JWT_SECRET, STORE_CORS, ADMIN_CORS

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
