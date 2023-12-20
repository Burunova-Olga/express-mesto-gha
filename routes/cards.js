const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardController = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(http|https):\/\/(w{3}.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=/]/),
  }),
}), cardController.createCard);

router.get('/', cardController.readAllCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), cardController.deleteCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), cardController.deleteLike);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), cardController.setLike);

module.exports = router;
