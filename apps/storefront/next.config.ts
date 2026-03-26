import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import path from "path"

const isDev = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  // Explicitly set monorepo root so Turbopack resolves hoisted pnpm packages correctly.
  // Without this, Turbopack infers the root incorrectly and emits false "Module not found" errors.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    qualities: [50, 75],
    ...(isDev && { dangerouslyAllowLocalIP: true }),
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
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
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.meilisearch.com https://challenges.cloudflare.com https://secure.networkmerchants.com https://applepay.cdn-apple.com`,
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
              "img-src 'self' data: https: blob:",
              `connect-src 'self'${isDev ? " http://localhost:9000" : ""} https://*.google-analytics.com https://*.analytics.google.com https://*.facebook.com https://api.resend.com https://graph.facebook.com https://*.meilisearch.com https://challenges.cloudflare.com https://o4511107177250816.ingest.us.sentry.io https://secure.nmi.com https://secure.networkmerchants.com https://*.sanity.io`,
              "font-src 'self' https://api.fontshare.com https://cdn.fontshare.com",
              "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com https://connect.facebook.net https://secure.nmi.com https://*.sanity.io",
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

})
