const jwt = require('jsonwebtoken');
const NoAccessError = require('../errors/no-access-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NoAccessError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new NoAccessError('Необходима авторизация:'));
  }

  req.user = payload;
  next();
};
