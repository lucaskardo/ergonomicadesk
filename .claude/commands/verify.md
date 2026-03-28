Verificar que el proyecto compila y está sano.

Paso 1 — Build:
```bash
cd apps/storefront && npx next build
```
Si falla, leer el error y arreglar sin tocar node_modules ni package.json.

Paso 2 — Buscar residuos peligrosos:
```bash
grep -rn "TODO\|FIXME\|HACK\|XXX" apps/storefront/src/ apps/backend/src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | head -20
```

Paso 3 — Reportar: build status, residuos encontrados, y si hay algo que arreglar.
