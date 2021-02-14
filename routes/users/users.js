const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersController = require('../../controllers/users');

router.get('/me', usersController.getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().trim(),
      name: Joi.string().trim().min(2).max(30),
    }).min(1),
  }),
  usersController.updateUser,
);

module.exports = router;
