import cache from "@lib/cache"
import { verify } from "@lib/jwt"
import {
    PermissionObject,
    PermissionRoleMerged,
    ResponseUserWithRole,
    RoleWithPermissions,
    SimplePermission,
    UserWithRole,
} from "@lib/types"
import Role from "@models/role"
import User from "@models/user"
import { has, orderBy, set } from "lodash"

export async function getAllRoles(): Promise<RoleWithPermissions[]> {
    const joined: PermissionRoleMerged[] = (await Role.query()
        .select(
            "role.id",
            "role.name",
            "permissions.type",
            "permissions.operation",
            "permissions.target",
        )
        .leftJoinRelated("permissions")
        .orderBy("role.id")) as any[]

    const roles: RoleWithPermissions[] = []
    let previous: number | undefined
    let permissions: SimplePermission[] = []

    for (let i = 0; i < joined.length; i++) {
        if (joined[i].id !== previous) {
            if (roles.length > 0) {
                roles[roles.length - 1].permissions = parsePermissions(
                    permissions,
                )
                permissions = []
            }

            roles.push({
                id: joined[i].id,
                name: joined[i].name,
                permissions: {},
            })

            previous = joined[i].id
        }

        permissions.push(joined[i])
    }

    if (roles.length > 0) {
        roles[roles.length - 1].permissions = parsePermissions(permissions)
    }

    return roles
}

export const isEmpty = (value: any): boolean => {
    if (value === null) {
        return true
    } else if (typeof value !== "number" && value === "") {
        return true
    } else if (value === "undefined" || value === undefined) {
        return true
    } else if (typeof value === "object" && !Object.keys(value).length) {
        return true
    }

    return false
}

export function parsePermissions(
    permissionsArray: SimplePermission[],
): PermissionObject {
    if (permissionsArray.length > 0 && permissionsArray[0].type == "*")
        return true

    const permissionObject: PermissionObject = {}

    for (const permission of permissionsArray) {
        if (permission.operation) {
            if (permission.target) {
                if (
                    has(permissionObject, [
                        permission.type,
                        permission.operation,
                    ])
                ) {
                    permissionObject[permission.type][
                        permission.operation
                    ].push(permission.target)
                } else {
                    set(
                        permissionObject,
                        [permission.type, permission.operation],
                        [permission.target],
                    )
                }
            } else {
                set(
                    permissionObject,
                    [permission.type, permission.operation],
                    true,
                )
            }
        } else {
            set(permissionObject, permission.type, true)
        }
    }

    return permissionObject
}

export async function getUser(jwt: string): Promise<UserWithRole | undefined> {
    if (jwt) {
        const payload = await verify(jwt)

        if (payload) {
            const user = await User.query().findById(payload.id)

            return Object.assign(user, {
                role: cache.roles[user.roleId || 0],
            })
        }
    }

    return undefined
}

export async function getResponseUser(
    jwt: string,
): Promise<ResponseUserWithRole | undefined> {
    if (jwt) {
        const payload = await verify(jwt)

        if (payload) {
            const user = await User.query().findById(payload.id)

            return Object.assign(user.toResponseUser(), {
                role: cache.roles[user.roleId || 0],
            })
        }
    }

    return undefined
}
