import { defineLive } from "next-sanity/live"
import { env } from "@lib/util/env"
import { client } from "../client"

// Fail fast when deployed to Railway without the required read token.
// NODE_ENV is "production" on both Railway and local `next build`, so we scope
// to Railway by checking RAILWAY_ENVIRONMENT_NAME (set by Railway on all deployments).
if (
  env.NODE_ENV === "production" &&
  env.RAILWAY_ENVIRONMENT_NAME &&
  !env.SANITY_API_READ_TOKEN
) {
  throw new Error(
    "SANITY_API_READ_TOKEN is required in production. " +
    "Create a Viewer token at manage.sanity.io → API → Tokens."
  )
}

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "2025-03-18" }),
  serverToken: env.SANITY_API_READ_TOKEN,
})
