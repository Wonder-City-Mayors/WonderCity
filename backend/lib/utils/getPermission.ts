import { PermissionObject } from "@lib/types"

export default function getPermission(
    permissions: PermissionObject,
    required: string[],
): string | true | undefined {
    if (permissions === true) {
        return true
    }

    let i = 0
    let current = permissions[required[i++]]

    while (required[i] && Boolean(current) && current.constructor === Object) {
        current = current[required[i++]]
    }

    /* I feel like I'm a hacker... */
    return current as any
}
