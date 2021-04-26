import { Model } from "objection"
import User from "./user"
import Value from "./value"

interface Device {
    /**
     * Уникальный идентификатор датчика.
     */
    id: number

    /**
     * Понятия не имею, что это.
     *
     * @remarks
     * Может отсутствовать.
     */
    currId?: string

    /**
     * Понятия не имею, что это.
     *
     * @remarks
     * Может отсутствовать.
     */
    parent?: string

    /**
     * Понятия не имею, что это.
     *
     * @remarks
     * Может отсутствовать.
     */
    text?: string

    /**
     * Понятия не имею, что это.
     *
     * @remarks
     * Может отсутствовать.
     */
    type?: number

    /**
     * Понятия не имею, что это.
     *
     * @remarks
     * Может отсутствовать.
     */
    snC?: number

    /**
     * Понятия не имею, что это.
     *
     * @remarks
     * Может отсутствовать.
     */
    snM?: string

    /**
     * Уникальный идентификатор пользователя, владеющего датчиком.
     *
     * @remarks
     * Может отсутствовать.
     */
    userId?: number

    stationId?: number
}

/**
 * Модель датчика в базе данных.
 */
class Device extends Model {
    static get tableName() {
        return "device"
    }

    static get relationMappings() {
        return {
            user: {
                relation: this.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: this.tableName + ".userId",
                    to: User.tableName + ".id",
                },
            },

            values: {
                relation: this.HasManyRelation,
                modelClass: Value,
                join: {
                    from: this.tableName + ".id",
                    to: Value.tableName + ".deviceId",
                },
            },
        }
    }
}

export default Device
