import * as Sentry from "@sentry/nextjs"

const isProd = process.env.NODE_ENV === "production"

Sentry.init({
  dsn: "https://dc13a43b3cc859ca20a5d09b8d0d7d44@o4511107177250816.ingest.us.sentry.io/4511107193634816",

  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Route Sentry events through Next.js server to bypass ad-blockers
  tunnel: "/monitoring",

  sendDefaultPii: false,

  // Only enable debug in dev
  debug: !isProd,
})
