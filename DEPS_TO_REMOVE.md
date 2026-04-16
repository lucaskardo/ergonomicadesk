# Obsolete dependencies — manual removal

S38 audited `apps/storefront/package.json` and identified **6 unused
dependencies** that ship with the storefront bundle but have zero
imports in the source, configs, or build pipeline.

> **Why this file exists:** Claude is constrained from running
> `pnpm install`/`pnpm remove` per the project's absolute rules
> (CLAUDE.md). The cleanup is left for a single manual run by Lucas.

---

## Run this once

```bash
cd /Users/lucaskay/Desktop/ergonomicadesk
pnpm --filter @ergonomicadesk/storefront remove pg @types/pg webpack @babel/core babel-loader @types/react-instantsearch-dom
```

## Verify

```bash
pnpm install
cd apps/storefront && npx next build
```

Then confirm zero imports leak through:

```bash
grep -rn "from ['\"]\\(pg\\|webpack\\|@babel/core\\|babel-loader\\|react-instantsearch-dom\\)['\"]" apps/storefront/src
# → 0 matches
```

If build passes and grep is clean, delete this file:

```bash
git rm DEPS_TO_REMOVE.md
git commit -m "chore: remove unused dependencies (S38)"
git push origin main
```

---

## Per-dep evidence (collected 2026-04-16)

Each dep was checked against `apps/storefront/src/**`, all root configs
(`tailwind.config.js`, `postcss.config.js`, `sentry.*.config.ts`,
`sanity.config.ts`, `vitest.config.ts`, `eslint.config.mjs`,
`next.config.ts`), AND the GitNexus knowledge graph (1792 symbols, 3560
edges).

### pg / @types/pg
- **Why suspect:** PostgreSQL client. Used by Medusa **backend**, not
  by the **storefront** Next.js app.
- **Grep evidence:**
  ```bash
  grep -rn "from ['\"]pg['\"]\|require(['\"]pg['\"]" apps/storefront/src
  # → 0 matches
  ```
- **Nexus evidence:** `MATCH (n) WHERE n.name CONTAINS "pg"` returned no
  matches in storefront-scoped nodes.

### webpack / @babel/core / babel-loader
- **Why suspect:** Next.js 16 uses its own bundler (Turbopack/SWC).
  Webpack and Babel are not used directly by storefront source.
- **Grep evidence:**
  ```bash
  grep -rn "webpack\|@babel/core\|babel-loader" \
    apps/storefront/{tailwind.config.js,postcss.config.js,sentry.*.config.ts,sanity.config.ts,vitest.config.ts,eslint.config.mjs,next.config.ts}
  # → 0 matches
  ```
- **Nexus evidence:** No nodes match these names in the storefront
  index.

### @types/react-instantsearch-dom
- **Why suspect:** Algolia React InstantSearch — confirmed unused
  (storefront uses Meilisearch directly via `search-modal/index.tsx`,
  not InstantSearch). The `@types/*` package only matters if
  `react-instantsearch-dom` itself is installed; it isn't in the
  imports.
- **Grep evidence:**
  ```bash
  grep -rn "react-instantsearch" apps/storefront/src
  # → 0 matches
  ```

---

## Risk assessment

- **Removal is reversible**: `pnpm install` after `git checkout` of
  `package.json`/`pnpm-lock.yaml` restores everything.
- **No runtime side-effects expected**: zero imports means tree-shaking
  already excludes these from the bundle. Removal only shrinks
  `node_modules` and `pnpm-lock.yaml`, not the shipped JS.
- **If `pnpm remove` reports "not found"**: dep was already absent at
  the workspace level — that's fine, skip and continue.
- **If build fails post-remove**: a transitive consumer needed the dep.
  Restore via `git checkout package.json pnpm-lock.yaml && pnpm install`
  and ping me — we'll narrow down which dep was the false positive.
