import getUser from 'getUser';

export default async (req, res) => {
  if (req.headers.authorization) {
    const auth = (
      req.headers.authorization.substring(0, 6) === 'Bearer' ?
        req.headers.authorization.substring(7) :
        req.headers.authorization
    );

    req.user =  await getUser(auth);
  } else if (req.cookies.jwt) {
    req.user =  await getUser(req.cookies.jwt);
  } else if (req.query && req.query.jwt) {
    req.user = await getUser(req.query.jwt);
  } else if (req.body && req.body.jwt) {
    req.user = await getUser(req.body.jwt);
  }

  if (!req.user) res.throw(401);
};