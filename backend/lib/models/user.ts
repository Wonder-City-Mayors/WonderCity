import { UserInterface } from "@interfaces/user";
import { Model } from "objection";
import Device from "./device";
import Role from "./role";

/**
 * Модель пользователя в базе данных.
 */
export default class User extends Model implements UserInterface {
    static get tableName() {
        return "user";
    }

    static get relationMappings() {
        return {
            role: {
                relation: Model.HasOneRelation,
                modelClass: Role,
                join: {
                    from: this.tableName + ".roleId",
                    to: Role.tableName + ".id",
                },
            },

            devices: {
                relation: Model.HasManyRelation,
                modelClass: Device,
                join: {
                    from: this.tableName + ".id",
                    to: Device.tableName + ".userId",
                },
            },
        };
    }

    /**
     * Логин пользователя.
     */
    username: string;

    /**
     * Имя пользователя.
     *
     * @remarks
     * Может отсутствовать.
     */
    firstName?: string;

    /**
     * Фамилия пользователя.
     *
     * @remarks
     * Может отсутствовать.
     */
    lastName?: string;

    /**
     * Пароль пользователя.
     *
     * @remarks
     * Хеш-строка длиной 60 символов.
     */
    password: string;

    /**
     * Уникальный идентификатор пользователя.
     */
    id: number;

    /**
     * Уникальный идентификатор роли пользователя.
     *
     * @remarks
     * Внешний ключ.
     * Может отсутствовать.
     */
    roleId?: number;

    /**
     * Адрес электронной почты пользователя.
     *
     * @remarks
     * Может отсутствовать.
     */
    email?: string;
}
