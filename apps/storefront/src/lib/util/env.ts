import "server-only"
import { z } from "zod"

const optionalUrl = z
  .string()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined))

const schema = z.object({
  // Required server vars
  MEDUSA_BACKEND_URL: z.string().url("MEDUSA_BACKEND_URL must be a valid URL"),

  // Required client vars (NEXT_PUBLIC_ — inlined at build time)
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_BASE_URL: z.string().url("NEXT_PUBLIC_BASE_URL must be a valid URL"),
  NEXT_PUBLIC_DEFAULT_REGION: z.string().min(1, "NEXT_PUBLIC_DEFAULT_REGION is required"),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z
    .string()
    .min(1, "NEXT_PUBLIC_SANITY_PROJECT_ID is required"),
  NEXT_PUBLIC_SANITY_DATASET: z
    .string()
    .min(1, "NEXT_PUBLIC_SANITY_DATASET is required"),

  // Optional server vars
  SANITY_API_READ_TOKEN: z.string().optional(),
  SANITY_REVALIDATE_SECRET: z.string().optional(),
  SANITY_VISUAL_EDITING: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  RAILWAY_ENVIRONMENT_NAME: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Optional client vars (legacy aliases + 3rd-party integrations)
  NEXT_PUBLIC_MEDUSA_BACKEND_URL: optionalUrl,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  NEXT_PUBLIC_NMI_TOKENIZATION_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_MEILISEARCH_HOST: optionalUrl,
  NEXT_PUBLIC_MEILISEARCH_API_KEY: z.string().optional(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n")
  throw new Error(
    `[env] Invalid or missing environment variables:\n${issues}\n\nCheck apps/storefront/.env.local against src/lib/util/env.ts schema.`
  )
}

export const env = parsed.data

export const getBaseURL = () => env.NEXT_PUBLIC_BASE_URL
