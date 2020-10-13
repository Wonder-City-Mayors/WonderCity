const jsonify = require("../../../utils/searchToJson");

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
        const devices = await wonder.knex.transaction(trx => trx
          .select('id')
          .from('tree')
          .where('tree.user_id', req.user.id)
          .limit(10)
          .offset((page - 1) * 10)
          .then(trees => Promise.all(trees.map(
            tree => new Promise((resolve, reject) => {
              trx.select('time_stamp_db', 'power')
                .from('values_t1')
                .where('tree_id', tree.id)
                .orderBy('time_stamp_db', 'desc')
                .limit(1)
                .then(value => resolve(value[0]));
            })
          ))));

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