const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

function login(req, res) {
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
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
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
