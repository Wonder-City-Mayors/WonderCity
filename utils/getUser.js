const parsePermissions = array => array.map(obj => obj.name);

module.exports = async jwt => {
  if (jwt) {
    const payload = await wonder.services.jwt.verify(jwt);

    if (payload) {
      let user = (await wonder.knex
        .select('*')
        .from('user')
        .where('id', payload.id))[0];

      user.permissions = user.role_id ?
        parsePermissions(
          await wonder.knex
            .select('permission.*')
            .from('permission')
            .innerJoin(
              'permission_role',
              'permission_role.permission_id',
              'permission.id'
            )
            .where('permission_role.role_id', user.role_id)
        ) :
        [];

      return user;
    }
  }

  return null;
};