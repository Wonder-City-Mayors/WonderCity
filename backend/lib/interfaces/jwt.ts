import { ResponseUser } from "./response"

export interface TokenPayload {
    id: number
}

export interface UserWithJwt {
    data: ResponseUser
    jwt: string
}
