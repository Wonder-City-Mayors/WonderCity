import UserController from "@controllers/user"
import Route from "@interfaces/route"
import { validateJwt } from "@middlewares/validation"
import { Router } from "express"

export default class UserRoute implements Route {
    router = Router()
    controller = new UserController()

    path = "/user"

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/me", validateJwt(), this.controller.me)
    }
}
