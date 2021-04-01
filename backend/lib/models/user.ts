import { Model } from "objection";
import Device from "./device";
import Role from "./role";

interface User {
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

/**
 * Модель пользователя в базе данных.
 */
class User extends Model {
    static get tableName() {
        return "user";
    }

    static get relationMappings() {
        return {
            role: {
                relation: this.HasOneRelation,
                modelClass: Role,
                join: {
                    from: this.tableName + ".roleId",
                    to: Role.tableName + ".id",
                },
            },

            devices: {
                relation: this.HasManyRelation,
                modelClass: Device,
                join: {
                    from: this.tableName + ".id",
                    to: Device.tableName + ".userId",
                },
            },
        };
    }
}

export default User;
