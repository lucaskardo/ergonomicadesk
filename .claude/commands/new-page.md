Crear una nueva página con SEO completo.

ANTES de implementar, preguntar al usuario:
1. ¿Cuál es el slug/URL? (ej: "garantia")
2. ¿Título y descripción para SEO?
3. ¿Es contenido estático o dinámico (Sanity)?

Pasos de implementación:
1. Página ES: src/app/[countryCode]/(main)/[slug]/page.tsx
2. Metadata: usar buildMetadata() de @lib/util/metadata — incluir countryCode, lang, path
3. JSON-LD: agregar BreadcrumbJsonLd de @modules/common/components/json-ld/breadcrumb
4. JSON-LD específico si aplica: FAQPageJsonLd, ArticleJsonLd, etc.
5. Re-export EN: src/app/[countryCode]/en/(main)/[slug]/page.tsx → export { default, generateMetadata } from "..."
6. Route helper: si es ruta reutilizable, agregar función en routes.ts
7. Sitemap: agregar entrada en src/app/sitemap.ts con alternates hreflang
8. Build: cd apps/storefront && npx next build
9. Commit y push
