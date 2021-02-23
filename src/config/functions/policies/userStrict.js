import getUser from 'getUser';
import get from 'lodash/get';

export default async (req, res) => {
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
    req.user = await getUser(jwt);

    if (req.user) return;
  }

  res.throw(401);
};