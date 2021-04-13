import Role from "@models/role"
import { RoleWithPermissions } from "./types"

interface ServerCache {
    connectedUsers: {
        [key: string]: {
            [key: string]: Set<number>
        }
    }
    roles: {
        [key: string]: RoleWithPermissions
    }
}

const cache: ServerCache = {
    connectedUsers: {},
    roles: {},
}

export default cache
