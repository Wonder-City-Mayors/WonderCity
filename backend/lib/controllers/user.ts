import { getMeDto } from "@lib/dtos/user.dto"
import { ModifiedRequest } from "@lib/types"
import UserService from "@services/user"
import { NextFunction, Request, Response } from "express"

export default class UserController {
    service = new UserService()

    me = async (req: ModifiedRequest, res: Response, next: NextFunction) => {
        try {
            const payload: getMeDto = {
                jwt: req.jwt || "",
            }

            res.status(201).json(await this.service.me(payload))
        } catch (e) {
            next(e)
        }
    }
}
