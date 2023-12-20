const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userController = require('../controllers/users');

router.get('/', userController.readAllUsers);
router.get('/me', (req, res) => {
  req.params = { userId: req.user._id };
  res.redirect(req.user._id);
});

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), userController.readUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), userController.updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(http|https):\/\/(w{3}.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=/]/),
  }),
}), userController.updateAvatar);

module.exports = router;
