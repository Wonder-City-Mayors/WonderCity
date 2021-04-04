import HttpException from "@exceptions/HttpException"
import { ModifiedRequest } from "@lib/types"
import { plainToClass } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import { NextFunction, RequestHandler, Response } from "express"

export function validationMiddleware(
    type: any,
    value: "body" | "query" | "params" = "body",
    skipMissingProperties: boolean = false,
): RequestHandler {
    return function requestHandler(req, res, next) {
        validate(plainToClass(type, req[value]), {
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

function buildValidationPolicy(
    onSucess: (req: ModifiedRequest, jwt: string) => Promise<boolean>,
) {
    return async function validationPolicy(
        req: ModifiedRequest,
        _res: Response,
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
