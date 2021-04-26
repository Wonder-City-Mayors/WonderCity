import AuthController from "@controllers/auth"
import Route from "@interfaces/route"
import { createUserDto, signStationDto } from "@lib/dtos/auth.dto"
import { validationMiddleware } from "@middlewares/validation"
import { Router } from "express"

export default class AuthRoute implements Route {
    router = Router()
    controller = new AuthController()

    path = "/auth"

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(
            "/signUp",
            validationMiddleware(createUserDto, "body"),
            this.controller.signUp,
        )

        this.router.post(
            "/signIn",
            validationMiddleware(createUserDto, "body"),
            this.controller.signIn,
        )

        this.router.post(
            "/signStation",
            validationMiddleware(signStationDto, "body"),
            this.controller.signStation,
        )
    }
}
