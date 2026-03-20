import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Adds pp_system_default (Manual Payment) to the Panama region.
 * This allows completing orders without a payment gateway (while NMI is integrated).
 */
export default async function seedPaymentProvider({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionService = container.resolve(Modules.REGION)

  logger.info("Looking for Panama region...")

  const [region] = await regionService.listRegions({ name: "Panama" })

  if (!region) {
    logger.error("Panama region not found. Run seed-region.ts first.")
    return
  }

  logger.info(`Found region: ${region.name} (${region.id})`)
  logger.info("Adding pp_system_default payment provider...")

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: region.id },
      update: {
        payment_providers: ["pp_system_default"],
      },
    },
  })

  logger.info(
    "✅ pp_system_default (Manual Payment) registered for Panama region"
  )
}
