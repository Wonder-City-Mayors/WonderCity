import { Model } from "objection"
import Device from "./device"

interface Value {
    /**
     * Время получения показания сервером.
     */
    timestamp: string

    /**
     * Значение показания.
     */
    record: number

    /**
     * Уникальный идентификатор показания.
     */
    id: number

    /**
     * Уникальный идентификатор датчика показания.
     */
    deviceId: number
}

/**
 * Модель показания в базе данных.
 */
class Value extends Model {
    static get tableName() {
        return "value"
    }

    static get relationMappings() {
        return {
            device: {
                relation: this.BelongsToOneRelation,
                modelClass: Device,
                join: {
                    from: this.tableName + ".deviceId",
                    to: Device.tableName + ".id",
                },
            },
        }
    }
}

export default Value
