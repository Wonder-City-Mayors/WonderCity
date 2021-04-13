import { ModifiedRequest } from "@lib/types"
import ValueService from "@services/value"
import { Response } from "express"
import { baseController } from "."

export default class ValueController {
    service = new ValueService()

    statDay = baseController(async (req: ModifiedRequest, res: Response) => {
        res.status(200).json({})
    })

    statMonth = baseController(async (req: ModifiedRequest, res: Response) => {
        res.status(200).json({})
    })

    statYear = baseController(async (req: ModifiedRequest, res: Response) => {
        res.status(200).json({})
    })

    statPrediction = baseController(
        async (req: ModifiedRequest, res: Response) => {
            res.status(200).json({})
        },
    )
}
