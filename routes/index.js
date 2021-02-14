const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users/users');
const moviesRouter = require('./movies/movies');

const { errorMessages } = require('../utils/constants');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/NotFoundError');

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
      name: Joi.string().required().trim().min(2)
        .max(30),
    }),
  }),
  usersController.createUser,
);

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
    }),
  }),
  usersController.login,
);

routes.get('/signout', usersController.logout);

routes.use('/users', auth, usersRouter);
routes.use('/movies', auth, moviesRouter);
routes.use(auth, (req, res, next) => next(new NotFoundError(errorMessages.PAGE_NOT_FOUND)));

module.exports = routes;
