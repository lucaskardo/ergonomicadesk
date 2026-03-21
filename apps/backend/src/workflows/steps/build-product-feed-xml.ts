import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import type { FeedItem } from "./get-product-feed-items"

type Input = {
  items: FeedItem[]
}

export const buildProductFeedXmlStep = createStep(
  "build-product-feed-xml",
  async ({ items }: Input) => {
    const now = new Date().toUTCString()
    const storefrontUrl =
      process.env.STOREFRONT_URL || "https://ergonomicadesk.com"

    const itemsXml = items
      .map((item) => {
        const additionalImages = item.additional_image_links
          .map((url) => `    <g:additional_image_link>${url}</g:additional_image_link>`)
          .join("\n")

        return `  <item>
    <g:id>${item.id}</g:id>
    <g:title>${item.title}</g:title>
    <g:description>${item.description}</g:description>
    <g:link>${item.link}</g:link>
    <g:image_link>${item.image_link}</g:image_link>
${additionalImages ? additionalImages + "\n" : ""}    <g:price>${item.price}</g:price>
    <g:availability>${item.availability}</g:availability>
    <g:item_group_id>${item.item_group_id}</g:item_group_id>
    <g:condition>${item.condition}</g:condition>
    <g:brand>${item.brand}</g:brand>
    <g:google_product_category>${item.google_product_category}</g:google_product_category>
${item.product_type ? `    <g:product_type>${item.product_type}</g:product_type>\n` : ""}${item.color ? `    <g:color>${item.color}</g:color>\n` : ""}${item.size ? `    <g:size>${item.size}</g:size>\n` : ""}${item.custom_label_0 ? `    <g:custom_label_0>${item.custom_label_0}</g:custom_label_0>\n` : ""}    <g:shipping>
      <g:country>PA</g:country>
      <g:service>Standard</g:service>
      <g:price>${item.shipping_price}</g:price>
    </g:shipping>
    <g:tax>
      <g:country>PA</g:country>
      <g:rate>${item.tax_rate}</g:rate>
      <g:tax_ship>no</g:tax_ship>
    </g:tax>
  </item>`
      })
      .join("\n")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ErgonomicaDesk — Feed de Productos</title>
    <link>${storefrontUrl}</link>
    <description>Catálogo de muebles ergonómicos de oficina — ErgonomicaDesk Panamá</description>
    <lastBuildDate>${now}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`

    return new StepResponse({ xml })
  }
)
