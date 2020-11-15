module.exports = async (req, res) => {
  req.user = await wonder.services.jwt.verify(req.cookies.jwt);

  if (!req.user) {
    res.throw(401);
  }

  return;
};
