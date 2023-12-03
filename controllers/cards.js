const cardModel = require('../models/card');

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user.id;
  return cardModel.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: `Неверные входные данные: : ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: : ${err.message}` });
    });
}

function readAllCards(req, res) {
  return cardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Неизвестная ошибка: : ${err.message}` }));
}

function deleteCard(req, res) {
  return cardModel.deleteOne({ _id: req.params.cardId })
    .then((result) => {
      const { deletedCount } = result;

      if (deletedCount === 0) return res.status(404).send({ message: 'Карточка не найдена' });

      return res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
    });
}

function setLike(req, res) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Карточка не найдена' });

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ReferenceError') return res.status(404).send({ message: `Карточка не найдена:: ${err.message}` });

      if (err.name === 'CastError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
    });
}

function deleteLike(req, res) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Карточка не найдена' });

      return res.status(200).send({ message: 'Лайк удалён' });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: `Неверные входные данные: ${err.message}` });

      if (err.name === 'ReferenceError') return res.status(404).send({ message: `Карточка не найдена: ${err.message}` });

      return res.status(500).send({ message: `Неизвестная ошибка: ${err.message}` });
    });
}

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
