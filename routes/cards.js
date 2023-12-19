const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardController = require('../controllers/cards');

const regex = /(http|https):\/\/(w{3}.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=/]/;
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }).unknown(true),
}), cardController.createCard);

router.get('/', cardController.readAllCards);

router.delete('/:cardId', cardController.deleteCard);
router.delete('/:cardId/likes', cardController.deleteLike);
router.put('/:cardId/likes', cardController.setLike);

module.exports = router;
