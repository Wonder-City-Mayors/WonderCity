const get = require('lodash/get');

module.exports = async (req, res) => {
  const sources = [
    (
      req.headers.authorization ?
        (
          req.headers.authorization.substring(0, 6) === 'Bearer' ?
            req.headers.authorization.substring(7) :
            req.headers.authorization
        ) :
        undefined
    ),
    get(req, ['cookies', 'jwt']),
    get(req, ['query', 'jwt']),
    get(req, ['body', 'jwt']),
  ];

  for (const jwt of sources) {
    req.jwtPayload = await wonder.services.jwt.verify(jwt);

    if (req.jwtPayload) return;
  }

  res.throw(401);
};