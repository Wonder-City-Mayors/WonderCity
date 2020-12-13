import getUser from 'getUser';

export default async (req, res) => {
  if (req.headers.authorization) {
    const auth = (
      req.headers.authorization.substring(0, 6) === 'Bearer' ?
        req.headers.authorization.substring(7) :
        req.headers.authorization
    );

    req.user =  await getUser(auth);

    if (req.user) return;
  }

  if (req.cookies.jwt) {
    req.user =  await getUser(req.cookies.jwt);

    if (req.user) return;
  }

  if (req.method === 'GET' && req.query.jwt) {
    req.user = await getUser(req.query.jwt);

    if (req.user) return;
  }

  res.throw(401);
};