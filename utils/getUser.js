const parsePermissions = array => {
  return array.map(obj => obj.name);
};

export default async jwt => {
  if (jwt) {
    const payload = await mg.services.jwt.verify(jwt);

    if (payload) {
      let user = (await mg.knex
        .select('*')
        .from('user')
        .where('id', payload.id))[0];

      user.permissions = user.role_id ?
        parsePermissions(
          await mg.knex
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