const jwtApp = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  console.log(jwt);

  if (!jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwtApp.verify(jwt, 'some-secret-key');
  } catch (err) {
    if (err.message === 'jwt malformed') {
      throw new BadRequestError('Некорректный токен');
    }
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
