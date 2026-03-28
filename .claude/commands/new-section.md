Crear una nueva sección para el homepage page builder de Sanity.

ANTES de implementar, preguntar al usuario:
1. ¿Cómo se llama la sección? (ej: "testimonialsSection")
2. ¿Qué campos necesita? (título, imagen, CTA, items, etc.)
3. ¿Tiene estado dark/light?

Pasos de implementación:
1. Schema Sanity: src/sanity/schemas/blocks/[nombre]Section.ts — usar defineType, defineField, localizedString para textos bilingües
2. Registrar: agregar import + export en src/sanity/schemas/index.ts
3. Homepage array: agregar defineArrayMember({ type: "[nombre]Section" }) en homepage.ts
4. Componente React: src/modules/home/components/[nombre]/index.tsx — aceptar props lang, countryCode, sanityData opcional
5. Switch case: agregar case "[nombre]Section" en homepage.tsx PageBuilder
6. GROQ projection: agregar projection en queries.ts dentro de HOMEPAGE_QUERY para el nuevo tipo
7. Build: cd apps/storefront && npx next build
8. Commit y push
