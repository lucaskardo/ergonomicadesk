import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function seedTax({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const taxService = container.resolve(Modules.TAX)

  logger.info("Seeding tax regions...")

  // ── Panama (ITBMS 7%) ────────────────────────────────────────────────────────
  const existing = await taxService.listTaxRegions({ country_code: "pa" })

  if (existing.length > 0) {
    logger.info("Tax region 'PA' already exists — skipping")
  } else {
    await taxService.createTaxRegions({
      country_code: "pa",
      default_tax_rate: {
        name: "ITBMS",
        rate: 7,
        code: "ITBMS",
      },
    })
    logger.info("Created tax region PA with ITBMS 7%")
  }

  // ── International: 0% by default ────────────────────────────────────────────
  // Medusa returns 0% tax when no region is found for a country_code.
  // International orders (non-PA) are zero-rated automatically — no region needed.
  logger.info(
    "Tax seed complete — international orders are 0% (no region = no tax)"
  )
}
