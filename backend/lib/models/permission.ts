import { Model } from "objection";
import PermissionRoleJunction from "./permissionRole.junction";
import Role from "./role";

interface Permission {
    /**
     * Уникальный идентификатор разрешения.
     */
    id: number;

    /**
     * Тип разрешения.
     *
     * @remarks
     * Может принимать значение "*".
     * В таком случае считается, что у роли есть все разрешения.
     */
    type: string;

    /**
     * Действие разрешения.
     *
     * @remarks
     * Может отсутствовать.
     * В таком случае считается, что текущей роли дозволены
     * все действия указанного типа разрешения.
     *
     * @see {@link type | Тип}
     */
    operation?: string;

    /**
     * Цель, на которую направлено действие разрешения.
     *
     * @remarks
     * Может отсутствовать.
     * В таком случае считается, что текущей роли
     * позволено осуществлять действия над любыми целями.
     */
    target?: string;
}

/**
 * Модель разрешения в базе данных.
 */
class Permission extends Model {
    static get tableName() {
        return "permission";
    }

    static get relationMappings() {
        return {
            roles: {
                relation: this.ManyToManyRelation,
                modelClass: Role,
                join: {
                    from: this.tableName + ".id",

                    through: {
                        from:
                            PermissionRoleJunction.tableName + ".permissionId",
                        to: PermissionRoleJunction.tableName + ".roleId",
                    },

                    to: Role.tableName + ".id",
                },
            },
        };
    }
}

export default Permission;
