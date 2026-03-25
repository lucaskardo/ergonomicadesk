# CLAUDE.md

## REGLAS CRÍTICAS
- NUNCA modificar archivos en node_modules
- NUNCA correr pnpm install/add sin que el prompt lo indique explícitamente
- NUNCA patchear dependencias para diagnosticar errores
- NUNCA buscar en node_modules para resolver errores (leer docs en node_modules/next/dist/docs/ sí está permitido)
- Si el backend no arranca por un error que NO es de tus archivos, reportar el error y STOP
- No diagnosticar errores preexistentes — solo tocar los archivos listados en el prompt
- SIEMPRE reiniciar el storefront (kill + rm -rf .next + npx next dev) después de borrar .next. NUNCA dejar el servidor corriendo con .next borrado.

## Project
E-commerce for ergonomic office furniture. Domain: ergonomicadesk.com. Market: Panama. Currency: USD. Bilingual: Spanish (primary) + English. Guest checkout only (no customer accounts).

## Stack
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js (App Router, RSC, Tailwind CSS v3) — Medusa Next.js Starter
- Backend: Medusa.js v2 (v2.13+) — commerce engine, workflows, modules
- DB: PostgreSQL 16 (Docker dev, Railway prod)
- Cache/Events: Redis 7 (Docker dev, Railway prod)
- Search: Meilisearch via @rokmohar/medusa-plugin-meilisearch
- Payments: Manual payment provider (placeholder until NMI integration)
- Email: Resend (not yet configured)
- Ads/Tracking: GTM (@next/third-parties), Meta CAPI (post-launch), Google Ads
- Hosting: Railway (prod), Docker Compose (dev only)

## Structure
apps/backend/                    → Medusa v2 (port 9000)
src/api/custom/                → Public routes (NO auth required)
product-feed/route.ts        → Google/Meta XML feed
src/api/store/                 → Store routes (requires x-publishable-api-key)
src/api/admin/                 → Admin routes (requires auth)
src/workflows/                 → Custom workflows
generate-product-feed.ts     → Feed workflow (2 steps)
steps/get-product-feed-items.ts
steps/build-product-feed-xml.ts
src/modules/                   → Custom modules (delivery-panama, rbac)
apps/storefront/                 → Next.js Starter (port 8000)
src/app/[countryCode]/
(main)/                      → ES routes: /, /products, /store, /categories
(checkout)/                  → ES checkout
en/(main)/                   → EN routes (same structure)
en/(checkout)/               → EN checkout
src/lib/
data/                        → Server-side fetch: cart.ts, products.ts, regions.ts
tracking/index.ts            → trackEvent, trackViewItem, trackAddToCart, trackBeginCheckout, trackPurchase
tracking/utm.ts              → captureUtmParams, getStoredUtm, getSessionPages, getViewedProducts
i18n/context.tsx             → LangProvider + useLang() hook → "es" | "en"
src/modules/
common/components/json-ld/   → Product (shippingDetails + returnPolicy), Organization, Breadcrumb
common/components/whatsapp-button/ → Floating WhatsApp with tracking
products/components/product-tracker/ → view_item dataLayer on PDP mount
products/components/product-actions/ → addToCart with tracking
checkout/components/checkout-tracker/ → begin_checkout dataLayer
order/components/purchase-tracker/   → purchase dataLayer
layout/components/utm-capture/       → UTM cookie capture on load
store/components/store-heading/      → Bilingual H1 (useLang)

Bilingual URLs: /pa/ (Spanish default), /pa/en/ (English). hreflang + canonical per language.

