import RbacModuleService from "./service"

/**
 * Unit tests for RbacModuleService.checkPermission.
 *
 * We use Object.create to bypass the Medusa container constructor and spy on
 * the generated list methods directly on the instance.
 */

function makeService(
  permissions: Array<{ id: string; action: string; resource: string }>,
  rolePermissions: Array<{ id: string; role_id: string; permission_id: string }>
) {
  const svc = Object.create(RbacModuleService.prototype) as RbacModuleService
  // Stub the generated list methods so no DB is needed
  ;(svc as any).listPermissions = jest.fn().mockResolvedValue(permissions)
  ;(svc as any).listRolePermissions = jest.fn().mockResolvedValue(rolePermissions)
  return svc
}

describe("RbacModuleService.checkPermission", () => {
  it("returns true for admin role with write permission on products", async () => {
    const svc = makeService(
      [{ id: "perm_1", action: "write", resource: "products" }],
      [{ id: "rp_1", role_id: "role_admin", permission_id: "perm_1" }]
    )

    const result = await svc.checkPermission("role_admin", "products", "write")

    expect(result).toBe(true)
  })

  it("returns false for sales_associate role with write permission on products", async () => {
    const svc = makeService(
      [{ id: "perm_1", action: "write", resource: "products" }],
      [] // no RolePermission linking sales_associate to write/products
    )

    const result = await svc.checkPermission("role_sales", "products", "write")

    expect(result).toBe(false)
  })

  it("returns true for sales_associate role with read permission on orders", async () => {
    const svc = makeService(
      [{ id: "perm_2", action: "read", resource: "orders" }],
      [{ id: "rp_2", role_id: "role_sales", permission_id: "perm_2" }]
    )

    const result = await svc.checkPermission("role_sales", "orders", "read")

    expect(result).toBe(true)
  })
})
