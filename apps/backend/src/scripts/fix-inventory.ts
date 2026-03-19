import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function fixInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // 1. Get existing sales channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel = salesChannels[0]
  logger.info(`Using sales channel: ${defaultSalesChannel.name} (${defaultSalesChannel.id})`)

  // 2. Check if stock location already exists
  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  let stockLocation: { id: string }

  if (existingLocations.length > 0) {
    stockLocation = existingLocations[0]
    logger.info(`Stock location already exists: ${stockLocation.id}`)
  } else {
    logger.info("Creating stock location...")
    const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Panama Warehouse",
            address: {
              city: "Panama City",
              country_code: "PA",
              address_1: "",
            },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]
    logger.info(`Created stock location: ${stockLocation.id}`)
  }

  // 3. Get store and set default_location_id
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id"],
  })
  const store = stores[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  })
  logger.info("Updated store default_location_id")

  // 4. Link stock location to fulfillment provider
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })
    logger.info("Linked stock location to fulfillment provider")
  } catch (e) {
    logger.info("Fulfillment provider link may already exist, skipping")
  }

  // 5. Link stock location to sales channel
  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel.id],
      },
    })
    logger.info("Linked stock location to sales channel")
  } catch (e) {
    logger.info("Sales channel link may already exist, skipping")
  }

  // 6. Create inventory levels for all inventory items
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })
  logger.info(`Found ${inventoryItems.length} inventory items`)

  if (inventoryItems.length > 0) {
    const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map((item) => ({
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: item.id,
    }))

    try {
      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: inventoryLevels,
        },
      })
      logger.info(`Created inventory levels for ${inventoryLevels.length} items`)
    } catch (e) {
      logger.info("Inventory levels may already exist, skipping")
    }
  }

  // 7. Link products to default shipping profile
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  })
  logger.info(`Found ${shippingProfiles.length} shipping profiles`)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  })
  logger.info(`Found ${products.length} products to link to shipping profile`)

  const defaultProfile = shippingProfiles.find((p: any) => p.name === "Default Shipping Profile") || shippingProfiles[0]

  for (const product of products) {
    try {
      await link.create({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [Modules.FULFILLMENT]: {
          shipping_profile_id: defaultProfile.id,
        },
      })
      logger.info(`Linked product ${product.title} (${product.id}) to shipping profile ${defaultProfile.id}`)
    } catch (e) {
      logger.info(`Shipping profile link for product ${product.id} may already exist, skipping`)
    }
  }

  // 8. Fix tax region provider_id (Panama tax region created without provider)
  const taxService = container.resolve("tax") as any
  const taxRegions = await taxService.listTaxRegions({ country_code: "pa" })
  for (const region of taxRegions) {
    if (!region.provider_id) {
      await taxService.updateTaxRegions([{ id: region.id, provider_id: "tp_system" }])
      logger.info(`Fixed tax region ${region.id} (pa) — set provider_id to tp_system`)
    }
  }

  logger.info("✅ Inventory + shipping profile fix complete!")
}
