const router = require('express').Router();
const cardController = require('../controllers/cards');

router.post('/', cardController.createCard);
router.get('/', cardController.readAllCards);
router.delete('/:cardId', cardController.deleteCard);
router.put('/:cardId/likes', cardController.setLike);
router.delete('/:cardId/likes', cardController.deleteLike);

module.exports = router;
