import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { apiVersion, dataset, projectId } from "./src/sanity/env"
import { schemas } from "./src/sanity/schemas"
import { structure } from "./src/sanity/desk"

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
  },
})
