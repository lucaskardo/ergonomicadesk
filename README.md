# 🪑 ErgonomicaDesk — E-Commerce Platform

> Modern e-commerce platform for ergonomic office furniture in Panama. Built on Medusa.js v2 + Next.js.

**Live:** [ergonomicadesk.com](https://ergonomicadesk.com) · **Instagram:** [@ergonomicadesk](https://instagram.com/ergonomicadesk) (15K followers) · **WhatsApp:** [+507 6953-3776](https://wa.me/50769533776)

---

## About

Ergonómica is Panama's premier ergonomic office furniture brand — standing desks, ergonomic chairs, modular office systems, and accessories. This repository contains the complete e-commerce platform replacing the legacy website, designed from the ground up for conversion, SEO, AI-engine readiness, and full marketing attribution.

### Key Business Facts

- **Market:** Panama (Ciudad de Panamá primary, nationwide delivery)
- **Currency:** USD only
- **Language:** Bilingual — Spanish (primary) + English (expat audience)
- **Checkout:** Guest-only (no customer accounts required)
- **Tax:** ITBMS 7% (Panama VAT) — prices stored without tax
- **Shipping:** Free delivery + assembly in Panama City over $100
- **Catalog:** 231 products across 6 categories

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Commerce Engine** | Medusa.js v2 (v2.13+) | Products, orders, cart, checkout, payments, inventory, tax, shipping |
| **Storefront** | Next.js (App Router, RSC) | Server-rendered storefront with Tailwind CSS v3 |
| **Database** | PostgreSQL 16 | Primary data store |
| **Cache/Events** | Redis 7 | Caching, event bus, workflow engine, locking |
| **Search** | Meilisearch | Full-text product search (231 SKUs indexed) |
| **Payments** | NMI Payment Component | 3DS-enabled credit card processing (SAQ-A PCI) |
| **Email** | Resend | Transactional emails via Medusa Notification Module |
| **Tracking** | GTM + Meta CAPI + Google Ads | Full-funnel conversion tracking with server-side dedup |
| **CDN/Security** | Cloudflare | WAF, CDN, SSL, Turnstile bot protection |
| **Hosting** | Railway | Managed PostgreSQL, Redis, app hosting |
| **Monorepo** | Turborepo + pnpm | Workspace management |

---

## Architecture

```
ergonomicadesk/
├── apps/
│   ├── backend/                     # Medusa v2 server (port 9000)
│   │   ├── src/
│   │   │   ├── api/custom/          # Public API routes (no auth)
│   │   │   │   └── product-feed/    # Google/Meta XML feed endpoint
│   │   │   ├── workflows/           # Medusa workflows
│   │   │   │   ├── generate-product-feed.ts
│   │   │   │   └── steps/           # Workflow steps
│   │   │   ├── modules/             # Custom Medusa modules
│   │   │   │   ├── rbac/            # Role-based access control
│   │   │   │   ├── delivery-panama/ # Panama delivery zones
│   │   │   │   └── resend/          # Email notifications
│   │   │   ├── scripts/             # Seed scripts, data migrations
│   │   │   └── admin/               # Admin dashboard customizations
│   │   └── medusa-config.ts
│   │
│   └── storefront/                  # Next.js storefront (port 8000)
│       ├── src/
│       │   ├── app/[countryCode]/   # Locale-routed pages
│       │   │   ├── (main)/          # Spanish routes
│       │   │   ├── (checkout)/      # Spanish checkout
│       │   │   ├── en/(main)/       # English routes
│       │   │   └── en/(checkout)/   # English checkout
│       │   ├── lib/
│       │   │   ├── data/            # Server-side Medusa SDK calls
│       │   │   ├── tracking/        # GTM dataLayer + UTM capture
│       │   │   └── i18n/            # Bilingual context (useLang hook)
│       │   └── modules/             # UI components
│       │       ├── home/            # Homepage sections
│       │       ├── products/        # PDP, product cards, tracker
│       │       ├── checkout/        # Multi-step checkout
│       │       ├── common/          # JSON-LD, WhatsApp, shared UI
│       │       └── store/           # Store listing, filters
│       └── next-sitemap.js
│
└── packages/
    └── shared/                      # Shared TypeScript types
```

---

## Product Catalog

| Category | Products | Examples |
|----------|----------|---------|
| **Standing Desks** | 82 | Frames (single/double/heavy duty/L-shape), complete desks |
| **Oficina / Office** | 46 | Core, Blok, Flow collection desks, workstations |
| **Sillas / Chairs** | 35 | XTC, XTC v2, Pilot, Summit ergonomic chairs |
| **Almacenamiento** | 19 | Filing cabinets, credenzas, bookshelves |
| **Accesorios** | 54 | Monitor arms, cable trays, desk pads, keyboards, mice |
| **Colecciones** | — | Core, Flow, Blok, XTC curated bundles |

### Special Products
- **Sobre de Melamina:** 1 product with 52 variants (19 colors × 3 sizes) — consolidated from individual SKUs
- **Sobre de Madera Natural:** 1 product with multi-variant options (wood type × size)
- **154 products** have rich metadata specs (warranty, motors, speed, lumbar support, etc.)

---

## Features Built

### Storefront
- **Bilingual (ES/EN)** — `/pa/` Spanish, `/pa/en/` English with hreflang tags
- **Homepage** — Hero, trust bar, category grid, build-your-desk CTA, featured products, B2B banner, social proof
- **Product pages** — 3-tab layout (Description / Specs / Shipping & Warranty), reactive SKU display
- **Category navigation** — Sidebar filters, 6-category header nav, subcategories
- **Search** — Meilisearch-powered with header modal + inline store search
- **WhatsApp button** — Floating CTA with click tracking
- **Free shipping bar** — Progress indicator toward $100 threshold

### SEO & AI Readiness
- **JSON-LD** — Product (with OfferShippingDetails + MerchantReturnPolicy), Organization, Breadcrumb
- **Product Feed** — RSS 2.0 XML at `/custom/product-feed` (231 items, Google Shopping + Meta compatible)
- **robots.txt** — AI bots explicitly allowed (GPTBot, ClaudeBot, PerplexityBot, Googlebot, Amazonbot)
- **Sitemap** — Dynamic XML via next-sitemap
- **H1 tags** — Every page, bilingual on store page
- **On-demand revalidation** — Medusa subscribers trigger cache invalidation

### Tracking & Attribution
- **GTM** — `@next/third-parties` GoogleTagManager, gated by env var
- **dataLayer events** — `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `contact_whatsapp`
- **Event deduplication** — Deterministic `event_id` seeds (SKU for view, cart.id for checkout, order.id for purchase)
- **Meta compatibility** — `_fbp`/`_fbc` cookies, `content_ids` in every event
- **UTM capture** — `_ergo_utm` cookie (30 days) captures all attribution params + device type + landing page
- **Session tracking** — `_ergo_pages` (pageview counter), `_ergo_viewed` (last 10 product SKUs)
- **Order attribution** — All tracking data saved to `cart.metadata` → copies to `order.metadata` automatically

### Order Metadata Structure
```json
{
  "attribution": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "standing_desks_panama",
    "fbclid": "abc123",
    "gclid": null,
    "ctwa_clid": null,
    "landing_page": "/pa/products/frame-double-bl",
    "referrer": "https://facebook.com",
    "device_type": "mobile",
    "session_pages": "4"
  },
  "products_viewed": ["frame-double-bl", "sobre-melamina", "chair-xtcv2"],
  "funnel_checkout_started": "2026-03-20T15:05:00Z"
}
```

### Commerce
- **Guest checkout** — No account creation required
- **ITBMS 7%** — Automatic Panama tax calculation
- **Shipping zones** — Retiro ($0), Panama City ($15, free >$100 + assembly), Provincias ($25)
- **Manual payment** — Placeholder until NMI integration
- **RBAC** — Custom middleware for admin vs sales associate permissions

---

## Development

### Prerequisites
- Node.js v20 LTS (required — v22+ breaks Medusa)
- Docker Desktop (for dev databases)
- pnpm 9+

### Quick Start
```bash
git clone https://github.com/lucaskardo/ergonomicadesk.git
cd ergonomicadesk
pnpm install

