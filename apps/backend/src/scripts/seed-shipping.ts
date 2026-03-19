import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)

  // ── 1. Stock location ─────────────────────────────────────────────────────
  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  let stockLocationId: string
  const existingLocation = existingLocations[0]

  if (existingLocation) {
    stockLocationId = existingLocation.id
    logger.info(`Using existing stock location: ${stockLocationId}`)
  } else {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Almacén Panamá",
            address: {
              city: "Panama City",
              country_code: "PA",
              address_1: "",
            },
          },
        ],
      },
    })
    stockLocationId = result[0].id
    logger.info(`Created stock location: ${stockLocationId}`)
  }

  // ── 2. Fulfillment set ────────────────────────────────────────────────────
  const existingFulfillmentSets = await fulfillmentService.listFulfillmentSets({
    name: "Panama Shipping",
  })

  let serviceZoneId: string

  if (existingFulfillmentSets.length > 0) {
    const fset = existingFulfillmentSets[0] as any
    serviceZoneId = fset.service_zones?.[0]?.id
    logger.info(
      `Using existing fulfillment set: ${fset.id}, service zone: ${serviceZoneId}`
    )
  } else {
    const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
      name: "Panama Shipping",
      type: "shipping",
      service_zones: [
        {
          name: "Panama",
          geo_zones: [
            {
              country_code: "pa",
              type: "country",
            },
          ],
        },
      ],
    })
    serviceZoneId = (fulfillmentSet as any).service_zones[0].id
    logger.info(
      `Created fulfillment set: ${fulfillmentSet.id}, service zone: ${serviceZoneId}`
    )

    // Link stock location → fulfillment set
    try {
      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocationId,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_set_id: fulfillmentSet.id,
        },
      })
      logger.info("Linked stock location → fulfillment set")
    } catch {
      logger.info("Stock location → fulfillment set link already exists, skipping")
    }
  }

  // ── 3. Shipping profile ───────────────────────────────────────────────────
  const shippingProfiles = await fulfillmentService.listShippingProfiles({
    type: "default",
  })
  const shippingProfile = shippingProfiles[0]
  logger.info(
    `Using shipping profile: ${shippingProfile.name} (${shippingProfile.id})`
  )

  // ── 4. Get PA region ──────────────────────────────────────────────────────
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  })
  const region = regions[0]
  logger.info(`Using region: ${region.name} (${region.id})`)

  // ── 5. Check existing shipping options (idempotent) ───────────────────────
  const existingOptions = await fulfillmentService.listShippingOptions({
    service_zone_id: serviceZoneId,
  })
  const existingNames = new Set(existingOptions.map((o: any) => o.name))

  const optionsToCreate = [
    {
      name: "Retiro en tienda",
      code: "pickup",
      amount: 0,
    },
    {
      name: "Envío Ciudad de Panamá",
      code: "panama_city",
      amount: 1500,
    },
    {
      name: "Envío Provincias",
      code: "provinces",
      amount: 2500,
    },
  ].filter((o) => !existingNames.has(o.name))

  if (optionsToCreate.length === 0) {
    logger.info("All shipping options already exist, skipping creation")
  } else {
    await createShippingOptionsWorkflow(container).run({
      input: optionsToCreate.map((o) => ({
        name: o.name,
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: o.name,
          description: o.name,
          code: o.code,
        },
        prices: [
          {
            currency_code: "usd",
            amount: o.amount,
          },
          {
            region_id: region.id,
            amount: o.amount,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      })),
    })
    logger.info(
      `Created ${optionsToCreate.length} shipping option(s): ${optionsToCreate.map((o) => o.name).join(", ")}`
    )
  }

  // ── 6. Link stock location → sales channel ───────────────────────────────
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel = salesChannels[0]

  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocationId,
        add: [defaultSalesChannel.id],
      },
    })
    logger.info(
      `Linked stock location → sales channel: ${defaultSalesChannel.name}`
    )
  } catch {
    logger.info("Sales channel link already exists, skipping")
  }

  logger.info("✅ Shipping seed complete!")
}
