const cardModel = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const DataError = require('../errors/data-error');
const UnknownError = require('../errors/unknown-error');
const MasterError = require('../errors/master-error');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardModel.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new DataError(`Неверные входные данные: : ${err.message}`));
      else next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function readAllCards(req, res, next) {
  return cardModel.find()
    .then((cards) => res.send(cards))
    .catch((err) => next(new UnknownError(`Неизвестная ошибка: : ${err.message}`)));
}

function deleteCard(req, res, next) {
  return cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) next(new NotFoundError('Карточка не найдена'));
      else if (card.owner != req.user._id) next(new MasterError('Эту карточку добавил другой пользователь'));
      else {
        return cardModel.deleteOne({ _id: req.params.cardId })
          .then((result) => {
            const { deletedCount } = result;

            if (deletedCount === 0) next(new NotFoundError('Карточка не найдена'));
            else return res.send({ message: 'Карточка успешно удалена' });
          })
          .catch((err) => {
            if (err.name === 'CastError') next(new DataError(`Неверные входные данные: : ${err.message}`));
            else next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new DataError(`Неверные входные данные: ${err.message}`));
      else next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    });
}

function setLike(req, res, next) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) next(new NotFoundError('Карточка не найдена'));
      else return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ReferenceError') next(new NotFoundError(`Карточка не найдена: ${err.message}`));
      else
        if (err.name === 'CastError') next(new DataError(`Неверные входные данные: : ${err.message}`));
        else next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function deleteLike(req, res, next) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) next(new NotFoundError('Карточка не найдена'));
      else return res.send({ message: 'Лайк удалён' });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new DataError(`Неверные входные данные: : ${err.message}`));
      else
        if (err.name === 'ReferenceError') next(new NotFoundError(`Карточка не найдена: ${err.message}`));
        else next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
