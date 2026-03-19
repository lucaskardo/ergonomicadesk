import { model } from "@medusajs/framework/utils"

const Role = model.define("rbac_role", {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  description: model.text().nullable(),
})

export default Role
