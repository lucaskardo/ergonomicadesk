import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { apiVersion, dataset, projectId } from "./src/sanity/env"
import { schemas } from "./src/sanity/schemas"
import { structure } from "./src/sanity/desk"

// These documents can only have a single instance — hide from "New document" menu
// and remove duplicate/delete actions so editors can't accidentally break them.
const SINGLETON_TYPES = new Set([
  "siteSettings",
  "announcementBar",
  "headerNav",
  "footerNav",
  "homepage",
])

export default defineConfig({
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemas,
    // Remove singleton types from the "New document" creation menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Remove "Duplicate" and "Delete" actions for singleton types
    actions: (prev, { schemaType }) => {
      if (!SINGLETON_TYPES.has(schemaType)) return prev
      return prev.filter(({ action }) => action !== "duplicate" && action !== "delete")
    },
  },
})
