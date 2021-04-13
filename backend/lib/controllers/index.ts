import { ModifiedRequest } from "@lib/types"
import { NextFunction, Response } from "express"

export const baseController = (
    derivative: (req: ModifiedRequest, res: Response) => Promise<void>,
) => async (req: ModifiedRequest, res: Response, next: NextFunction) => {
    try {
        await derivative(req, res)
    } catch (e) {
        next(e)
    }
}
