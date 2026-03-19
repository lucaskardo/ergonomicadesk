import { model } from "@medusajs/framework/utils"

const Permission = model.define("rbac_permission", {
  id: model.id().primaryKey(),
  action: model.enum(["read", "write", "delete"]),
  resource: model.text(),
})

export default Permission
