# CLAUDE.md — Ergonómica Ecommerce

## ⛔ REGLAS ABSOLUTAS (leer PRIMERO, violar = proyecto roto)

### node_modules y dependencias
- NUNCA correr `pnpm install`, `pnpm add`, `pnpm remove`, `npm install`, `yarn install`
- NUNCA eliminar node_modules de ninguna forma (`rm -rf`, `mv`, nada)
- NUNCA modificar `package.json` (dependencias), `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- NUNCA modificar archivos dentro de node_modules
- Si un import falla con "Cannot find module" → PARAR y reportar al usuario

### Procesos y servidores
- NUNCA matar procesos en puertos 8000 (storefront) o 9000 (backend)
- NUNCA correr `pnpm dev`, `next dev`, `medusa develop`, ni iniciar dev servers
- NUNCA correr `rm -rf .next` ni `rm -rf .medusa`
- Si algo necesita reiniciarse → decirle al usuario

### Imports en scripts .mjs
- Usar `next-sanity` para createClient, NO `@sanity/client` (symlink issue en pnpm hoisted)
- Verificar que imports existen ANTES de usarlos: `ls node_modules/PACKAGE 2>/dev/null`

### Verificación obligatoria
- Al final de CADA tarea: `cd apps/storefront && npx next build`
- NUNCA decir "listo" sin haber corrido y confirmado que el build pasa
- Un commit por tarea, SIEMPRE `git push origin main` al final

## Metodología de trabajo

### Plan mode por defecto
- Modo plan para CUALQUIER tarea de 3+ pasos o con decisiones arquitectónicas
- Si algo sale mal → PARAR y re-planificar, no seguir empujando
- Leer docs oficiales (context7 MCP) antes de implementar

### Self-improvement
- Después de cualquier corrección del usuario → agregar lección a "Lecciones aprendidas" abajo
- Escribir regla que prevenga el mismo error en el futuro

### Lecciones aprendidas (actualizar cuando se aprenda algo nuevo)
- node_modules se corrompe con cualquier package manager command — NUNCA hacerlo
- En scripts .mjs del monorepo, `next-sanity` tiene createClient, `@sanity/client` no está symlinked
- Token SANITY_API_READ_TOKEN = lectura. Para escritura = Editor token temporal
- Sin --turbopack: Turbopack no infiere bien el root del monorepo pnpm
- Si backend no arranca con "Pg connection failed" = PostgreSQL/Docker no está corriendo, no es bug
- Verificar imports con `find` o `ls` antes de usarlos en scripts nuevos

---

## Proyecto

Ecommerce de mobiliario ergonómico de oficina. Marca: Ergonómica (@ergonomicadesk).
- Dominio: ergonomicadesk.com
- Mercado: Panamá. Moneda: USD. Bilingüe: ES (primario) + EN
- Guest checkout only (sin cuentas de cliente)
- 231 productos en 6 categorías

## Stack

- **Monorepo:** Turborepo + pnpm workspaces (`.npmrc` con `shamefully-hoist=true`)
- **Frontend:** Next.js 16 App Router + RSC + Tailwind CSS v3 (port 8000)
- **Backend:** Medusa.js v2.13+ (port 9000)
- **CMS:** Sanity.io (project 7b580fxk, dataset production)
- **DB:** PostgreSQL 16 | **Cache:** Redis 7 | **Search:** Meilisearch
- **Payments:** NMI (@nmipayments/nmi-pay-react)
- **Email:** Resend (via order-confirmation subscriber)
- **Tracking:** GTM + GA4 + Meta CAPI + PostHog
- **Hosting:** Railway (prod), Docker Compose (dev)

## Estructura de archivos clave

apps/backend/                    → Medusa v2 (port 9000)
  src/api/custom/                → Rutas públicas (sin auth)
  src/api/store/                 → Rutas store (requiere publishable-api-key)
  src/api/admin/                 → Rutas admin (requiere auth)
  src/workflows/                 → Workflows custom
  src/modules/                   → Módulos custom (delivery-panama, rbac, resend)
apps/storefront/                 → Next.js 16 (port 8000)
  src/app/[countryCode]/(main)/  → Rutas ES
  src/app/[countryCode]/en/      → Rutas EN (re-exports)
  src/lib/data/                  → Server-side fetch (cart, products, regions)
  src/lib/util/routes.ts         → ÚNICA fuente de verdad para URLs
  src/lib/util/metadata.ts       → buildMetadata() para SEO
  src/lib/tracking/              → dataLayer events (client-only)
  src/sanity/                    → Cliente, queries, schemas, image builder
  src/modules/home/              → Componentes del homepage (page builder)
  src/modules/commercial/        → Sección comercial

## Reglas de negocio

- ITBMS 7% Panama — precios SIN tax, calculado en checkout
- Envío gratis + ensamblaje en Ciudad de Panamá cuando subtotal > $100
- Shipping: Retiro ($0), Panama City ($15, free >$100), Provincias ($25)
- 7 días devolución. 1-5 años garantía por producto
- WhatsApp: +507 6953-3776
- Precios en CENTAVOS en Medusa (29900 = $299.00)
- Inventario: QuickBooks es source of truth

## Sanity CMS

- Page builder: homepage con sections[] (hero, trustBar, categoryGrid, featuredProducts, buildYourDesk, testimonials, ctaImage, blogPreview, newsletter)
- Singletons protegidos: siteSettings, announcementBar, headerNav, footerNav, homepage
- Localización: field-level {es, en} para bloques; documento por idioma para blog
- Revalidación: webhook POST /api/sanity/revalidate
- Queries: GROQ en src/sanity/lib/queries.ts con projecciones explícitas

## Sección Comercial

- 3 niveles: Sector → Espacio → Tipo de producto
- **Fase 1 (actual):** solo sectores como páginas, espacios como secciones dentro
- Fase 2 (futuro): `/pa/comercial/[sector]/[espacio]`
- Fase 3 (futuro): tipos de producto con productos de Medusa
- Un producto puede aparecer en múltiples sectores con contexto editorial diferente
- Schema: `commercialSector` (document type, no singleton)
- NO es ecommerce de carrito — generación de leads con CTA a WhatsApp
- Route helper: `commercialPath(slug?)` en routes.ts

## Patrones obligatorios

### Storefront
- Server components por defecto — `"use client"` solo cuando necesario
- URLs: SIEMPRE usar helpers de `routes.ts`, nunca hardcodear `/pa/` o dominios
- Metadata: SIEMPRE usar `buildMetadata()` de `metadata.ts`
- JSON-LD: server-rendered (RSC), nunca en client components
- EN routes: re-export `export { default, generateMetadata } from "..."`
- Tracking: client-only, verificar `typeof window !== "undefined"`

### Medusa backend
- Workflows: `createStep` + `createWorkflow` de `@medusajs/framework/workflows-sdk`
- API: `/store/*` = publishable-api-key, `/admin/*` = auth, `/custom/*` = público
- Payment providers fetch: SIEMPRE `cache: "no-store"`
- Cart metadata: set ANTES de `cart.complete` → se copia a order.metadata
- Módulos: underscores no hyphens. Node.js v20 LTS obligatorio

## Bundles (post-launch)

- Bundle = producto en Medusa con `metadata.bundle_type = "bundle"`
- NO tiene SKU propio — solo para display/PDP
- `metadata.bundle_items = ["sku1", "sku2"]`
- Al carrito: SKUs individuales como line items separados (contabilidad)
- Descuento proporcionalmente a cada SKU

## NMI Payments

- onChange (NO onPay) para 3DS
- Amount: STRING "299.00" no number
- Backend POST a transact.php: `application/x-www-form-urlencoded` (NO JSON)
- Response: key=value → URLSearchParams
- Después de pago fallido: `resetFields()` en ref

## Dev Start

docker compose up -d                                    # PostgreSQL + Redis + Meilisearch
cd apps/backend && npx medusa develop                   # Backend :9000
cd apps/storefront && npx next dev -p 8000              # Storefront :8000 (sin turbopack)

## Gotchas

- Region middleware: puede 404 si backend lento — tiene retry + fallback
- Product feed: `/custom/` no `/store/` (Google no envía auth)
- Turbopack: no usar. turbopack.root configurado como fallback
- PostgreSQL debe estar corriendo antes del backend
