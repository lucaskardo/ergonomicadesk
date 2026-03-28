Auditar SEO de una página o del sitio completo.

Verificar para cada página indexable:
```bash
# Buscar páginas sin buildMetadata
grep -rn "export.*metadata\|generateMetadata" apps/storefront/src/app/ --include="*.tsx" | grep -v node_modules | grep -v "buildMetadata" | head -20

# Buscar hardcoded /pa/ en links
grep -rn '"/pa/' apps/storefront/src/ --include="*.tsx" | grep -v node_modules | grep -v routes.ts | head -20

# Buscar páginas sin BreadcrumbJsonLd
for f in $(find apps/storefront/src/app -name "page.tsx" -not -path "*/node_modules/*" -not -path "*/en/*"); do
  grep -L "BreadcrumbJsonLd" "$f" 2>/dev/null
done | head -20

# Buscar imágenes sin alt text
grep -rn "<img\|<Image" apps/storefront/src/ --include="*.tsx" | grep -v "alt=" | grep -v node_modules | head -10
```

Reportar: páginas sin metadata, links hardcodeados, páginas sin JSON-LD, imágenes sin alt.
