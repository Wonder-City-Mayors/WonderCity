/**
 * Связка моделей роли и разрешения в базе данных.
 */
export default class PermissionRoleJunction {
    static get tableName() {
        return "permission_role";
    }
}
