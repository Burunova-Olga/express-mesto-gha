const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userController = require('../controllers/users');

const regex = /(http|https):\/\/(w{3}.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=/]/;
router.get('/', userController.readAllUsers);
router.get('/me', (req, res) => {
  req.params = { userId: req.user._id };
  res.redirect(req.user._id);
});
router.get('/:userId', userController.readUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), userController.updateUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
}), userController.updateUser);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
