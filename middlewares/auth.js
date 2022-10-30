const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    if (err.message === 'jwt malformed') {
      throw new BadRequestError('Некорректный токен');
    }
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
