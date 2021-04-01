import getUser from "@utils/getUser"
import { Request } from "express"

import "expressRequest"

export default async (req: Request) => {
    const sources = [
        req.headers.authorization
            ? req.headers.authorization.substring(0, 6) === "Bearer"
                ? req.headers.authorization.substring(7)
                : req.headers.authorization
            : undefined,
        req?.cookies?.jwt,
        req?.query?.jwt,
        req?.body?.jwt,
    ]

    for (const jwt of sources) {
        req.user = (await getUser(jwt)) || undefined

        if (req.user) return true
    }

    return false
}
