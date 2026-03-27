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

## Reglas de node_modules y dev server (CRÍTICO)
- NUNCA correr `pnpm install`, `npm install`, `pnpm add`, o cualquier package manager command. Si necesitás un paquete nuevo, decilo y el usuario lo instala.
- NUNCA correr `rm -rf node_modules`. Si necesitás limpiar, usá `mv node_modules /tmp/trash_$(date +%s)` y avisá al usuario que corra `pnpm install --force` después.
- NUNCA matar el dev server del storefront (puerto 8000) ni el backend (puerto 9000). Son procesos del usuario.
- Si necesitás reiniciar el storefront para probar cambios, decí "reiniciá el storefront" y dejá que el usuario lo haga.
- Si `next build` necesita correr, usá `npx next build` — no mates procesos primero.

## ⛔ REGLAS ABSOLUTAS — VIOLACIÓN = PROYECTO ROTO

### node_modules y package manager
- NUNCA correr `pnpm install`, `pnpm add`, `pnpm remove`, `npm install`, `yarn install`, ni NINGÚN comando de package manager
- NUNCA correr `rm -rf node_modules` ni eliminar node_modules de ninguna forma
- NUNCA modificar `package.json` (dependencias), `pnpm-lock.yaml`, ni `pnpm-workspace.yaml`
- Si un import falla con "Cannot find module", PARAR y reportar al usuario. NO intentar instalar nada

### Dev servers y procesos
- NUNCA matar procesos en puertos 8000 o 9000
- NUNCA correr `pnpm dev`, `next dev`, `medusa develop`, ni iniciar dev servers
- NUNCA correr `rm -rf .next` ni `rm -rf .medusa`
- Para tests usar puertos 8001-8099

### Imports en scripts .mjs
- Usar `next-sanity` para createClient, NO `@sanity/client`
- Verificar que imports existen ANTES de usarlos

### Verificación de tareas
- Al final de cada tarea correr `cd apps/storefront && npx next build`
- Si el build falla, arreglar. Si no se puede, reportar exactamente qué falló
- NUNCA reportar "todo listo" sin haber corrido el build
