// const commonQuery = (knex, userId) => knex
//   .innerJoin('values_t1 as v1', 'v1.tree_id', 'tree.id')
//   .leftJoin('values_t1 as v2', function () {
//     this
//       .on('v2.tree_id', '=', 'v1.tree_id')
//       .andOn('v2.time_stamp_db', '>', 'v1.time_stamp_db')
//   })
//   .where('tree.user_id', parseInt(userId, 10))
//   .andWhere('v2.id', null);

export default {
  count: (req, res) => wonder.query('tree').count({
    user_id: req.jwtPayload.id
  }).then(count => res.send(count)),

  getReadouts: async (req, res) => {
    const page = parseInt(req.query.page, 10);

    if (page) {
      const devices = await wonder.query('tree').find({
        user_id: req.user.id,
        _limit: 10,
        _skip: (page - 1) * 10
      })
        .then(trees => Promise.all(trees.map(
          tree => wonder.query('value').findOne({
            tree_id: tree.id,
            _sort: 'time_stamp_db:desc'
          }).then(value => {
            return Object.assign((
              value ?
                {
                  timeStamp: value.time_stamp_db,
                  lastRecord: value.last_record
                } :
                {}
            ), {
              id: tree.id
            });
          })
        )));

      res.send(devices);
      return;
    }

    res.throw(400);
    return;
  }
};