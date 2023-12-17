const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const UnknownError = require('../errors/unknown-error');
const DataError = require('../errors/data-error');
const DuplicateError = require('../errors/duplicate-error');

function createUser(req, res, next) {
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) return next(new DuplicateError(`Email уже зарегестрирован: ${err.message}`));

      if (err.name === 'ValidationError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then(() => {
      const token = jwt.sign(
        { _id: req.user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    })
    .catch(next);
}

function readAllUsers(req, res, next) {
  return userModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => next(new UnknownError(`Неизвестная ошибка: ${err.message}`)))
    .catch(next);
}

function readUser(req, res, next) {
  return userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      if (err.name === 'ReferenceError') return next(new NotFoundError(`Пользователь не найден: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    })
    .catch(next);
}

function readMe(req, res, next) {
  return userModel.findById(req.user._id)
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      if (err.name === 'ReferenceError') return next(new NotFoundError(`Пользователь не найден: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, about } = req.body;

  return userModel.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    })
    .catch(next);
}

module.exports = {
  readAllUsers,
  createUser,
  readUser,
  readMe,
  login,
  updateUser,
  updateAvatar,
};
