const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { DEFAULT_UPDATE_PARAMS, errorMessages, messages } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    DEFAULT_UPDATE_PARAMS,
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((newUser) => {
      if (!newUser) {
        throw new BadRequestError(errorMessages.WRONG_INPUT_DATA);
      }
      return User.findById(newUser._id);
    })
    .then((newUser) => {
      if (!newUser) {
        throw new NotFoundError(errorMessages.USER_NOT_FOUND);
      }
      res.send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorMessages.EXISTING_USER_EMAIL));
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.USER_NOT_FOUND);
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'the-secret-key',
        {
          expiresIn: '7d',
        },
      );
      const currentUser = user.toObject();
      delete currentUser.password;

      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .send(currentUser);
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
  try {
    res
      .cookie('jwt', '', {
        maxAge: -1,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .send({ message: messages.LOGOUT });
  } catch (err) {
    next(new NotFoundError(errorMessages.USER_NOT_FOUND));
  }
};