# Start infrastructure
docker compose up -d          # PostgreSQL + Redis + Meilisearch

# Start backend
cd apps/backend
cp .env.example .env.local    # Configure database URL, Redis, etc.
npx medusa db:migrate
npx medusa develop            # → http://localhost:9000

# Start storefront (new terminal)
cd apps/storefront
cp .env.example .env.local    # Configure Medusa URL, publishable key
pnpm dev                      # → http://localhost:8000
```

### Environment Variables

**Backend** (`apps/backend/.env.local`):
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa
REDIS_URL=redis://localhost:6379
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
STOREFRONT_URL=https://ergonomicadesk.com
```

**Storefront** (`apps/storefront/.env.local`):
```
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_BASE_URL=https://ergonomicadesk.com
NEXT_PUBLIC_DEFAULT_REGION=pa
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Useful Commands
```bash
pnpm dev                                    # Start all (Turborepo)
cd apps/backend && npx medusa develop       # Backend only
cd apps/storefront && pnpm dev              # Storefront only
cd apps/backend && npx medusa db:migrate    # Run migrations
```

### Health Checks
```bash
curl http://localhost:9000/health            # Backend
curl http://localhost:8000/pa                # Storefront
curl http://localhost:9000/custom/product-feed | head -20  # Product feed
```

---

## Roadmap

### 🔴 Phase 1 — Launch (Current)
> Goal: Live, accepting payments, running ads

| Task | Status | Priority |
|------|--------|----------|
| NMI Payment Provider (replace manual payment) | ⬜ TODO | **BLOCKER** |
| Product photos (organize, rename to SKU, upload to R2) | ⬜ TODO | **BLOCKER** |
| Cloudflare setup (domain, CDN, WAF, SSL) | ⬜ TODO | **BLOCKER** |
| Deploy to Railway (backend + storefront) | ⬜ TODO | **BLOCKER** |
| Resend email templates (order confirmation) | ⬜ TODO | High |
| Google Search Console + submit sitemap | ⬜ TODO | High |
| GTM container configuration | ⬜ TODO | High |

### 🟡 Phase 2 — Growth Engine (Post-Launch Week 1-2)
> Goal: Full ad attribution, automated catalog sync

| Task | Status |
|------|--------|
| Google Merchant Center + submit product feed | ⬜ TODO |
| Meta Commerce Manager + submit product feed | ⬜ TODO |
| Meta CAPI server-side (Medusa subscriber on `order.placed`) | ⬜ TODO |
| Google Ads Enhanced Conversions | ⬜ TODO |
| PostHog analytics setup | ⬜ TODO |
| QuickBooks → Medusa inventory sync (webhook + CDC) | ⬜ TODO |

### 🟢 Phase 3 — Optimization (Month 1-2)
> Goal: Higher conversion, better UX, operational tools

| Task | Status |
|------|--------|
| ROAS / attribution / funnel dashboard | ⬜ TODO |
| RBAC middleware enforcement (admin vs vendedora) | ⬜ TODO |
| Sentry error tracking | ⬜ TODO |
| Cloudflare Turnstile on checkout | ⬜ TODO |
| Cart abandonment emails (4h trigger) | ⬜ TODO |
| One-page checkout optimization (mobile) | ⬜ TODO |
| Google Pay / Apple Pay via NMI | ⬜ TODO |

### 🔵 Phase 4 — Content & Scale (Month 2-4)
> Goal: Content marketing, AI commerce, B2B

| Task | Status |
|------|--------|
| Sanity CMS integration (homepage, static pages) | ⬜ TODO |
| Blog + buying guides (SEO content) | ⬜ TODO |
| Agentic Commerce (ChatGPT merchant, Perplexity) | ⬜ TODO |
| B2B quote system + volume pricing | ⬜ TODO |
| Multi-language product descriptions (AI-generated) | ⬜ TODO |
| Uno Express international shipping integration | ⬜ TODO |

### 🟣 Phase 5 — Vision (6-12 months)
> Goal: Platform leadership in LATAM ergonomic furniture

| Task | Status |
|------|--------|
| AI-powered desk configurator (frame + top + accessories) | ⬜ TODO |
| AR product visualization (see desk in your space) | ⬜ TODO |
| Subscription model (ergonomic assessments, upgrades) | ⬜ TODO |
| Regional expansion (Costa Rica, Colombia) | ⬜ TODO |
| Marketplace for third-party ergonomic brands | ⬜ TODO |
| WhatsApp Commerce (catalog + checkout in WhatsApp) | ⬜ TODO |
| Smart inventory forecasting (ML on order patterns) | ⬜ TODO |

---

## Final Vision

ErgonomicaDesk becomes **the platform for ergonomic workspace solutions in Latin America** — not just a furniture store, but a complete ecosystem:

1. **Commerce** — Frictionless buying experience with full attribution from ad click to delivery
2. **Content** — The authority on ergonomic workspace setup (guides, comparisons, assessments)
3. **AI-Native** — Products discoverable through ChatGPT, Perplexity, Google AI — not just traditional search
4. **Data-Driven** — Every order carries its full attribution story (which ad, which landing page, which products viewed, how long to convert) enabling real-time ROAS optimization
5. **Omnichannel** — Web, WhatsApp, Instagram Shopping, Google Shopping — all feeding into one Medusa backend with unified inventory and order management
6. **B2B + B2C** — Same platform serves individual home office buyers and corporate procurement (50+ desk orders with volume pricing and NET-30 terms)

The technology choices (Medusa v2's workflow engine, Next.js RSC, server-side tracking) were made to support this vision from day one — not as afterthoughts bolted on later.

---

## Project Structure Details

### Backend Modules
- **RBAC** (`src/modules/rbac/`) — Roles and permissions for admin vs sales associate
- **Delivery Panama** (`src/modules/delivery-panama/`) — Panama-specific delivery zones and pricing
- **Resend** (`src/modules/resend/`) — Email notification provider

### Key Patterns
- **Workflows** for all business logic (Medusa's durable execution engine)
- **Server Components** by default in storefront (client components only for interactivity)
- **On-demand revalidation** via Medusa subscribers (no fixed ISR TTL)
- **Cart metadata** for attribution (copied to order on completion)
- **Product feed** as Medusa workflow + public API route (no auth required)

---

## Contributing

This is a private commercial project. For internal development guidelines, see `CLAUDE.md` in the project root.

## License

Proprietary. All rights reserved — Ergo Life SA, Panama.
