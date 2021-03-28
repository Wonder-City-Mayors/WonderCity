import ValueInterface from "@interfaces/value";
import { Model } from "objection";
import Device from "./device";

/**
 * Модель показания в базе данных.
 */
export default class Value extends Model implements ValueInterface {
    static get tableName() {
        return "value";
    }

    static get relationMappings() {
        return {
            device: {
                relation: Model.BelongsToOneRelation,
                modelClass: Device,
                join: {
                    from: this.tableName + ".deviceId",
                    to: Device.tableName + ".id",
                },
            },
        };
    }

    /**
     * Время получения показания сервером.
     */
    timestamp: string;

    /**
     * Значение показания.
     */
    record: number;

    /**
     * Уникальный идентификатор показания.
     */
    id: number;

    /**
     * Уникальный идентификатор датчика показания.
     */
    deviceId: number;
}
