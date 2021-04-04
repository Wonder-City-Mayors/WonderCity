import { createUserDto } from "@dtos/auth.dto"
import AuthService from "@services/auth"
import { NextFunction, Request, Response } from "express"

export default class AuthController {
    service = new AuthService()

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: createUserDto = req.body

            res.status(201).json(await this.service.signUp(userData))
        } catch (error) {
            next(error)
        }
    }

    signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: createUserDto = req.body

            res.status(200).json(await this.service.signIn(userData))
        } catch (error) {
            next(error)
        }
    }
}
