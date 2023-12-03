const router = require('express').Router();
const cardController = require('../controllers/cards');

router.post('/', cardController.createCard);
router.get('/', cardController.readAllCards);
router.delete('/:cardId', cardController.deleteCard);
router.delete('/:cardId/likes', cardController.deleteLike);
router.put('/:cardId/likes', cardController.setLike);

module.exports = router;
