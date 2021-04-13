import { TokenPayload } from "@interfaces/jwt"
import { ResponseUser } from "@interfaces/response"
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

export type UserWithRole = User & RoleWithPermissionsOwner

export type ResponseUserWithRole = ResponseUser & RoleWithPermissionsOwner

interface RoleWithPermissionsOwner {
    role?: RoleWithPermissions
}
