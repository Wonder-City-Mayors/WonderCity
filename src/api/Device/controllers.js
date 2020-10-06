const jsonify = require("../../../utils/searchToJson");

module.exports = {
  getReadouts: async (req, res) => {
    const search = jsonify(req.search);
    console.log(search);

    res.send([]);

    return;
  }
};