import UserController from "@controllers/user"
import Route from "@interfaces/route"
import { validateJwt, validateUser } from "@middlewares/validation"
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
        this.router.post(
            "/addDevice",
            validateUser(),
            this.controller.addDevice,
        )
        this.router.post(
            "/changeName",
            validateUser(),
            this.controller.changeName,
        )
        this.router.post(
            "/changeLastName",
            validateUser(),
            this.controller.changeLastName,
        )
        this.router.post(
            "/changeEmail",
            validateUser(),
            this.controller.changeEmail,
        )
        this.router.post(
            "/changePassword",
            validateUser(),
            this.controller.changePassword,
        )
    }
}
