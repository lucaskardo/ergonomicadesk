@AGENTS.md

## Reglas del storefront (complementan el CLAUDE.md raíz)

### SEO — toda página nueva DEBE tener:
- URLs via helpers de `src/lib/util/routes.ts` — nunca hardcodear `/pa/` o dominios
- Metadata via `buildMetadata()` de `src/lib/util/metadata.ts` — nunca construir Metadata manualmente
- `<BreadcrumbJsonLd>` de `@modules/common/components/json-ld/breadcrumb`
- JSON-LD por tipo: ProductJsonLd (PDP), ArticleJsonLd (blog), FAQPageJsonLd (FAQ)
- JSON-LD = server-rendered RSC, nunca en client components
- Entrada en `src/app/sitemap.ts` con alternates hreflang

### i18n
- Una sola página `(main)/X/page.tsx` por ruta — ES y EN se sirven desde el mismo source
- Server component: detectar idioma con `await getLang()` de `@lib/i18n`
- Client component: `useLang()` de `@lib/i18n/context`
- Metadata: usar `buildMetadata({ ..., lang })` o `lang === "en" ? "..." : "..."` inline
- El proxy reescribe `/[cc]/en/X` → `/[cc]/X` con header `x-lang: en` — la URL del browser NO cambia
- Hrefs internos: `LocalizedClientLink` ya prefija `/en` automáticamente cuando lang es EN
- NO crear árbol `app/[countryCode]/en/` — fue eliminado en S38, reintroducirlo regresa al bug `/pa/en/en/X`

### Tracking
- Todas las funciones en `src/lib/tracking/index.ts`
- Client-only: siempre `typeof window !== "undefined"`

### Homepage page builder
- Renderiza sections[] de Sanity via switch en `homepage.tsx`
- Si Sanity vacío → fallback a componentes hardcoded
- Tipos: heroSection, trustBarSection, categoryGridSection, featuredProductsSection, buildYourDeskSection, testimonialsSection, ctaImageSection, blogPreviewSection, newsletterSection
- Nuevo tipo = schema Sanity + componente React + case en switch + registro en homepage.ts

### Diseño UI
- Font display: Cabinet Grotesk
- Accent: #5BC0EB (sky-blue)
- Icons: Phosphor (duotone, #2A8BBF)
- Square corners en cards principales
- Mobile-first responsive
