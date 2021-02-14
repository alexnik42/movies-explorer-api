const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const { errorMessages } = require('../utils/constants');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError(errorMessages.UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : config.JWT_DEV_KEY,
    );
  } catch (err) {
    next(new UnauthorizedError(errorMessages.UNAUTHORIZED));
  }

  req.user = payload;
  next();
};
