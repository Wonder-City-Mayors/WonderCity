const pick = require('lodash/pick');
const bcrypt = require('bcrypt');
const { merge } = require('lodash');

const parsePermissions = array => {
  return array.map(obj => obj.name);
};

module.exports = {
  signUp: async (req, res) => {
    const { username, password } = req.body;

    if (
      password &&
      username &&
      password.length >= 8 &&
      !/[^0-9a-zA-Z#$*_]/.test(username)
    ) {
      const potentiallyExistingUser = await wonder
        .query('user')
        .findOne({username});


      if (potentiallyExistingUser) {
        const userId = await wonder.knex.transaction(trx => {
          const date = new Date();

          return bcrypt.hash(password, 10)
            .then(hash => (
              trx.insert({
                first_name: '',
                last_name: '',
                password: hash,
                username
              })
              .into('user')
              .then(userId => userId[0])
            ));
            
        });

        const jwt = wonder.services.jwt.issue({
          id: userId
        });

        res.send({
          jwt,
          data: {
            isAuthenticated: true,
            first_name: 'Аноним',
            last_name: 'Анонимус',
            permissions: [],
            username
          }
        });

        return;
      }

      res.throw(403);

      return;
    }
  
    res.throw(400);
  
    return;
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
  
    if (
      password &&
      username &&
      password.length >= 8 &&
      !/[^0-9a-zA-Z#$*_]/.test(username)
    ) {
      const user = await wonder.query('user').findOne({ username });
      
      if (
        user &&
        await bcrypt.compare(password, String(user.password))
      ) {
        const jwt = wonder.services.jwt.issue({
          id: user.id
        });
  
        const permissions = user.role_id ?
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
  
        res.send({
          jwt,
          data: Object.assign({
            isAuthenticated: true,
            permissions,
          }, pick(user, ['first_name', 'last_name', 'username']))
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
