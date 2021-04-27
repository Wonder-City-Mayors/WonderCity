import { getReadoutsDto } from "@dtos/value.dto"
import HttpException from "@exceptions/HttpException"
import { ModifiedRequest } from "@lib/types"
import Device from "@models/device"
import ValueService from "@services/value"
import { Response } from "express"
import { baseController } from "."

export default class ValueController {
    service = new ValueService()

    getStat = baseController(async (req: ModifiedRequest, res: Response) => {
        if (!req.jwtPayload) {
            throw new HttpException(403, "whoami")
        }

        const statData: getReadoutsDto = req.query as any
        const device = await Device.query().findById(statData.deviceId)

        if (device.userId !== req.jwtPayload.id) {
            throw new HttpException(403, "Ah-ah-ah!")
        }

        res.status(200).json(await this.service.getReadouts(statData, device))
    })

    predict = baseController(async (req: ModifiedRequest, res: Response) => {
        res.status(200).json({})
    })
}
