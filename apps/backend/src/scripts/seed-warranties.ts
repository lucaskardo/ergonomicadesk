import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const WARRANTIES = [
  {
    title: "Garantía Extendida — Standing Desks",
    handle: "extended-warranty-desks",
    description: "Garantía extendida a 5 años para standing desks. Cubre motor, electrónica y estructura.",
    sku: "extended-warranty-desks",
    price: 10000, // $100 placeholder — real price is 33% of product, calculated at checkout display
    metadata: { warranty_type: "extended", category_target: "desks", surcharge_pct: 33 },
  },
  {
    title: "Garantía Extendida — Sillas",
    handle: "extended-warranty-chairs",
    description: "Garantía extendida a 5 años para sillas ergonómicas. Cubre mecanismo, base y estructura.",
    sku: "extended-warranty-chairs",
    price: 5000,
    metadata: { warranty_type: "extended", category_target: "chairs", surcharge_pct: 33 },
  },
  {
    title: "Garantía Extendida — Oficina",
    handle: "extended-warranty-office",
    description: "Garantía extendida a 5 años para escritorios y muebles de oficina.",
    sku: "extended-warranty-office",
    price: 5000,
    metadata: { warranty_type: "extended", category_target: "office", surcharge_pct: 33 },
  },
  {
    title: "Garantía Extendida — Accesorios",
    handle: "extended-warranty-accessories",
    description: "Garantía extendida a 3 años para accesorios de oficina.",
    sku: "extended-warranty-accessories",
    price: 2500,
    metadata: { warranty_type: "extended", category_target: "accessories", surcharge_pct: 33 },
  },
  {
    title: "Garantía Extendida — Almacenamiento",
    handle: "extended-warranty-storage",
    description: "Garantía extendida a 5 años para gabinetes y archivadores.",
    sku: "extended-warranty-storage",
    price: 3000,
    metadata: { warranty_type: "extended", category_target: "storage", surcharge_pct: 33 },
  },
]

export default async function seedWarranties({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModule = container.resolve("product")
  const pricingModule = container.resolve("pricing")
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  logger.info("Seeding extended warranty products...")

  for (const w of WARRANTIES) {
    // Check if already exists
    const existing = await productModule.listProducts({ handle: w.handle })
    if (existing.length > 0) {
      logger.info(`  ${w.handle} already exists — skipping`)
      continue
    }

    const product = await productModule.createProducts({
      title: w.title,
      handle: w.handle,
      description: w.description,
      status: "published",
      metadata: w.metadata,
      options: [{ title: "Plan", values: ["5 Años"] }],
      variants: [{
        title: w.title,
        sku: w.sku,
        manage_inventory: false,
        options: { Plan: "5 Años" },
      }],
    })

    // Create price set and link to variant
    const variant = product.variants[0]
    const priceSet = await pricingModule.createPriceSets({
      prices: [{ amount: w.price, currency_code: "usd" }],
    })

    await remoteLink.create({
      [Modules.PRODUCT]: { variant_id: variant.id },
      [Modules.PRICING]: { price_set_id: priceSet.id },
    })

    logger.info(`  Created ${w.handle} (variant: ${variant.id}, price: $${w.price / 100})`)
  }

  logger.info("Done seeding warranties")
}
