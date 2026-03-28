---
name: commercial-section
description: Use when working on the commercial/B2B section — sectors, spaces, architecture, or any file in src/modules/commercial/ or routes containing /comercial
---

## Architecture — 3 levels (phased)
- **Phase 1 (current):** Sector as page, spaces as sections within sector page
- Phase 2 (future): /pa/comercial/[sector]/[espacio] — individual space pages
- Phase 3 (future): /pa/comercial/[sector]/[espacio]/[tipo] — product types with Medusa products

## 4 sectors
| Sector | Slug | Spaces |
|--------|------|--------|
| Oficinas Corporativas | oficinas | Estaciones de trabajo, Salas de reuniones, Oficinas privadas, Lounge, Recepción, Cafetería, Áreas de colaboración |
| Educación | educacion | Aulas, Laboratorios, Bibliotecas, Áreas comunes, Oficinas administrativas |
| Horeca | horeca | Lobby, Restaurantes, Cafeterías, Salas de eventos, Áreas lounge |
| Salud | salud | Salas de espera, Consultorios, Áreas administrativas |

## Key rules
- Products live in Medusa (once), editorial context in Sanity (per sector)
- One product can appear in multiple sectors with different context
- NOT cart-based ecommerce — lead generation with WhatsApp CTA
- Route helper: commercialPath(slug?) in routes.ts
- Schema: commercialSector (document type, not singleton)
- Seed script: scripts/seed-comercial.mjs (needs Editor token)

## Existing files
- Landing: src/app/[countryCode]/(main)/comercial/page.tsx
- Sector page: src/app/[countryCode]/(main)/comercial/[slug]/page.tsx
- EN re-exports: src/app/[countryCode]/en/(main)/comercial/
- Homepage preview: src/modules/home/components/commercial-preview/
- FAQ component: src/modules/commercial/components/faq-accordion.tsx
- Sanity schema: src/sanity/schemas/commercialSector.ts

## See ARQUITECTURA_COMERCIAL.md for full taxonomy
