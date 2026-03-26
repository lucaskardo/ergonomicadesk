import * as Sentry from "@sentry/node"

/**
 * Medusa v2 instrumentation hook — called at startup before routes are registered.
 *
 * Sentry v8 uses OpenTelemetry under the hood. Since Medusa's OTel is not enabled
 * (see commented block below), there is no conflict. Sentry captures unhandled
 * exceptions, request errors, and custom events via logger middleware.
 *
 * Required env vars:
 *   SENTRY_DSN  — Sentry project DSN (Sentry is disabled if not set)
 *
 * Optional:
 *   SENTRY_TRACES_SAMPLE_RATE — float 0–1 (default: 0.1 in prod, 1.0 otherwise)
 */
export function register() {
  if (!process.env.SENTRY_DSN) return
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production"
      ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1)
      : 1.0,
    // Auto-instrument HTTP requests and Node.js APIs
    integrations: [Sentry.httpIntegration()],
  })
}

// ── Medusa OpenTelemetry (disabled — uncomment to enable alongside Sentry) ────
// import { registerOtel } from "@medusajs/medusa"
// import { ZipkinExporter } from "@opentelemetry/exporter-zipkin"
// const exporter = new ZipkinExporter({ serviceName: "ergonomicadesk-backend" })
// export function register() {
//   registerOtel({ serviceName: "ergonomicadesk-backend", exporter, instrument: { http: true, workflows: true, query: true } })
// }
