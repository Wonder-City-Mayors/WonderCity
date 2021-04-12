import HttpException from "@exceptions/HttpException"
import { ModifiedRequest } from "@lib/types"
import Device from "@models/device"
import DeviceService from "@services/device"
import { Response } from "express"
import { baseController } from "."

export default class DeviceController {
    service = new DeviceService()

    count = baseController(async (req: ModifiedRequest, res: Response) => {
        if (req.jwtPayload) {
            res.status(200).json(
                await Device.query()
                    .first()
                    .count("*", {
                        as: "count",
                    })
                    .where("userId", req.jwtPayload?.id),
            )
        }
    })

    getReadouts = baseController(
        async (req: ModifiedRequest, res: Response) => {
            if (req.jwtPayload) {
                res.status(200).json(
                    await this.service.getReadouts(
                        req.jwtPayload.id,
                        typeof req.query.page === "string"
                            ? parseInt(req.query.page, 10)
                            : 1,
                    ),
                )
            }
        },
    )
}
