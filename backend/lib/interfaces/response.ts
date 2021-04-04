import Role from "@models/role"

export interface ResponseUser {
    id: number
    username: string
    firstName?: string
    lastName?: string
    email?: string
}
