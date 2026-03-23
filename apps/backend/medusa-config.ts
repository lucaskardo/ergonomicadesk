import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS || process.env.STORE_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },

  modules: [
    // ── Event Bus (Redis) ────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },

    // ── Cache (Redis) ────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },

    // ── Workflow Engine (Redis) ───────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.REDIS_URL,
        },
      },
    },

    // ── Locking (Redis) ──────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },

    // ── File Storage ─────────────────────────────────────────────────────────
    // Dev: no file provider configured — Medusa defaults to local storage.
    // Production: Cloudflare R2 (S3-compatible).
    ...(process.env.NODE_ENV === "production"
      ? [
          {
            resolve: "@medusajs/medusa/file",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/file-s3",
                  id: "r2",
                  options: {
                    file_url: process.env.CLOUDFLARE_R2_PUBLIC_URL,
                    access_key_id: process.env.CLOUDFLARE_R2_ACCESS_KEY,
                    secret_access_key: process.env.CLOUDFLARE_R2_SECRET_KEY,
                    region: "auto",
                    bucket: process.env.CLOUDFLARE_R2_BUCKET,
                    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
                  },
                },
              ],
            },
          },
        ]
      : []),

    // ── Notifications (Resend) ───────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },

    // ── RBAC (custom roles & permissions) ────────────────────────────────────
    { resolve: "./src/modules/rbac" },

    // ── Delivery Panama (zonas de entrega) ────────────────────────────────────
    { resolve: "./src/modules/delivery-panama" },

    // ── NMI Payment (data models: intents + attempt logs) ────────────────────
    { resolve: "./src/modules/nmi-payment" },

    // ── NMI Payment Provider ─────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/nmi-provider",
            id: "nmi",
            options: {
              securityKey: process.env.NMI_SECURITY_KEY,
              tokenizationKey: process.env.NMI_TOKENIZATION_KEY,
            },
          },
        ],
      },
    },
  ],

  plugins: [
    // ── Meilisearch ─────────────────────────────────────────────────────────
    {
      resolve: "@rokmohar/medusa-plugin-meilisearch",
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST,
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: [
                "title",
                "description",
                "variant_sku",
                "collection_title",
                "type_value",
                "tags",
              ],
              displayedAttributes: [
                "id",
                "title",
                "handle",
                "thumbnail",
                "variants",
                "collection_id",
                "type_id",
                "tags",
                "status",
              ],
            },
            primaryKey: "id",
          },
        },
      },
    },
  ],
})
