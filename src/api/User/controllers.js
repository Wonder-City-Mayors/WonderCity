const pick = require('lodash/pick');

const parsePermissions = array => {
  return array.map(obj => obj.name);
};

module.exports = {
  signUp: async (req, res) => {

  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
  
    if (
      password &&
      username &&
      password.length > 8 &&
      !/[^0-9a-zA-Z#$*_]/.test(username)
    ) {
      const user = (await mg.knex
        .select('*')
        .from('user')
        .where('username', username))[0];
  
      if (
        user &&
        await bcrypt.compare(password, String(user.password))
      ) {
        const jwt = mg.services.jwt.issue({
          id: user.id
        });
  
        const permissions = user.role_id ?
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
  
        res.send({
          jwt,
          data: Object.assign({
            permissions
          }, pick(user, ['first_name', 'last_name', 'username', 'permissions']))
        });
  
        return;
      }
  
      res.throw(401);
  
      return;
    }
  
    res.throw(400);
  
    return;
  }
};
