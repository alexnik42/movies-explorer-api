const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { errorMessages } = require('../utils/constants');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: errorMessages.WRONG_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(errorMessages.WRONG_EMAIL_OR_PASSWORD),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(errorMessages.WRONG_EMAIL_OR_PASSWORD),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
