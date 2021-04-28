import { getDb } from "../database/index"
import { getReadoutsDto } from "@dtos/value.dto"
import Device from "@models/device"
import Value from "@models/value"

export default class ValueService {
    async getReadouts(statData: getReadoutsDto, device: Device) {
        const begin = Date.parse(statData.begin) / 1000
        const end =
            (statData.end ? Date.parse(statData.end) : Date.now()) / 1000

        const interval = (end - begin) / statData.parts

        const val: {
            ordering: number
            sum: number
        }[] = (await Value.query()
            .sum("record as sum")
            .select(
                getDb().raw("floor((unix_timestamp(??) - ?) / ?) as ordering", [
                    "timestamp",
                    begin,
                    interval,
                ]),
            )
            .groupBy("ordering")
            .orderBy("ordering")
            .where("deviceId", device.id)
            .andWhereRaw("?? >= from_unixtime(?)", ["timestamp", begin])
            .andWhereRaw("?? <= from_unixtime(?)", ["timestamp", end])) as any

        const arr: number[] = []

        for (let i = 0; i < statData.parts; i++) {
            arr[i] = 0
        }

        for (let i = 0; i < val.length; i++) {
            arr[val[i].ordering] = val[i].sum
        }

        return arr
    }
}
