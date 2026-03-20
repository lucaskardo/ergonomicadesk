import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import * as XLSX from "xlsx"
import * as path from "path"

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProductRow {
  handle: string
  title: string
  description: string
  status: string
  sku: string
  variant_title: string
  price_usd: number
  inventory_qty: number
  category_handle: string
  category_es: string
  subcategory_es: string
  category_en: string
  subcategory_en: string
  collection: string
  weight: number
  material: string
  dimensions: string
  tags: string
}

interface CategoryRow {
  parent_handle: string
  handle: string
  name_es: string
  name_en: string
  position: number
}

interface CollectionRow {
  handle: string
  title: string
  description: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function readSheet<T>(workbook: XLSX.WorkBook, sheetName: string): T[] {
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found in workbook`)
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: "" })
}

function sanitizeHandle(handle: string): string {
  return handle
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-") // replace non-URL-safe chars with dash
    .replace(/-+/g, "-")          // collapse multiple dashes
    .replace(/^-|-$/g, "")        // trim leading/trailing dashes
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // ── Read Excel ───────────────────────────────────────────────────────────────

  const xlsxPath = path.resolve(__dirname, "ergonomica_MEDUSA_IMPORT.xlsx")
  logger.info(`Reading Excel from: ${xlsxPath}`)
  const workbook = XLSX.readFile(xlsxPath)

  const productRows = readSheet<ProductRow>(workbook, "Medusa Import")
  const categoryRows = readSheet<CategoryRow>(workbook, "Medusa Categories")
  const collectionRows = readSheet<CollectionRow>(workbook, "Medusa Collections")

  logger.info(`Found ${productRows.length} products, ${categoryRows.length} categories, ${collectionRows.length} collections in Excel`)

  // ── Get infrastructure ───────────────────────────────────────────────────────

  const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"] })
  const defaultSalesChannel = salesChannels[0]
  if (!defaultSalesChannel) throw new Error("No sales channel found. Run fix-inventory.ts first.")
  logger.info(`Using sales channel: ${defaultSalesChannel.name}`)

  const { data: stockLocations } = await query.graph({ entity: "stock_location", fields: ["id", "name"] })
  const stockLocation = stockLocations[0]
  if (!stockLocation) throw new Error("No stock location found. Run fix-inventory.ts first.")
  logger.info(`Using stock location: ${stockLocation.name}`)

  const { data: shippingProfiles } = await query.graph({ entity: "shipping_profile", fields: ["id", "name"] })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) throw new Error("No shipping profile found. Run fix-inventory.ts first.")
  logger.info(`Using shipping profile: ${shippingProfile.name}`)

  // ── FASE 1 — CATEGORIES ──────────────────────────────────────────────────────

  logger.info("=== FASE 1: Creating categories ===")

  // Fetch existing categories to skip duplicates
  const { data: existingCats } = await query.graph({ entity: "product_category", fields: ["id", "handle", "name"] })
  const existingCatHandles = new Set(existingCats.map((c: any) => c.handle as string))
  const catHandleToId = new Map<string, string>(existingCats.map((c: any) => [c.handle as string, c.id as string]))

  // Create parent categories first
  const parentRows = categoryRows.filter((r) => !r.parent_handle || r.parent_handle === "")
  const childRows = categoryRows.filter((r) => r.parent_handle && r.parent_handle !== "")

  let catsCreated = 0
  let catsSkipped = 0

  // Parents
  const parentsToCreate = parentRows.filter((r) => !existingCatHandles.has(r.handle))
  if (parentsToCreate.length > 0) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: parentsToCreate.map((r) => ({
          name: r.name_es,
          handle: r.handle,
          is_active: true,
          rank: r.position || 0,
        })),
      },
    })
    result.forEach((cat) => catHandleToId.set(cat.handle!, cat.id))
    catsCreated += parentsToCreate.length
    logger.info(`Created ${parentsToCreate.length} parent categories`)
  }
  catsSkipped += parentRows.length - parentsToCreate.length

  // Children (one by one to attach parent_category_id)
  for (const row of childRows) {
    if (existingCatHandles.has(row.handle)) {
      catsSkipped++
      continue
    }
    const parentId = catHandleToId.get(row.parent_handle)
    if (!parentId) {
      logger.warn(`Parent handle "${row.parent_handle}" not found for child "${row.handle}" — skipping`)
      catsSkipped++
      continue
    }
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: row.name_es,
            handle: row.handle,
            is_active: true,
            rank: row.position || 0,
            parent_category_id: parentId,
          },
        ],
      },
    })
    catHandleToId.set(result[0].handle!, result[0].id)
    catsCreated++
  }

  logger.info(`Categories: ${catsCreated} created, ${catsSkipped} skipped`)

  // ── FASE 2 — COLLECTIONS ─────────────────────────────────────────────────────

  logger.info("=== FASE 2: Creating collections ===")

  const { data: existingColls } = await query.graph({ entity: "product_collection", fields: ["id", "handle", "title"] })
  const existingCollHandles = new Set(existingColls.map((c: any) => c.handle as string))
  const collHandleToId = new Map<string, string>(existingColls.map((c: any) => [c.handle as string, c.id as string]))

  let collsCreated = 0
  let collsSkipped = 0

  const collsToCreate = collectionRows.filter((r) => r.handle && !existingCollHandles.has(r.handle))
  if (collsToCreate.length > 0) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: {
        collections: collsToCreate.map((r) => ({
          title: r.title,
          handle: r.handle,
          metadata: r.description ? { description: r.description } : undefined,
        })),
      },
    })
    result.forEach((coll) => collHandleToId.set(coll.handle!, coll.id))
    collsCreated += collsToCreate.length
    logger.info(`Created ${collsToCreate.length} collections`)
  }
  collsSkipped += collectionRows.length - collsToCreate.length

  logger.info(`Collections: ${collsCreated} created, ${collsSkipped} skipped`)

  // ── FASE 3 — PRODUCTS ────────────────────────────────────────────────────────

  logger.info("=== FASE 3: Creating products ===")

  // Get existing products by handle to skip duplicates
  const { data: existingProds } = await query.graph({ entity: "product", fields: ["id", "handle", "title"] })
  const existingProdHandles = new Set(existingProds.map((p: any) => p.handle as string))

  // Pre-sanitize all handles in productRows to avoid URL-unsafe errors
  for (const row of productRows) {
    row.handle = sanitizeHandle(row.handle || row.title)
  }

  let prodsCreated = 0
  let prodsSkipped = 0
  let prodsErrored = 0
  const createdVariantsBySku = new Map<string, { variantId: string; qty: number }>()

  const BATCH_SIZE = 20
  const rowsToCreate = productRows.filter((r) => r.handle && !existingProdHandles.has(r.handle))
  const batches = chunkArray(rowsToCreate, BATCH_SIZE)

  logger.info(`${existingProdHandles.size} products already exist, creating ${rowsToCreate.length} new ones in ${batches.length} batches`)

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx]
    const productInputs = batch.map((row) => {
      // Build metadata
      const metadata: Record<string, string> = {}
      if (row.material) metadata.material = row.material
      if (row.dimensions) metadata.dimensions = String(row.dimensions)

      // Resolve category_id
      const categoryId = catHandleToId.get(row.category_handle)

      // Resolve collection_id
      const collectionHandle = row.collection?.toString().toLowerCase().trim()
      const collectionId = collectionHandle ? collHandleToId.get(collectionHandle) : undefined

      const priceAmount = Math.round(Number(row.price_usd) * 100)

      return {
        title: row.title,
        handle: row.handle,
        description: row.description || undefined,
        status: row.status === "published" ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
        weight: row.weight ? Number(row.weight) : undefined,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        category_ids: categoryId ? [categoryId] : [],
        collection_id: collectionId,
        shipping_profile_id: shippingProfile.id,
        sales_channels: [{ id: defaultSalesChannel.id }],
        options: [{ title: "Title", values: ["Default"] }],
        variants: [
          {
            title: row.variant_title || "Default",
            sku: row.sku || undefined,
            options: { Title: "Default" },
            prices: [
              {
                currency_code: "usd",
                amount: priceAmount,
              },
            ],
          },
        ],
      }
    })

    try {
      const { result } = await createProductsWorkflow(container).run({
        input: { products: productInputs },
      })

      // Map SKU → variant id + inventory qty for FASE 4
      result.forEach((prod, idx) => {
        const row = batch[idx]
        const variant = prod.variants?.[0]
        if (variant) {
          createdVariantsBySku.set(row.sku || `no-sku-${row.handle}`, {
            variantId: variant.id,
            qty: Number(row.inventory_qty) || 0,
          })
        }
      })

      prodsCreated += batch.length
      logger.info(`Creating products... ${prodsCreated}/${rowsToCreate.length}`)
    } catch (err: any) {
      // On batch failure, try one-by-one to isolate the bad row
      logger.warn(`Batch ${batchIdx + 1} failed (${err.message}), retrying individually...`)
      for (const singleInput of productInputs) {
        try {
          const { result } = await createProductsWorkflow(container).run({
            input: { products: [singleInput] },
          })
          const prod = result[0]
          const variant = prod.variants?.[0]
          const row = batch[productInputs.indexOf(singleInput)]
          if (variant && row) {
            createdVariantsBySku.set(row.sku || `no-sku-${row.handle}`, {
              variantId: variant.id,
              qty: Number(row.inventory_qty) || 0,
            })
          }
          prodsCreated++
        } catch (singleErr: any) {
          logger.error(`Failed to create product "${singleInput.handle}": ${singleErr.message}`)
          prodsErrored++
        }
      }
    }
  }

  // Count skipped
  prodsSkipped = productRows.length - rowsToCreate.length

  logger.info(`Products: ${prodsCreated} created, ${prodsSkipped} skipped, ${prodsErrored} errors`)

  // ── FASE 4 — INVENTORY ───────────────────────────────────────────────────────

  logger.info("=== FASE 4: Setting inventory levels ===")

  // Fetch all inventory items for newly created variants
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  // Also get existing inventory levels to avoid duplicate
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id", "location_id"],
  })
  const existingLevelKeys = new Set(
    existingLevels.map((l: any) => `${l.inventory_item_id}:${l.location_id}`)
  )

  // Build inventory item lookup by sku
  const skuToInvItemId = new Map<string, string>(
    inventoryItems
      .filter((item: any) => item.sku)
      .map((item: any) => [item.sku as string, item.id as string])
  )

  const inventoryLevels: CreateInventoryLevelInput[] = []

  for (const [sku, { qty }] of createdVariantsBySku) {
    const invItemId = skuToInvItemId.get(sku)
    if (!invItemId) {
      // If no SKU match, skip (inventory item may not exist yet)
      continue
    }
    const levelKey = `${invItemId}:${stockLocation.id}`
    if (existingLevelKeys.has(levelKey)) continue

    inventoryLevels.push({
      inventory_item_id: invItemId,
      location_id: stockLocation.id,
      stocked_quantity: qty,
    })
  }

  if (inventoryLevels.length > 0) {
    // Create in batches
    const invBatches = chunkArray(inventoryLevels, 50)
    for (const invBatch of invBatches) {
      try {
        await createInventoryLevelsWorkflow(container).run({
          input: { inventory_levels: invBatch },
        })
      } catch (err: any) {
        logger.warn(`Inventory batch failed: ${err.message}`)
      }
    }
    logger.info(`Created inventory levels for ${inventoryLevels.length} variants`)
  } else {
    logger.info("No new inventory levels to create")
  }

  // ── FASE 5 — DELETE TEST PRODUCTS ────────────────────────────────────────────

  logger.info("=== FASE 5: Deleting test products ===")

  const excelHandles = new Set(productRows.map((r) => r.handle).filter(Boolean))
  // Known test handles + any existing prod not in the Excel
  const testHandlesToDelete = ["silla-xtc-22", "silla_xtc_22", "xtc-22"]
  const { data: allProdsNow } = await query.graph({ entity: "product", fields: ["id", "handle", "title"] })

  const toDelete = allProdsNow.filter(
    (p: any) =>
      testHandlesToDelete.includes(p.handle) ||
      (!excelHandles.has(p.handle) &&
        (p.title?.toLowerCase().includes("silla xtc") ||
          p.title?.toLowerCase().includes("test") ||
          p.title?.toLowerCase().includes("medusa t-shirt") ||
          p.title?.toLowerCase().includes("medusa sweatshirt") ||
          p.title?.toLowerCase().includes("medusa sweatpants") ||
          p.title?.toLowerCase().includes("medusa shorts")))
  )

  if (toDelete.length > 0) {
    logger.info(`Deleting ${toDelete.length} test product(s): ${toDelete.map((p: any) => p.title).join(", ")}`)
    for (const prod of toDelete) {
      try {
        await deleteProductsWorkflow(container).run({ input: { ids: [prod.id] } })
        logger.info(`Deleted test product: ${prod.title}`)
      } catch (err: any) {
        logger.warn(`Could not delete "${prod.title}": ${err.message} — delete manually if needed`)
      }
    }
  } else {
    logger.info("No test products to delete")
  }

  // ── SUMMARY ──────────────────────────────────────────────────────────────────

  logger.info("=================================================")
  logger.info("✅ SEED COMPLETE")
  logger.info(`   Categories : ${catsCreated} created, ${catsSkipped} skipped`)
  logger.info(`   Collections: ${collsCreated} created, ${collsSkipped} skipped`)
  logger.info(`   Products   : ${prodsCreated} created, ${prodsSkipped} skipped, ${prodsErrored} errors`)
  logger.info(`   Inventory  : ${inventoryLevels.length} levels set`)
  logger.info(`   Deleted    : ${toDelete.length} test products`)
  logger.info("=================================================")
}
