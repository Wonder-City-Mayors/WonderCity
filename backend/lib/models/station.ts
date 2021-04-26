import { Model } from "objection"
import Device from "./device"

interface Station {
    password: Buffer
    id: number
}

class Station extends Model {
    static get tableName() {
        return "base_station"
    }

    static get relationMappings() {
        return {
            devices: {
                relation: this.HasManyRelation,
                modelClass: Device,
                join: {
                    from: this.tableName + ".id",
                    to: Device.tableName + ".deviceId",
                },
            },
        }
    }
}

export default Station
