import { defineLive } from "next-sanity/experimental/live"
import { client } from "../client"

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    // Live API requires a token with viewer permissions when the dataset is private.
    // For public datasets this can be omitted.
    token: process.env.SANITY_API_TOKEN,
  }),
})
