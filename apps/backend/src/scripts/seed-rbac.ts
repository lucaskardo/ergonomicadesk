import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { RBAC_MODULE } from "../modules/rbac"
import RbacModuleService from "../modules/rbac/service"

type PermissionInput = { action: "read" | "write" | "delete"; resource: string }

const ADMIN_PERMISSIONS: PermissionInput[] = [
  "products",
  "orders",
  "customers",
  "inventory",
  "users",
  "settings",
  "analytics",
  "payments",
].flatMap((resource) =>
  (["read", "write", "delete"] as const).map((action) => ({ action, resource }))
)

const SALES_ASSOCIATE_PERMISSIONS: PermissionInput[] = [
  "orders",
  "customers",
  "inventory",
  "analytics",
  "payments",
].map((resource) => ({ action: "read", resource }))

export default async function seedRbac({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const rbac: RbacModuleService = container.resolve(RBAC_MODULE)

  logger.info("Seeding RBAC roles and permissions...")

  // ── Upsert all permissions ─────────────────────────────────────────────────
  const allInputs = [...ADMIN_PERMISSIONS, ...SALES_ASSOCIATE_PERMISSIONS]

  // Deduplicate by action+resource
  const unique = allInputs.filter(
    (p, idx, arr) =>
      arr.findIndex((q) => q.action === p.action && q.resource === p.resource) === idx
  )

  const existingPerms = await rbac.listPermissions()
  const permMap = new Map(
    existingPerms.map((p) => [`${p.action}:${p.resource}`, p.id])
  )

  for (const { action, resource } of unique) {
    const key = `${action}:${resource}`
    if (!permMap.has(key)) {
      const perm = await rbac.createPermissions({ action, resource })
      permMap.set(key, perm.id)
    }
  }

  // ── Upsert roles ───────────────────────────────────────────────────────────
  async function upsertRole(name: string, description: string) {
    const [existing] = await rbac.listRoles({ name })
    if (existing) return existing
    return rbac.createRoles({ name, description })
  }

  const adminRole = await upsertRole(
    "admin",
    "Full access to all resources"
  )
  const salesRole = await upsertRole(
    "sales_associate",
    "Read access to orders, customers, inventory, analytics, payments"
  )

  // ── Assign permissions to roles ────────────────────────────────────────────
  async function assignPermissions(
    roleId: string,
    permissions: PermissionInput[]
  ) {
    for (const { action, resource } of permissions) {
      const permId = permMap.get(`${action}:${resource}`)!
      const [existing] = await rbac.listRolePermissions({
        role_id: roleId,
        permission_id: permId,
      })
      if (!existing) {
        await rbac.createRolePermissions({ role_id: roleId, permission_id: permId })
      }
    }
  }

  await assignPermissions(adminRole.id, ADMIN_PERMISSIONS)
  await assignPermissions(salesRole.id, SALES_ASSOCIATE_PERMISSIONS)

  logger.info(
    `RBAC seed complete — admin: ${ADMIN_PERMISSIONS.length} permissions, ` +
    `sales_associate: ${SALES_ASSOCIATE_PERMISSIONS.length} permissions`
  )
}
