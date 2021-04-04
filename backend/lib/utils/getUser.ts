import { verify } from "@lib/jwt"
import User from "@models/user"
import { has, set } from "lodash"

interface Permission {
    type: string
    operation?: string
    target?: string
}

function parsePermissions(permissionsArray: Permission[]): {} | true {
    if (permissionsArray.length > 0 && permissionsArray[0].type == "*")
        return true

    const permissionObject = {}

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

export default async function getUser(jwt: string): Promise<User | undefined> {
    if (jwt) {
        const payload = await verify(jwt)

        if (payload) {
            const user = await User.query()
                .findById(payload.id)
                .joinRelated("role.permissions")

            return user
        }
    }

    return undefined
}
