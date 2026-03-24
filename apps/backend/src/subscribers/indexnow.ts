import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY
const STOREFRONT_URL = process.env.STOREFRONT_URL || "https://ergonomicadesk.com"

export default async function indexNowHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  if (!INDEXNOW_KEY) return

  try {
    const productModule = container.resolve("product")
    const product = await productModule.retrieveProduct(event.data.id)

    if (!product?.handle) return

    const host = new URL(STOREFRONT_URL).hostname
    const urlList = [
      `${STOREFRONT_URL}/pa/products/${product.handle}`,
      `${STOREFRONT_URL}/pa/en/products/${product.handle}`,
    ]

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${STOREFRONT_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    })
  } catch (error) {
    console.error("IndexNow notification failed:", error)
  }
}

export const config: SubscriberConfig = {
  event: ["product.updated", "product.created"],
}
