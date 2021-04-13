import ValueController from "@controllers/value"
import Route from "@interfaces/route"
import { validateJwtPayload } from "@middlewares/validation"
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
            "/statDay",
            validateJwtPayload(),
            this.controller.statDay,
        )
        this.router.get(
            "/statMonth",
            validateJwtPayload(),
            this.controller.statMonth,
        )
        this.router.get(
            "/statYear",
            validateJwtPayload(),
            this.controller.statYear,
        )
        this.router.get(
            "/statPrediction",
            validateJwtPayload(),
            this.controller.statPrediction,
        )
    }
}
