import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function seedRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionService = container.resolve(Modules.REGION)

  logger.info("Checking for existing Panama region...")

  const existingRegions = await regionService.listRegions({ name: "Panama" })

  if (existingRegions.length > 0) {
    logger.info(`Panama region already exists (id: ${existingRegions[0].id})`)
    return
  }

  logger.info("Creating Panama region...")

  const region = await regionService.createRegions({
    name: "Panama",
    currency_code: "usd",
    countries: ["pa"],
  })

  logger.info(`Created region: "${region.name}" (id: ${region.id})`)
  logger.info(
    `Add to apps/storefront/.env.local:\n  NEXT_PUBLIC_MEDUSA_REGION_ID=${region.id}`
  )
}
