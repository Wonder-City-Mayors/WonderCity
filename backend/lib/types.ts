import { TokenPayload } from "@interfaces/jwt"
import Permission from "@models/permission"
import Role from "@models/role"
import User from "@models/user"
import { Request } from "express"

export type ModifiedRequest = Request & {
    user?: User
    jwtPayload?: TokenPayload
    jwt?: string
}

export type SimpleRole = {
    id: number
    name: string
}

export type SimplePermission = {
    type: string
    operation?: string
    target?: string
}

export type PermissionRoleMerged = SimpleRole & SimplePermission

export type PermissionObject =
    | true
    | {
          [key: string]:
              | true
              | {
                    [key: string]: string[]
                }
      }

export type RoleWithPermissions = {
    id: number
    name: string
    permissions: PermissionObject
}
