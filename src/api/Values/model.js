module.exports = {
  tableName: 'value',
  hasTimestamps: false,

  columns: {
    time_stamp_db: {
      type: 'datetime'
    },

    last_record: {
      type: 'float',
      default: 0
    }
  },

  relations: [
    {
      type: 'many:one',
      with: 'tree'
    }
  ]
};