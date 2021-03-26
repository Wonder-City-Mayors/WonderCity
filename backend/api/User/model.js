export default {
  tableName: 'user',
  hasTimestamps: false,

  columns: {
    first_name: {
      type: 'string',
      length: 128
    },

    last_name: {
      type: 'string',
      length: 128
    },

    username: {
      type: 'string',
      length: 32,
      notNull: true,
      unique: true
    },

    password: {
      type: 'password',
      notNull: true
    },

    email: {
      type: 'string',
      length: 256
    }
  },

  relations: [
    {
      type: 'many:one',
      with: 'role'
    }
  ]
};