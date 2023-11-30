const cardModel = require("../models/card");

function createCard(req, res)
{
  const {name, link} = req.body;
  const owner = req.user.id;
  return cardModel.create({name, link, owner})
    .then((card) =>
    {
      return res.status(201).send(card);
    })
    .catch((err) =>
    {
      if (err.name === 'ValidationError')
        return res.status(400).send({ message: "Неверные входные данные: " + err.message });

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function readAllCards(req, res)
{
  return cardModel.find()
    .then((cards) =>
    {
      return res.status(200).send(cards);
    })
    .catch((err) =>
    {
      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function deleteCard(req, res)
{
  return cardModel.deleteOne(req.params.cardId)
    .then(() =>
    {
      return res.status(200).send({ message: "Карточка успешно удалена" });
    })
    .catch((err) =>
    {
      if (err.name === 'CastError')
        return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function setLike(req, res)
{
  return cardModel.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) =>
    {
      return res.status(201).send(card);
    })
    .catch((err) =>
    {
      if (err.name === 'ValidationError')
        return res.status(400).send({message: "Неверные входные данные: " +  err.message});

      if (err.name === 'CastError')
        return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

function deleteLike(req, res)
{
  return cardModel.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then(() =>
    {
      return res.status(200).send({ message: "Лайк удалён" });
    })
    .catch((err) =>
    {
      if (err.name === 'ValidationError')
        return res.status(400).send({message: "Неверные входные данные: " +  err.message});

      if (err.name === 'CastError')
        return res.status(404).send({ message: "Пользователь не найден: " +  err.message });

      return res.status(500).send({ message: "Неизвестная ошибка: " + err.message });
    });
}

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike
};