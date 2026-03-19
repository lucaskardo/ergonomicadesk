import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionService = container.resolve(Modules.REGION)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const pricingService = container.resolve(Modules.PRICING)
  const productCategoryService = container.resolve(Modules.PRODUCT)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  // ── 1. Verify / create Panama region ────────────────────────────────────────
  logger.info("Step 1: Panama region...")
  const existingRegions = await regionService.listRegions({ name: "Panama" })
  let region = existingRegions[0]
  if (!region) {
    region = await regionService.createRegions({
      name: "Panama",
      currency_code: "usd",
      countries: ["pa"],
    })
    logger.info(`  Created region "${region.name}" (${region.id})`)
  } else {
    logger.info(`  Region already exists (${region.id})`)
  }

  // ── 2. Create product categories (idempotent) ────────────────────────────────
  logger.info("Step 2: Product categories...")
  const categoryNames = ["Sillas Ergonómicas", "Escritorios de Pie", "Accesorios"]

  const { data: existingCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const existingNames = new Set(existingCats.map((c: { name: string }) => c.name))

  const toCreate = categoryNames.filter((name) => !existingNames.has(name))
  if (toCreate.length > 0) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: toCreate.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    logger.info(`  Created categories: ${toCreate.join(", ")}`)
  } else {
    logger.info("  All categories already exist")
  }

  // ── 3. Associate all products to Default Sales Channel ───────────────────────
  logger.info("Step 3: Linking products to Default Sales Channel...")
  const [defaultSalesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  })

  if (!defaultSalesChannel) {
    logger.error("  Default Sales Channel not found — run seed.ts first")
    return
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "sales_channels.id"],
  })

  let linked = 0
  for (const product of products) {
    const alreadyLinked = product.sales_channels?.some(
      (sc: { id: string }) => sc.id === defaultSalesChannel.id
    )
    if (!alreadyLinked) {
      await link.create({
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSalesChannel.id },
      })
      linked++
    }
  }
  logger.info(
    `  ${linked} products linked (${products.length - linked} already linked)`
  )

  // ── 4. Set USD price $299 on all existing variants ──────────────────────────
  logger.info("Step 4: Setting USD price $299 on existing variants...")

  const { data: variantLinks } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "product.title", "price_set.id"],
  })

  let priced = 0
  for (const variant of variantLinks) {
    const priceSetId = variant.price_set?.id
    if (!priceSetId) {
      logger.warn(`  Variant ${variant.id} has no price set — skipping`)
      continue
    }

    // Check if a USD price already exists
    const priceSet = await pricingService.retrievePriceSet(priceSetId, {
      relations: ["prices"],
    })
    const hasUsdPrice = priceSet.prices?.some(
      (p: { currency_code: string }) => p.currency_code === "usd"
    )

    if (!hasUsdPrice) {
      await pricingService.addPrices([
        {
          priceSetId,
          prices: [
            {
              amount: 29900,
              currency_code: "usd",
            },
            {
              amount: 29900,
              currency_code: "usd",
              rules: { region_id: region.id },
            },
          ],
        },
      ])
      priced++
      logger.info(
        `  Priced variant "${variant.title}" of "${variant.product?.title}" → $299`
      )
    } else {
      logger.info(
        `  Variant "${variant.title}" already has USD price — skipping`
      )
    }
  }

  logger.info(`\nDone. ${priced} variant(s) priced at $299 USD.`)
  logger.info(`Region ID for storefront: NEXT_PUBLIC_MEDUSA_REGION_ID=${region.id}`)
}
