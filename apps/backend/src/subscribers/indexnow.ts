import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY
const STOREFRONT_URL = process.env.STOREFRONT_URL || "https://ergonomicadesk.com"

export default async function indexNowHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!INDEXNOW_KEY) {
    logger.info("[indexnow] INDEXNOW_API_KEY not set — skipping")
    return
  }

  const productId = event.data.id

  try {
    const productModule = container.resolve("product")
    const product = await productModule.retrieveProduct(productId)

    if (!product?.handle) {
      logger.warn(`[indexnow] Product ${productId} has no handle — skipping IndexNow submission`)
      return
    }

    const host = new URL(STOREFRONT_URL).hostname
    const urlList = [
      `${STOREFRONT_URL}/pa/productos/${product.handle}`,
      `${STOREFRONT_URL}/pa/en/productos/${product.handle}`,
    ]

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${STOREFRONT_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    })

    if (!response.ok) {
      logger.warn(`[indexnow] IndexNow API returned ${response.status} for product ${productId} (handle: ${product.handle})`)
    } else {
      logger.info(`[indexnow] Submitted ${urlList.length} URLs for product ${productId} (handle: ${product.handle})`)
    }
  } catch (err: any) {
    logger.error(`[indexnow] Failed to submit product ${productId} to IndexNow: ${err?.message ?? err} (code: ${err?.code ?? "none"})`)
  }
}

export const config: SubscriberConfig = {
  event: ["product.updated", "product.created"],
}
