import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "./env"

// SANITY_VISUAL_EDITING read directly: this module is bundled into Sanity Studio
// (browser context). Server validation lives in @lib/util/env.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: process.env.SANITY_VISUAL_EDITING === "true"
    ? { studioUrl: "/studio" }
    : false,
})
