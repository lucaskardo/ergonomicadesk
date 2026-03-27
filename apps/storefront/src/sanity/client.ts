import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "./env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // stega (visual editing overlays) only when explicitly enabled — not needed for published-only mode
  stega: process.env.SANITY_VISUAL_EDITING === "true"
    ? { studioUrl: "/studio" }
    : false,
})
