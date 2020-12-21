module.exports = {
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
    }
  },

  relations: [
    {
      type: 'many:one',
      with: 'role'
    }
  ]
};