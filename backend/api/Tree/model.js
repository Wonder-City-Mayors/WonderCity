module.exports = {
  tableName: 'tree',

  columns: {
    curr_id: {
      type: 'text'
    },

    parent: {
      type: 'text'
    },

    text: {
      type: 'text'
    },

    type: {
      type: 'int'
    },

    sn_c: {
      type: 'int'
    },

    sn_m: {
      type: 'text'
    }
  },

  relations: [{
    type: 'many:one',
    with: 'user'
  }]
};