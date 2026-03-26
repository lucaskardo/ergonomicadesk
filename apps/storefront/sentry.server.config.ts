import * as Sentry from "@sentry/nextjs"

const isProd = process.env.NODE_ENV === "production"

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: isProd ? 0.1 : 1.0,
    sendDefaultPii: false,
    debug: !isProd,
  })
}
