import { Model } from "objection"
import Permission from "./permission"
import PermissionRoleJunction from "./permissionRole.junction"
import User from "./user"

interface Role {
    /**
     * Уникальный идентификатор роли.
     */
    id: number

    /**
     * Название роли.
     */
    name: string
}

/**
 * Модель роли в базе данных.
 */
class Role extends Model {
    static tableName = "role"

    static get relationMappings() {
        return {
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: Role.tableName + ".id",
                    to: User.tableName + ".roleId",
                },
            },

            permissions: {
                relation: Model.ManyToManyRelation,
                modelClass: Permission,
                join: {
                    from: Role.tableName + ".id",

                    through: {
                        from: PermissionRoleJunction.tableName + ".roleId",
                        to: PermissionRoleJunction.tableName + ".permissionId",
                    },

                    to: Permission.tableName + ".id",
                },
            },
        }
    }
}

export default Role
