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
  src/app/[countryCode]/(main)/  → Rutas ES y EN (mismo source, idioma resuelto por proxy + getLang)
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

## Contexto especializado (skills)
Para Sanity CMS, sección comercial, NMI payments, bundles, tracking, o backend Medusa → Claude carga automáticamente el skill relevante de `.claude/skills/`. No necesitan estar en este archivo.

## Dev Start

docker compose up -d                                    # PostgreSQL + Redis + Meilisearch
cd apps/backend && npx medusa develop                   # Backend :9000
cd apps/storefront && npx next dev -p 8000              # Storefront :8000 (sin turbopack)

## Gotchas

- Region middleware: puede 404 si backend lento — tiene retry + fallback
- Product feed: `/custom/` no `/store/` (Google no envía auth)
- Turbopack: no usar. turbopack.root configurado como fallback
- PostgreSQL debe estar corriendo antes del backend

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **ergonomicadesk** (1736 symbols, 3428 relationships, 121 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/ergonomicadesk/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/ergonomicadesk/context` | Codebase overview, check index freshness |
| `gitnexus://repo/ergonomicadesk/clusters` | All functional areas |
| `gitnexus://repo/ergonomicadesk/processes` | All execution flows |
| `gitnexus://repo/ergonomicadesk/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
