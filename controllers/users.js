const userModel = require("../models/user");

function createUser(req, res)
{
  const userData = req.body;

  return userModel.create(userData)
    .then((user) =>
    {
      return res.status(201).send(user);
    })
    .catch((err) =>
    {
      if (err.name === 'ValidationError')
        return res.status(400).send({message: "Неверные входные данные: " +  err.message});

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function readAllUsers(req, res)
{
  return userModel.find()
    .then((users) =>
    {
      return res.status(200).send(users);
    })
    .catch((err) =>
    {
      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function readUser(req, res)
{
  return userModel.findById(req.params.userId)
    .then((user) =>
    {
      if (!user)
        return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(200).send({message: user});
    })
    .catch((err) =>
    {
      if (err.name === 'CastError')
        return res.status(400).send({message: "Неверные входные данные: " +  err.message});

      if (err.name === 'ReferenceError')
      return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function updateUser(req, res)
{
  const {name, about} = req.body;

  if (name.length < 2 || name.length >30 || about.length < 2 || about.length >30)
    return res.status(400).send({ message: "Неверные входные данные: " +  err.message  });

  return userModel.findByIdAndUpdate(req.user.id, {name, about}, { new: 'true' })
    .then((user) =>
    {
      if (!user)
        return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(200).send(user);
    })
    .catch((err) =>
    {
      if (err.name === 'CastError')
        return res.status(400).send({ message: "Неверные входные данные: " +  err.message  });

      return res.status(500).send({ message: "Неизвестная ошибка: "});
    });
}

function updateAvatar(req, res)
{
  const {avatar} = req.body;

  return userModel.findByIdAndUpdate(req.user.id, { avatar }, { new: 'true'})
    .then((user) =>
    {
      if (!user)
        return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(200).send(user);
    })
    .catch((err) =>
    {
      if (err.name === 'CastError')
        return res.status(400).send({ message: "Неверные входные данные: " +  err.message  });

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

module.exports = {
  readAllUsers,
  createUser,
  readUser,
  updateUser,
  updateAvatar,
};