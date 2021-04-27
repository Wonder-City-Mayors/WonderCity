import ValueController from "@controllers/value"
import { getReadoutsDto } from "@dtos/value.dto"
import Route from "@interfaces/route"
import {
    validateJwtPayload,
    validationMiddleware,
} from "@middlewares/validation"
import { Router } from "express"

export default class ValueRoute implements Route {
    controller = new ValueController()
    router = Router()
    path = "/value"

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(
            "/stats",
            validateJwtPayload(),
            validationMiddleware(getReadoutsDto, "query", true),
            this.controller.getStat,
        )
    }
}
