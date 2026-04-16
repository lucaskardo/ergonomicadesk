// NOTE: Imported by sanity.config.ts which is bundled for the browser (Sanity
// Studio). We can't import @lib/util/env (server-only). NEXT_PUBLIC_* vars are
// inlined by Next at build time and validated centrally by env.ts on server boot.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7b580fxk"
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
export const apiVersion = "2025-03-18"
