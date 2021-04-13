import jwt from "jsonwebtoken"
import clone from "lodash/clone"

import config from "@config"
import { TokenPayload } from "@interfaces/jwt"
import User from "@models/user"

export function issueByUser(user: User) {
    return issue({
        id: user.id,
    })
}

export function issue(payload: TokenPayload, jwtOptions: {} = {}) {
    return jwt.sign(
        clone(payload),
        config.jwtSecret,
        Object.assign(config.jwtConfig, jwtOptions),
    )
}

export function verify(token: string) {
    return new Promise<TokenPayload | undefined>(function jwtVerifyPromise(
        resolve,
        _reject,
    ) {
        jwt.verify(
            token,
            config.jwtSecret,
            {},
            (err, tokenPayload: TokenPayload) => {
                if (err) {
                    resolve(undefined)
                }

                resolve(tokenPayload)
            },
        )
    })
}
