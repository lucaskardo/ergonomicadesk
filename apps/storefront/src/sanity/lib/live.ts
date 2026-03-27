import { defineLive } from "next-sanity/live"
import { client } from "../client"

// Fail fast when deployed to Railway without the required read token.
// NODE_ENV is "production" on both Railway and local `next build`, so we scope
// to Railway by checking RAILWAY_ENVIRONMENT_NAME (set by Railway on all deployments).
if (
  process.env.NODE_ENV === "production" &&
  process.env.RAILWAY_ENVIRONMENT_NAME &&
  !process.env.SANITY_API_READ_TOKEN
) {
  throw new Error(
    "SANITY_API_READ_TOKEN is required in production. " +
    "Create a Viewer token at manage.sanity.io → API → Tokens."
  )
}

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "2025-03-18" }),
  // serverToken: used for server-side Live Content API fetches
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // browserToken omitted — no visual editing / Draft Mode in published-only mode
})
