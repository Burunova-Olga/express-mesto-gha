/* eslint-disable */
const jwt = require('jsonwebtoken');
const NoAccessError = require('../errors/no-access-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  next(new NoAccessError('Необходима авторизация: ' + authorization));
/*
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NoAccessError('Необходима авторизация: ' + authorization));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new NoAccessError('Необходима авторизация: ' + authorization));
  }

  req.user = payload;
*/
  next();
};
