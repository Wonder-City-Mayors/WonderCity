import Device from "@models/device"
import Value from "@models/value"
import { addHours, addDays, addMonths } from "date-and-time"

function functionConstructor(
    readoutsCount: number,
    reduceFunction: (date: Date, count: number) => Date,
    toSave: number,
    reduceCount: number = -1,
) {
    return async function (device: Device, timezone: number) {
        const upperThreshold = new Date()
        const lowerThreshold = new Date(
            toSave-- > 0 ? upperThreshold.getFullYear() : 0,
            toSave-- > 0 ? upperThreshold.getMonth() : 0,
            toSave-- > 0 ? upperThreshold.getDate() : 0,
            toSave-- > 0 ? upperThreshold.getHours() : 0,
            toSave-- > 0 ? upperThreshold.getMinutes() : 0,
            toSave-- > 0 ? upperThreshold.getSeconds() : 0,
            toSave-- > 0 ? upperThreshold.getMilliseconds() : 0,
        )

        const resultArray: {
            value: Value
            timestamp: string
        }[] = []

        for (let i = 0; i < readoutsCount; i += 1) {
            resultArray.push({
                value: await Value.query()
                    .first()
                    .where("id", device.id)
                    .andWhere("timestamp", ">=", lowerThreshold)
                    .andWhere("timestamp", "<", upperThreshold),
                timestamp: new Date(
                    lowerThreshold.getTime() - timezone * 60000,
                ).toISOString(),
            })

            upperThreshold.setTime(lowerThreshold.getTime())
            lowerThreshold.setTime(
                reduceFunction(lowerThreshold, reduceCount).getTime(),
            )
        }

        return resultArray
    }
}

export default class ValueService {
    statDay = functionConstructor(24, addHours, 4)
    statMonth = functionConstructor(30, addDays, 3)
    statYear = functionConstructor(12, addMonths, 2)
}
