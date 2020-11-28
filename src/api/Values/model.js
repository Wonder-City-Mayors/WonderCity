module.exports = {
  tableName: 'value',
  hasTimestamps: false,

  columns: {
    time_stamp_db: {
      type: 'datetime'
    },

    power: {
      type: 'float'
    },

    energy: {
      type: 'float'
    }
  },

  relations: [
    {
      type: 'many:one',
      with: 'tree'
    }
  ]
};