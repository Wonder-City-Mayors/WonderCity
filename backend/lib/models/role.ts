import RoleInterface from "@interfaces/role";
import { Model } from "objection";
import Permission from "./permission";
import PermissionRoleJunction from "./permissionRole.junction";
import User from "./user";

/**
 * Модель роли в базе данных.
 */
export default class Role extends Model implements RoleInterface {
    static get tableName() {
        return "role";
    }

    static get relationMappings() {
        return {
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: this.tableName + ".id",
                    to: User.tableName + ".roleId",
                },
            },

            permissions: {
                relation: Model.ManyToManyRelation,
                modelClass: Permission,
                join: {
                    from: this.tableName + ".id",

                    through: {
                        from: PermissionRoleJunction.tableName + ".roleId",
                        to: PermissionRoleJunction.tableName + ".permissionId",
                    },

                    to: Permission.tableName + ".id",
                },
            },
        };
    }

    /**
     * Уникальный идентификатор роли.
     */
    id: number;

    /**
     * Название роли.
     */
    name: string;
}
