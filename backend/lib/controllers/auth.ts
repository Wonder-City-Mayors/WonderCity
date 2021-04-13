import { createUserDto } from "@dtos/auth.dto"
import AuthService from "@services/auth"
import { NextFunction, Request, Response } from "express"
import { baseController } from "."

export default class AuthController {
    service = new AuthService()

    signUp = baseController(async (req: Request, res: Response) => {
        const userData: createUserDto = req.body

        res.status(201).json(await this.service.signUp(userData))
    })

    signIn = baseController(async (req: Request, res: Response) => {
        const userData: createUserDto = req.body

        res.status(200).json(await this.service.signIn(userData))
    })
}
