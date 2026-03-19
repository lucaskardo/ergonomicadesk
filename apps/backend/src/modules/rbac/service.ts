import { MedusaService } from "@medusajs/framework/utils"
import Role from "./models/role"
import Permission from "./models/permission"
import RolePermission from "./models/role-permission"

class RbacModuleService extends MedusaService({ Role, Permission, RolePermission }) {
  /**
   * Returns true if the given role has a permission for the specified
   * resource+action combination.
   */
  async checkPermission(
    roleId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const permissions = await this.listPermissions({ resource, action })

    if (permissions.length === 0) {
      return false
    }

    const permissionIds = permissions.map((p) => p.id)

    const rolePermissions = await this.listRolePermissions({
      role_id: roleId,
      permission_id: permissionIds,
    })

    return rolePermissions.length > 0
  }
}

export default RbacModuleService
