@AGENTS.md

## Reglas del storefront (complementan el CLAUDE.md raíz)

### SEO — toda página nueva DEBE tener:
- URLs via helpers de `src/lib/util/routes.ts` — nunca hardcodear `/pa/` o dominios
- Metadata via `buildMetadata()` de `src/lib/util/metadata.ts` — nunca construir Metadata manualmente
- `<BreadcrumbJsonLd>` de `@modules/common/components/json-ld/breadcrumb`
- JSON-LD por tipo: ProductJsonLd (PDP), ArticleJsonLd (blog), FAQPageJsonLd (FAQ)
- JSON-LD = server-rendered RSC, nunca en client components
- Ruta EN = re-export: `export { default, generateMetadata } from "../../../(main)/page"`
- Entrada en `src/app/sitemap.ts` con alternates hreflang

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
