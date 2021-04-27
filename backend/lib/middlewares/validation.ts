import HttpException from "@exceptions/HttpException"
import { verify, verifyStation } from "@lib/jwt"
import { ModifiedRequest } from "@lib/types"
import { getUser } from "@utils"
import { plainToClass } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import { NextFunction, RequestHandler } from "express"

export function validationMiddleware(
    type: any,
    value: "body" | "query" | "params" = "body",
    skipMissingProperties: boolean = false,
): RequestHandler {
    return function requestHandler(req, _res, next) {
        req[value] = plainToClass(type, req[value])

        validate(req[value], {
            skipMissingProperties,
        }).then(function (errors: ValidationError[]) {
            if (errors.length > 0) {
                next(
                    new HttpException(
                        400,
                        errors
                            .map(
                                (error: ValidationError) =>
                                    error.constraints &&
                                    Object.values(error.constraints),
                            )
                            .join(", "),
                    ),
                )
            } else {
                next()
            }
        })
    }
}

export const validateJwt = () =>
    buildValidationPolicy(function (req: ModifiedRequest, jwt: string) {
        req.jwt = jwt

        return Promise.resolve(true)
    })

export const validateStation = () =>
    buildValidationPolicy(async (req: ModifiedRequest, jwt: string) =>
        Boolean((req.stationPayload = await verifyStation(jwt))),
    )

export const validateJwtPayload = () =>
    buildValidationPolicy(async (req: ModifiedRequest, jwt: string) =>
        Boolean((req.jwtPayload = await verify(jwt))),
    )

export const validateUser = () =>
    buildValidationPolicy(async (req: ModifiedRequest, jwt: string) =>
        Boolean((req.user = await getUser(jwt))),
    )

function buildValidationPolicy(
    onSucess: (req: ModifiedRequest, jwt: string) => Promise<boolean>,
) {
    return async function validationPolicy(
        req: ModifiedRequest,
        _res: any,
        next: NextFunction,
    ) {
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
            if (jwt && (await onSucess(req, jwt))) {
                next()
                return
            }
        }

        next(new HttpException(401, "Некорректный токен авторизации."))
    }
}
