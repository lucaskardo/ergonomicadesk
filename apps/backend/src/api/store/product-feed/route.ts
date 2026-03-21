import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { generateProductFeedWorkflow } from "../../../workflows/generate-product-feed"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await generateProductFeedWorkflow(req.scope).run({
    input: { currency_code: "usd", country_code: "pa" },
  })

  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, max-age=21600")
  res.send(result.xml)
}
