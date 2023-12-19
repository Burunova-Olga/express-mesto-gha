/* eslint-disable */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const DataError = require('../errors/data-error');
const UnknownError = require('../errors/unknown-error');
const DuplicateError = require('../errors/duplicate-error');
const NoAccessError = require('../errors/no-access-error');

function login(req, res, next) {
  const { email, password } = req.body;

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) next(new NoAccessError('Неправильные почта или пароль'));

      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) next(new NoAccessError('Неправильные почта или пароль'));

          res.status(200)
            .send({ token });
        });
    });
}

function createUser(req, res, next) {
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) next(new DuplicateError(`Данный email уже зарегестрирован: ${err.message}`));

      if (err.name === 'ValidationError') next(new DataError(`Неверные входные данные: : ${err.message}`));

      next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function readAllUsers(req, res, next) {
  return userModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => next(new UnknownError(`Неизвестная ошибка: : ${err.message}`)));
}

function readUser(req, res, next) {
  return userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new DataError(`Неверные входные данные: : ${err.message}`));

      if (err.name === 'ReferenceError') next(new NotFoundError(`Пользователь не найден: ${err.message}`));

      next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;

  return userModel.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new DataError(`Неверные входные данные: : ${err.message}`));

      next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next(new NotFoundError('Пользователь не найден'));

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new DataError(`Неверные входные данные: : ${err.message}`));

      next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

module.exports = {
  login,
  readAllUsers,
  createUser,
  readUser,
  updateUser,
  updateAvatar,
};
