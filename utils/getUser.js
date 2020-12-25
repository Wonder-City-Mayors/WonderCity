const get = require('lodash/get');
const has = require('lodash/has');
const set = require('lodash/set');

const parsePermissions = (permissionsArray = []) => {
  let permissionObject = new Object();

  for (const permission of permissionsArray) {
    if (permission.operation) {
      if (permission.role_id) {
        if (has(
          permissionObject,
          [permission.type, permission.operation]
        )) {
          permissionObject[type][operation].push(permission.role_id);
        } else {
          set(permissionObject, [
            permission.type,
            permission.operation
          ], [permission.role_id]);
        }
      } else {
        set(permissionObject, [
          permission.type,
          permission.operation
        ], true);
      }
    } else {
      set(permissionObject, permission.type, true);
    }
  }

  return permissionObject;
};

module.exports = async jwt => {
  if (jwt) {
    const payload = await wonder.services.jwt.verify(jwt);

    if (payload) {
      const user = await wonder.query('user').findOne({
        id: payload.id
      }, ['role.permission']);

      user.permissions = parsePermissions(get(user, [
        '_relations',
        'role',
        '_relations',
        'permission'
        // await wonder.knex
        //   .select('permission.*')
        //   .from('permission')
        //   .innerJoin(
        //     'permission_role',
        //     'permission_role.permission_id',
        //     'permission.id'
        //   )
        //   .where('permission_role.role_id', user.role_id)
      ]));

      return user;
    }
  }

  return null;
};