## Business Rules
- Guest checkout ONLY — no customer accounts, no login/register pages
- ITBMS 7% Panama VAT — prices stored WITHOUT tax, calculated at checkout
- Free delivery + assembly in Panama City when subtotal > $100
- Shipping: Retiro ($0), Panama City ($15, free >$100), Provincias ($25)
- 7-day return policy. 1-5 year warranties by product.
- WhatsApp: +507 6953-3776 (https://wa.me/50769533776)
- Two admin roles: admin (full) + sales_associate (read-only). RBAC is custom middleware.
- Inventory source of truth: QuickBooks. QB → Medusa sync only.

## Products (Imported)
- 231 products across 6 categories
- Standing Desks (82), Oficina/Office (46), Sillas/Chairs (35), Almacenamiento/Storage (19), Accesorios/Accessories (54), Colecciones
- Sobres de Melamina: 1 product, 52 variants (Color × Tamaño)
- Sobres de Madera Natural: 1 product, multi-variant (Madera × Tamaño)
- 154 products have metadata specs (warranty, motors, speed, lumbar, etc.)

## Tracking & Attribution (Built)
- GTM: GoogleTagManager in root layout, gated by NEXT_PUBLIC_GTM_ID env var
- dataLayer events: view_item, add_to_cart, begin_checkout, purchase, contact_whatsapp
- Each event: event_id (deterministic), _fbp/_fbc cookies, content_ids, ecommerce object
- UTM: _ergo_utm cookie (30 days) captures utm_*, gclid, fbclid, ctwa_clid, device_type, landing_page
- Session: _ergo_pages cookie (pageview counter), _ergo_viewed cookie (last 10 SKUs)
- Before cart.complete: placeOrder reads cookies server-side, saves to cart.metadata
- Medusa copies cart.metadata → order.metadata automatically
- NO raw PII in dataLayer

## Order Metadata (for Dashboard)
```json
{
  "attribution": {
    "utm_source": "facebook", "utm_medium": "cpc", "utm_campaign": "...",
    "fbclid": "...", "gclid": "...", "ctwa_clid": "...",
    "landing_page": "/pa/products/...", "referrer": "...",
    "device_type": "mobile", "session_pages": "4"
  },
  "products_viewed": ["sku1", "sku2"],
  "funnel_checkout_started": "2026-03-20T15:05:00Z"
}
```

## Product Feed
- Endpoint: GET /custom/product-feed (Medusa backend, public, no auth)
- Medusa workflow: generateProductFeedWorkflow with 2 steps
- RSS 2.0 XML with g: namespace (Google Shopping + Meta compatible)
- 231 products, all "in stock" by default (until QB sync)
- Cache-Control: 6 hours

## SEO (Built)
- JSON-LD: Product (OfferShippingDetails PA + MerchantReturnPolicy 7 days), Organization, Breadcrumb
- ProductJsonLd rendered in PDP page.tsx (server-rendered RSC)
- robots.txt: AI bots allowed (GPTBot, ClaudeBot, PerplexityBot, Googlebot, Amazonbot)
- Sitemap: next-sitemap.js with ergonomicadesk.com base URL
- H1 tags on all pages (bilingual on /store)

## Medusa Patterns (MUST FOLLOW)
- Workflows: createStep + createWorkflow from @medusajs/framework/workflows-sdk
- Data in steps: resolve "query" from container → query.graph()
- API routes: /store/* needs x-publishable-api-key, /admin/* needs auth, /custom/* is public
- Payment providers fetch: ALWAYS cache: "no-store" — silently breaks checkout otherwise
- Cart metadata: set before cart.complete — copies to order.metadata automatically
- RBAC: built-in roles do NOT enforce access — custom middleware required
- Module names: underscores not hyphens
- Prices in CENTS (29900 = $299.00) — divide by 100 for display
- Node.js MUST be v20 LTS

## Storefront Patterns (MUST FOLLOW)
- Server components by default — "use client" only when needed
- Data fetching in src/lib/data/ (server-side, Medusa JS SDK)
- Tracking functions: client-only (typeof window !== "undefined")
- JSON-LD: server-rendered (RSC)
- pnpm: use --filter storefront or --filter backend for installs

## REGLAS ANTI-ROTURA (OBLIGATORIAS)

### Después de instalar cualquier paquete:
```bash
rm -rf node_modules apps/backend/node_modules apps/storefront/node_modules apps/backend/.medusa
pnpm install
cd apps/backend && npx medusa develop  # Verificar que arranca
```
Medusa's hoisted node_modules corruptan con pnpm add parciales.

### Después de cualquier cambio al backend:
Esperar que el watcher reinicie. Verificar:
```bash
curl -s http://localhost:9000/health
```
Si no responde, revertir inmediatamente con git checkout -- <archivo>.

### Orden de verificación obligatorio:
1. Backend compila (curl health)
2. Storefront compila (curl http://localhost:8000/pa)

### Debugging:
- Si error persiste después de revertir: rm -rf node_modules && pnpm install
- Si no hay causa clara después de 2 intentos: STOP y reportar — no seguir investigando

## Known Gotchas
- Region middleware: can 404 if backend slow — has retry + fallback
- Product feed: /custom/ not /store/ (Google can't send auth headers)

## Dev Start
```bash
docker compose up -d                              # PostgreSQL + Redis + Meilisearch
cd apps/backend && npx medusa develop             # Backend :9000
cd apps/storefront && pnpm dev                    # Storefront :8000
```

## Environment Variables
Backend (.env.local)
DATABASE_URL=postgres://...
REDIS_URL=redis://...
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
STOREFRONT_URL=https://ergonomicadesk.com
Storefront (.env.local)
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_BASE_URL=https://ergonomicadesk.com
NEXT_PUBLIC_DEFAULT_REGION=pa
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

## Pending — Launch Blockers (not yet built)
- NMI Payment Provider (manual payment is placeholder)
- Product photos (not uploaded)
- Cloudflare setup (domain, CDN, WAF)
- Deploy to Railway

## NMI Integration (Reference)
- Package: @nmipayments/nmi-pay-react
- Use onChange (NOT onPay) for 3DS
- Amount: STRING "299.00" not number
- Backend POST to transact.php: application/x-www-form-urlencoded (NOT JSON)
- Response: key=value pairs — parse with URLSearchParams
- After failed payment: resetFields() on NmiPayments ref

## Meilisearch
- Plugin: @rokmohar/medusa-plugin-meilisearch (v2 compatible)
- Registered as plugin in medusa-config.ts (not module)

## Bundles Strategy
- Bundles are products in Medusa with metadata.bundle_type = "bundle"
- The bundle product has NO SKU of its own — it exists only for display/PDP purposes
- metadata.bundle_items = ["sku1", "sku2"] lists the component SKUs
- metadata.bundle_discount_pct = 20 (or whatever %) — the discount applied to the bundle
- When a bundle is added to cart, the INDIVIDUAL component SKUs are added as separate line items (for accounting/fulfillment)
- The bundle discount is applied proportionally to each component SKU's price BEFORE adding to subtotal
- Cart display: each line item shows original price with strikethrough, then "20% discount $X" underneath
- This preserves correct per-SKU accounting for QuickBooks and fulfillment
- Example: Bundle "Desk Black Edition" = frame-single-bl ($300) + top-mela-black-150 ($159)
  - At 20% discount: frame → $300 strikethrough, shows "20% desc. $240" / top → $159 strikethrough, shows "20% desc. $128"
  - Non-bundle items in the same cart show normal pricing without discount
- In the admin, create the bundle as a normal product with photos of the complete setup
- Phase: post-launch, after base catalog is established

## Prompting Rules
- Search official docs (context7 MCP) before implementing
- Execute immediately — no brainstorming preamble
- One git commit per task
- SIEMPRE hacer git push origin main al final de cada tarea completada
