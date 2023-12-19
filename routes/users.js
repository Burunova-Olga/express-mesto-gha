const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', userController.readAllUsers);
router.get('/me', (req, res) => {
  req.params = { userId: req.user._id };
  res.redirect(req.user._id);
});
router.get('/:userId', userController.readUser);
router.patch('/me', userController.updateUser);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
