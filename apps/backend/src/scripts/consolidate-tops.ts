import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
  deleteProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

// ── Color / Size maps ─────────────────────────────────────────────────────────

const MELA_COLOR_MAP: Record<string, string> = {
  ash: "Ash",
  black: "Black Matte",
  darkoak: "Dark Oak",
  hickory: "Hickory",
  honey: "Honey",
  lightash: "Light Ash",
  lightwood: "Light Wood",
  mappa: "Mappa",
  oakli: "Oak Linen",
  pecan: "Pecan",
  rosewood: "Rosewood",
  wengue: "Wengué",
  white: "White Matte",
  whitecedar: "White Cedar",
  charcoal: "Charcoal",
  savannah: "Savannah",
  onyx: "Onyx",
  niebla: "Niebla",
}

const SIZE_MAP: Record<string, string> = {
  "120": "120x60cm",
  "150": "150x75cm",
  "180": "180x75cm",
}

interface ParsedTop {
  id: string
  handle: string
  title: string
  sku: string
  priceAmount: number
  priceCurrency: string
  inventoryQty: number
  dim1: string   // Color (mela) or Wood (wood)
  dim2: string   // Tamaño
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default async function consolidateTops({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== consolidate-tops: START ===")

  // ── Infrastructure ────────────────────────────────────────────────────────

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel = salesChannels[0]
  if (!defaultSalesChannel) throw new Error("No sales channel found")

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const stockLocation = stockLocations[0]
  if (!stockLocation) throw new Error("No stock location found")

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) throw new Error("No shipping profile found")

  // ── Category IDs ──────────────────────────────────────────────────────────

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  })
  const catHandleToId = new Map<string, string>(
    categories.map((c: any) => [c.handle as string, c.id as string])
  )

  // Try several possible handles for top categories
  const melamineTopsCatId =
    catHandleToId.get("melamine-tops") ||
    catHandleToId.get("tops") ||
    catHandleToId.get("sobres")

  const woodTopsCatId =
    catHandleToId.get("wood-tops") ||
    catHandleToId.get("natural-wood-tops") ||
    catHandleToId.get("wooden-tops") ||
    melamineTopsCatId  // fall back to same cat

  logger.info(`melamine-tops cat: ${melamineTopsCatId ?? "not found — will skip category_ids"}`)
  logger.info(`wood-tops cat: ${woodTopsCatId ?? "not found — will skip category_ids"}`)

  // ── Fetch all products (flat) ─────────────────────────────────────────────

  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "title",
      "variants.id",
      "variants.sku",
      "variants.prices.amount",
      "variants.prices.currency_code",
    ],
  })

  logger.info(`Total products in DB: ${allProducts.length}`)

  // ── Inventory lookup ──────────────────────────────────────────────────────

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })
  const skuToInvItemId = new Map<string, string>(
    inventoryItems.filter((i: any) => i.sku).map((i: any) => [i.sku as string, i.id as string])
  )

  const { data: inventoryLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"],
  })
  const invItemIdToQty = new Map<string, number>()
  for (const lv of inventoryLevels as any[]) {
    if (lv.location_id === stockLocation.id) {
      invItemIdToQty.set(lv.inventory_item_id, lv.stocked_quantity ?? 0)
    }
  }

  const getInventoryQty = (sku: string): number => {
    const invItemId = skuToInvItemId.get(sku)
    return invItemId ? (invItemIdToQty.get(invItemId) ?? 0) : 0
  }

  // ── Check if consolidated products already exist ──────────────────────────

  const existingHandles = new Set(allProducts.map((p: any) => p.handle as string))

  // ── Helper: set inventory after product creation ──────────────────────────

  async function setInventoryForNewVariants(
    newVariants: any[],
    skuToQtyMap: Map<string, number>
  ) {
    // Re-query inventory items (new ones created for new variants)
    const { data: freshInvItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id", "sku"],
    })
    const freshSkuToId = new Map<string, string>(
      freshInvItems.filter((i: any) => i.sku).map((i: any) => [i.sku as string, i.id as string])
    )

    const { data: existingLevels } = await query.graph({
      entity: "inventory_level",
      fields: ["id", "inventory_item_id", "location_id"],
    })
    const existingLevelKeys = new Set(
      (existingLevels as any[]).map((l) => `${l.inventory_item_id}:${l.location_id}`)
    )

    const levelsToCreate: any[] = []
    for (const v of newVariants) {
      if (!v.sku) continue
      const invItemId = freshSkuToId.get(v.sku)
      if (!invItemId) continue
      const levelKey = `${invItemId}:${stockLocation.id}`
      if (existingLevelKeys.has(levelKey)) continue
      const qty = skuToQtyMap.get(v.sku) ?? 0
      levelsToCreate.push({
        inventory_item_id: invItemId,
        location_id: stockLocation.id,
        stocked_quantity: qty,
      })
    }

    if (levelsToCreate.length > 0) {
      try {
        await createInventoryLevelsWorkflow(container).run({
          input: { inventory_levels: levelsToCreate },
        })
        logger.info(`  Set inventory for ${levelsToCreate.length} new variants`)
      } catch (err: any) {
        logger.warn(`  Inventory creation warning: ${err.message}`)
      }
    }
  }

  // ── MELAMINE TOPS ─────────────────────────────────────────────────────────

  if (existingHandles.has("sobre-melamina")) {
    logger.info("sobre-melamina already exists — skipping melamine consolidation")
  } else {
    const melaParsed: ParsedTop[] = []

    for (const p of allProducts as any[]) {
      const h: string = p.handle ?? ""
      if (!h.startsWith("top-mela-")) continue

      // top-mela-{color}-{size}
      const m = h.match(/^top-mela-([a-z]+)-(\d+)$/)
      if (!m) {
        logger.warn(`  Unrecognised melamine handle: ${h} — skipping`)
        continue
      }
      const colorKey = m[1]
      const sizeKey = m[2]
      const color = MELA_COLOR_MAP[colorKey] ?? colorKey
      const size = SIZE_MAP[sizeKey] ?? `${sizeKey}cm`

      const variant = (p.variants ?? [])[0]
      const price = (variant?.prices ?? [])[0]

      melaParsed.push({
        id: p.id,
        handle: h,
        title: p.title,
        sku: variant?.sku ?? "",
        priceAmount: price?.amount ?? 0,
        priceCurrency: price?.currency_code ?? "usd",
        inventoryQty: variant?.sku ? getInventoryQty(variant.sku) : 0,
        dim1: color,
        dim2: size,
      })
    }

    logger.info(`Found ${melaParsed.length} melamine top products to consolidate`)

    if (melaParsed.length > 0) {
      const allColors = [...new Set(melaParsed.map((p) => p.dim1))].sort()
      const allSizes = [...new Set(melaParsed.map((p) => p.dim2))].sort()
      logger.info(`  Colors: ${allColors.join(", ")}`)
      logger.info(`  Sizes: ${allSizes.join(", ")}`)

      const skuToQty = new Map<string, number>(melaParsed.map((p) => [p.sku, p.inventoryQty]))

      // STEP 1: Delete old products first to free up SKUs
      logger.info(`  Deleting ${melaParsed.length} old melamine top products...`)
      for (const p of melaParsed) {
        try {
          await deleteProductsWorkflow(container).run({ input: { ids: [p.id] } })
        } catch (err: any) {
          logger.warn(`  Could not delete ${p.handle}: ${err.message}`)
        }
      }

      // STEP 2: Create consolidated product
      logger.info("  Creating Sobre de Melamina...")
      const variants = melaParsed.map((p) => ({
        title: `${p.dim1} — ${p.dim2}`,
        sku: p.sku,
        manage_inventory: true,
        options: { Color: p.dim1, Tamaño: p.dim2 },
        prices: [{ currency_code: p.priceCurrency, amount: p.priceAmount }],
      }))

      try {
        const { result } = await createProductsWorkflow(container).run({
          input: {
            products: [
              {
                title: "Sobre de Melamina",
                handle: "sobre-melamina",
                description:
                  "Sobre de melamina hidrofúga eco E0 de alta calidad para standing desk o escritorio. Resistente al agua, fácil de limpiar. Compatible con todas las bases de standing desk. Garantía de 3 años.",
                status: ProductStatus.PUBLISHED,
                category_ids: melamineTopsCatId ? [melamineTopsCatId] : [],
                shipping_profile_id: shippingProfile.id,
                sales_channels: [{ id: defaultSalesChannel.id }],
                metadata: {
                  warranty: "3 años",
                  material: "Melamina hidrofúga E0",
                  compatible_frames: "Todas las bases standing desk",
                  assembly_required: "false",
                },
                options: [
                  { title: "Color", values: allColors },
                  { title: "Tamaño", values: allSizes },
                ],
                variants,
              },
            ],
          },
        })

        const newProduct = result[0]
        logger.info(
          `  ✅ Created "Sobre de Melamina" (${newProduct.id}) with ${newProduct.variants?.length ?? 0} variants`
        )

        await setInventoryForNewVariants(newProduct.variants ?? [], skuToQty)
      } catch (err: any) {
        logger.error(`  ❌ Failed to create Sobre de Melamina: ${err.message}`)
      }
    }
  }

  // ── NATURAL WOOD TOPS ─────────────────────────────────────────────────────

  if (existingHandles.has("sobre-madera-natural")) {
    logger.info("sobre-madera-natural already exists — skipping wood consolidation")
  } else {
    const woodParsed: ParsedTop[] = []

    for (const p of allProducts as any[]) {
      const h: string = p.handle ?? ""
      if (!h.startsWith("top-")) continue
      if (h.startsWith("top-mela-")) continue  // already handled above
      if (["sobre-melamina", "sobre-madera-natural"].includes(h)) continue

      // Extract size from end of handle (e.g. -120, -150, -180)
      const sizeMatch = h.match(/-(\d+)$/)
      if (!sizeMatch) {
        logger.warn(`  Unrecognised wood top handle (no size): ${h} — skipping`)
        continue
      }
      const sizeKey = sizeMatch[1]
      const size = SIZE_MAP[sizeKey] ?? `${sizeKey}cm`

      // Wood type = everything after "top-" prefix, before the size suffix
      const withoutPrefix = h.replace(/^top-(?:madera-|wood-|mdr-)?/, "")
      const withoutSize = withoutPrefix.replace(new RegExp(`-${sizeKey}$`), "")
      const woodName = withoutSize
        .split("-")
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")

      const variant = (p.variants ?? [])[0]
      const price = (variant?.prices ?? [])[0]

      woodParsed.push({
        id: p.id,
        handle: h,
        title: p.title,
        sku: variant?.sku ?? "",
        priceAmount: price?.amount ?? 0,
        priceCurrency: price?.currency_code ?? "usd",
        inventoryQty: variant?.sku ? getInventoryQty(variant.sku) : 0,
        dim1: woodName,  // Madera
        dim2: size,      // Tamaño
      })
    }

    logger.info(`Found ${woodParsed.length} wood top products to consolidate`)

    if (woodParsed.length > 0) {
      const allWoods = [...new Set(woodParsed.map((p) => p.dim1))].sort()
      const allSizes = [...new Set(woodParsed.map((p) => p.dim2))].sort()
      logger.info(`  Woods: ${allWoods.join(", ")}`)
      logger.info(`  Sizes: ${allSizes.join(", ")}`)

      const skuToQty = new Map<string, number>(woodParsed.map((p) => [p.sku, p.inventoryQty]))

      // STEP 1: Delete old products
      logger.info(`  Deleting ${woodParsed.length} old wood top products...`)
      for (const p of woodParsed) {
        try {
          await deleteProductsWorkflow(container).run({ input: { ids: [p.id] } })
        } catch (err: any) {
          logger.warn(`  Could not delete ${p.handle}: ${err.message}`)
        }
      }

      // STEP 2: Create consolidated product
      logger.info("  Creating Sobre de Madera Natural...")
      const variants = woodParsed.map((p) => ({
        title: `${p.dim1} — ${p.dim2}`,
        sku: p.sku,
        manage_inventory: true,
        options: { Madera: p.dim1, Tamaño: p.dim2 },
        prices: [{ currency_code: p.priceCurrency, amount: p.priceAmount }],
      }))

      try {
        const { result } = await createProductsWorkflow(container).run({
          input: {
            products: [
              {
                title: "Sobre de Madera Natural",
                handle: "sobre-madera-natural",
                description:
                  "Sobre de madera natural sólida para standing desk o escritorio. Alta calidad, durable y sostenible. Compatible con todas las bases de standing desk. Garantía de 3 años.",
                status: ProductStatus.PUBLISHED,
                category_ids: woodTopsCatId ? [woodTopsCatId] : [],
                shipping_profile_id: shippingProfile.id,
                sales_channels: [{ id: defaultSalesChannel.id }],
                metadata: {
                  warranty: "3 años",
                  material: "Madera natural sólida",
                  compatible_frames: "Todas las bases standing desk",
                  assembly_required: "false",
                },
                options: [
                  { title: "Madera", values: allWoods },
                  { title: "Tamaño", values: allSizes },
                ],
                variants,
              },
            ],
          },
        })

        const newProduct = result[0]
        logger.info(
          `  ✅ Created "Sobre de Madera Natural" (${newProduct.id}) with ${newProduct.variants?.length ?? 0} variants`
        )

        await setInventoryForNewVariants(newProduct.variants ?? [], skuToQty)
      } catch (err: any) {
        logger.error(`  ❌ Failed to create Sobre de Madera Natural: ${err.message}`)
      }
    } else {
      logger.info("No wood top products found — nothing to consolidate")
    }
  }

  logger.info("=== consolidate-tops: DONE ===")
}
