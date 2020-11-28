const jsonify = require("../../../utils/searchToJson");
const { defaults, pick } = require('lodash');

// const commonQuery = (knex, userId) => knex
//   .innerJoin('values_t1 as v1', 'v1.tree_id', 'tree.id')
//   .leftJoin('values_t1 as v2', function () {
//     this
//       .on('v2.tree_id', '=', 'v1.tree_id')
//       .andOn('v2.time_stamp_db', '>', 'v1.time_stamp_db')
//   })
//   .where('tree.user_id', parseInt(userId, 10))
//   .andWhere('v2.id', null);

module.exports = {
  count: async (req, res) => {
    if (req.user) {
      const devices = await wonder.knex
        .count('id')
        .from('tree')
        .where('tree.user_id', req.user.id);

      res.send(devices[0][Object.keys(devices[0])[0]]);
      return;
    }

    res.throw(401);
    return;
  },

  getReadouts: async (req, res) => {
    const page = parseInt(jsonify(req.search).page, 10);

    if (page) {
      if (req.user) {
        const devices = await wonder.query('tree').find({
          user_id: req.user.id,
          _limit: 10,
          _skip: (page - 1) * 10
        })
          .then(trees => Promise.all(trees.map(
            tree => wonder.query('value').findOne({
              tree_id: tree.id,
              _sort: 'time_stamp_db:desc'
            }).then(value => defaults(value, {id: tree.id}))
          )));

        res.send(devices);
        return;
      }

      res.throw(401);
      return;
    }

    res.throw(400);
    return;
  }
};