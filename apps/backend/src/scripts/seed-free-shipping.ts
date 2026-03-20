import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Adds a free shipping price rule to "Envío Ciudad de Panamá":
 * - Default: $15 USD
 * - Free ($0) when cart item_total >= $100 (10000 cents)
 */
export default async function seedFreeShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Looking for 'Envío Ciudad de Panamá' shipping option...")

  const existingOptions = await fulfillmentService.listShippingOptions({
    name: "Envío Ciudad de Panamá",
  })

  if (!existingOptions.length) {
    logger.error(
      "'Envío Ciudad de Panamá' not found. Run seed-shipping.ts first."
    )
    return
  }

  const option = existingOptions[0]
  logger.info(`Found shipping option: ${option.id}`)

  // Get region for region-scoped price
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  })
  const region = regions[0]
  logger.info(`Using region: ${region.name} (${region.id})`)

  await updateShippingOptionsWorkflow(container).run({
    input: [
      {
        id: option.id,
        prices: [
          // Default price: $15
          {
            currency_code: "usd",
            amount: 1500,
          },
          // Region price: $15
          {
            region_id: region.id,
            amount: 1500,
          },
          // Free shipping when item_total >= $100 (10000 cents)
          {
            currency_code: "usd",
            amount: 0,
            rules: [
              {
                attribute: "item_total",
                operator: "gte",
                value: "10000",
              },
            ],
          },
          // Free shipping region price when item_total >= $100
          {
            region_id: region.id,
            amount: 0,
            rules: [
              {
                attribute: "item_total",
                operator: "gte",
                value: "10000",
              },
            ],
          },
        ],
      },
    ],
  })

  logger.info(
    "✅ Free shipping rule added: Envío Ciudad de Panamá is FREE for orders >= $100"
  )
}
