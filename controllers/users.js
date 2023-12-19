const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

function findUserByCredentials(email, password) {
  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправильные почта или пароль'));

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) Promise.reject(new Error('Неправильные почта или пароль'));

          return user;
        });
    });
}

function login(req, res) {
  const { email, password } = req.body;

  return findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          'super-strong-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

function createUser(req, res) {
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
      if (err.code === 11000) return res.status(409).send({ message: `Данный email уже зарегестрирован: ${err.message}` });
      if (err.name === 'ValidationError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
    });
}

function readAllUsers(req, res) {
  return userModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` }));
}

function readUser(req, res) {
  return userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Пользователь не найден' });

      return res.status(200).send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      if (err.name === 'ReferenceError') return res.status(404).send({ message: `Пользователь не найден: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;

  return userModel.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Пользователь не найден' });

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.name}` });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;

  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Пользователь не найден' });

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
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
