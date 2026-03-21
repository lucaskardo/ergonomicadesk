import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { QueryContext } from "@medusajs/framework/utils"

type Input = {
  currency_code: string
  country_code: string
}

export type FeedItem = {
  id: string
  title: string
  description: string
  link: string
  image_link: string
  additional_image_links: string[]
  price: string
  availability: "in stock" | "out of stock"
  item_group_id: string
  condition: "new"
  brand: string
  google_product_category: string
  product_type: string
  color?: string
  size?: string
  custom_label_0?: string
  shipping_price: string
  tax_rate: string
}

const CATEGORY_MAP: Record<string, string> = {
  "standing-desks": "Furniture > Office Furniture > Desks",
  "chairs": "Furniture > Office Furniture > Office Chairs",
  "office": "Furniture > Office Furniture > Desks",
  "storage": "Furniture > Office Furniture",
  "accessories": "Office Supplies",
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function formatPrice(amount: number, currency: string): string {
  const value = (amount / 100).toFixed(2)
  return `${value} ${currency.toUpperCase()}`
}

function getCategoryMapping(categories: any[]): string {
  for (const cat of categories) {
    const handle = (cat.handle || "").toLowerCase()
    if (CATEGORY_MAP[handle]) return CATEGORY_MAP[handle]
    // Check parent
    const parentHandle = (cat.parent_category?.handle || "").toLowerCase()
    if (CATEGORY_MAP[parentHandle]) return CATEGORY_MAP[parentHandle]
  }
  return "Furniture > Office Furniture"
}

function getProductType(categories: any[]): string {
  return categories.map((c: any) => c.name).join(" > ")
}

function getOptionValue(variant: any, optionTitle: string): string | undefined {
  if (!variant.options) return undefined
  const opt = variant.options.find(
    (o: any) => o.option?.title?.toLowerCase() === optionTitle.toLowerCase()
  )
  return opt?.value
}

function fixImageUrl(url: string, backendPublicUrl: string): string {
  if (!url) return url
  // Replace localhost or 127.0.0.1 with the public backend URL
  return url.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, backendPublicUrl)
}

export const getProductFeedItemsStep = createStep(
  "get-product-feed-items",
  async (input: Input, { container }) => {
    const query = container.resolve("query")
    const storefrontUrl =
      process.env.STOREFRONT_URL || "https://ergonomicadesk.com"
    const backendPublicUrl =
      process.env.BACKEND_PUBLIC_URL || storefrontUrl

    const allProducts: any[] = []
    const limit = 100
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const { data: products } = await query.graph({
        entity: "product",
        fields: [
          "id",
          "title",
          "description",
          "handle",
          "thumbnail",
          "status",
          "images.*",
          "categories.*",
          "categories.parent_category.*",
          "variants.*",
          "variants.options.*",
          "variants.options.option.*",
          "variants.calculated_price.*",
          "variants.inventory_items.*",
          "variants.manage_inventory",
        ],
        filters: {
          status: "published",
        },
        context: {
          variants: {
            calculated_price: QueryContext({
              currency_code: input.currency_code,
            }),
          },
        },
        pagination: { limit, skip: offset },
      })

      allProducts.push(...products)
      hasMore = products.length === limit
      offset += limit
    }

    const items: FeedItem[] = []

    for (const product of allProducts) {
      const categories = product.categories || []
      const googleCategory = getCategoryMapping(categories)
      const productType = getProductType(categories)
      const extraImages = (product.images || [])
        .filter((img: any) => img.url !== product.thumbnail)
        .map((img: any) => img.url)

      for (const variant of product.variants || []) {
        const sku = variant.sku || `${product.id}-${variant.id}`
        const calculatedAmount =
          variant.calculated_price?.calculated_amount ?? 0
        const currencyCode =
          variant.calculated_price?.currency_code ?? input.currency_code

        // Determine availability: published products are "in stock" by default.
        // Only mark "out of stock" if inventory tracking is enabled AND we have
        // explicit quantity data (from location_levels) showing 0. This avoids
        // false "out of stock" when QuickBooks sync hasn't run yet.
        let availability: "in stock" | "out of stock" = "in stock"
        if (variant.manage_inventory === true) {
          const inventoryItems = variant.inventory_items || []
          if (inventoryItems.length > 0) {
            const totalQty = inventoryItems.reduce(
              (sum: number, ii: any) => {
                const qty = ii.stocked_quantity ?? ii.inventory?.stocked_quantity
                // Only subtract if we have a real numeric value (not null/undefined)
                return sum + (typeof qty === "number" ? qty : 1)
              },
              0
            )
            if (totalQty <= 0) availability = "out of stock"
          }
        }

        // Build title
        const variantTitle = variant.title || ""
        const isDefaultTitle =
          !variantTitle ||
          variantTitle.toLowerCase() === "default title" ||
          variantTitle === product.title
        const title = isDefaultTitle
          ? xmlEscape(product.title)
          : xmlEscape(`${product.title} — ${variantTitle}`)

        const color = getOptionValue(variant, "Color")
        const size =
          getOptionValue(variant, "Tamaño") ||
          getOptionValue(variant, "Tamano") ||
          getOptionValue(variant, "Size")

        items.push({
          id: xmlEscape(sku),
          title,
          description: xmlEscape(
            (product.description || product.title).slice(0, 5000)
          ),
          link: `${storefrontUrl}/pa/products/${product.handle}`,
          image_link: fixImageUrl(product.thumbnail || extraImages[0] || "", backendPublicUrl),
          additional_image_links: extraImages.slice(0, 10).map((u: string) => fixImageUrl(u, backendPublicUrl)),
          price: formatPrice(calculatedAmount, currencyCode),
          availability,
          item_group_id: product.id,
          condition: "new",
          brand: "Ergonómica",
          google_product_category: googleCategory,
          product_type: xmlEscape(productType),
          ...(color && { color: xmlEscape(color) }),
          ...(size && { size: xmlEscape(size) }),
          shipping_price: "0.00 USD",
          tax_rate: "7.00",
        })
      }
    }

    return new StepResponse({ items })
  }
)
