import DeviceController from "@controllers/device"
import Route from "@interfaces/route"
import { validateJwtPayload } from "@middlewares/validation"
import { Router } from "express"

export default class DeviceRoute implements Route {
    controller = new DeviceController()
    router = Router()
    path = "/device"

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/count", validateJwtPayload(), this.controller.count)
        this.router.get(
            "/getReadouts",
            validateJwtPayload(),
            this.controller.getReadouts,
        )
        this.router.get(
            "/isMine",
            validateJwtPayload(),
            this.controller.getReadouts,
        )
    }
}
