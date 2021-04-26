import config from "@config"
import { StationTokenPayload, TokenPayload } from "@interfaces/jwt"
import Station from "@models/station"
import User from "@models/user"
import jwt from "jsonwebtoken"
import clone from "lodash/clone"

export function issueByUser(user: User) {
    return issue({
        id: user.id,
    })
}

export function issueByStation(station: Station) {
    return jwt.sign(
        {
            stationId: station.id,
        },
        config.jwtSecret,
        config.jwtConfig,
    )
}

export function issue(payload: TokenPayload, jwtOptions: {} = {}) {
    return jwt.sign(
        clone(payload),
        config.jwtSecret,
        Object.assign(config.jwtConfig, jwtOptions),
    )
}

export function verifyStation(token: string) {
    return new Promise<StationTokenPayload | undefined>(
        function jwtVerifyPromise(resolve, _reject) {
            jwt.verify(
                token,
                config.jwtSecret,
                {},
                (err, tokenPayload: StationTokenPayload) => {
                    if (err) {
                        resolve(undefined)
                    }

                    resolve(tokenPayload)
                },
            )
        },
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
