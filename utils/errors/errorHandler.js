const { messages } = require('../constants');

exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? messages.SERVER_ERROR : message,
  });
  next();
};
