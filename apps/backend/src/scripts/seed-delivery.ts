import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { DELIVERY_PANAMA_MODULE } from "../modules/delivery-panama"
import DeliveryPanamaService from "../modules/delivery-panama/service"

type ZoneInput = {
  name: string
  zone_type: "pickup" | "panama_city" | "province" | "international"
  base_rate: number
  free_threshold: number | null
  includes_assembly: boolean
}

const ZONES: ZoneInput[] = [
  {
    name: "Retiro en tienda",
    zone_type: "pickup",
    base_rate: 0,
    free_threshold: null,
    includes_assembly: false,
  },
  {
    name: "Ciudad de Panamá",
    zone_type: "panama_city",
    base_rate: 1500, // $15.00
    free_threshold: 10000, // $100.00
    includes_assembly: true,
  },
  {
    name: "Panamá Oeste",
    zone_type: "province",
    base_rate: 2500, // $25.00
    free_threshold: null,
    includes_assembly: false,
  },
  {
    name: "Provincias centrales",
    zone_type: "province",
    base_rate: 3500, // $35.00
    free_threshold: null,
    includes_assembly: false,
  },
  {
    name: "Internacional",
    zone_type: "international",
    base_rate: 5000, // $50.00
    free_threshold: null,
    includes_assembly: false,
  },
]

export default async function seedDelivery({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const delivery: DeliveryPanamaService = container.resolve(DELIVERY_PANAMA_MODULE)

  logger.info("Seeding delivery zones...")

  const existing = await delivery.listDeliveryZones()
  const existingNames = new Set(existing.map((z) => z.name))

  let created = 0
  for (const zone of ZONES) {
    if (!existingNames.has(zone.name)) {
      await delivery.createDeliveryZones(zone)
      created++
    }
  }

  logger.info(
    `Delivery seed complete — ${created} zones created, ${existing.length} already existed`
  )
}
