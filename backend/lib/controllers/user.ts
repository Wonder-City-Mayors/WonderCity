import HttpException from "@exceptions/HttpException"
import { jwtDto } from "@lib/dtos/user.dto"
import { ModifiedRequest } from "@lib/types"
import UserService from "@services/user"
import { NextFunction, Response } from "express"
import { baseController } from "."

export default class UserController {
    service = new UserService()

    me = baseController(async (req: ModifiedRequest, res: Response) => {
        res.status(200).json(
            await this.service.me({
                jwt: req.jwt || "",
            }),
        )
    })

    addDevice = baseController(async (req: ModifiedRequest, res: Response) => {
        if (req.user) {
            await this.service.addDevice(req.user, req.body)
            res.status(200).end()
        }
    })

    changeName = baseController(async (req: ModifiedRequest, res: Response) => {
        if (req.user) {
            await this.service.changeFirstName(req.user, req.body)
            res.status(200).end()
        }
    })

    changeLastName = baseController(
        async (req: ModifiedRequest, res: Response) => {
            if (req.user) {
                await this.service.changeLastName(req.user, req.body)
                res.status(200).end()
            }
        },
    )

    changeEmail = baseController(
        async (req: ModifiedRequest, res: Response) => {
            if (req.user) {
                await this.service.changeEmail(req.user, req.body)
                res.status(200).end()
            }
        },
    )

    changePassword = baseController(
        async (req: ModifiedRequest, res: Response) => {
            if (req.user) {
                await this.service.changePassword(req.user, req.body)
                res.status(200).end()
            }
        },
    )
}
