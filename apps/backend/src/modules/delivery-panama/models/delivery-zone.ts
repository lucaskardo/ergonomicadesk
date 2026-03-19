import { model } from "@medusajs/framework/utils"

const DeliveryZone = model.define("delivery_zone", {
  id: model.id().primaryKey(),
  name: model.text(),
  zone_type: model.enum(["pickup", "panama_city", "province", "international"]),
  base_rate: model.number().default(0),
  free_threshold: model.number().nullable(),
  includes_assembly: model.boolean().default(false),
  active: model.boolean().default(true),
})

export default DeliveryZone
