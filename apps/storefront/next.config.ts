import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const isDev = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            // HSTS: force HTTPS for 1 year. preload + includeSubDomains once DNS is locked via Cloudflare.
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            // CSP: unsafe-inline/eval required by Next.js and GTM.
            // Tighten to nonce-based CSP post-launch if needed.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.meilisearch.com https://challenges.cloudflare.com`,
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.facebook.com https://api.resend.com https://graph.facebook.com https://*.meilisearch.com https://challenges.cloudflare.com https://o4511107177250816.ingest.us.sentry.io",
              "font-src 'self' https://api.fontshare.com https://cdn.fontshare.com",
              "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com https://connect.facebook.net",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: "torus-fh",
  project: "storefront",
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Route Sentry events through Next.js to bypass ad-blockers
  tunnelRoute: "/monitoring",

  // Upload source maps for readable stack traces in production
  sourcemaps: {
    disable: false,
  },

  silent: !process.env.CI,

  // Disable the Sentry wizard's automatic tree-shaking opt-out
  disableLogger: true,
})
