const AuthError = require('./AuthError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const InternalServerError = require('./InternalServerError');

module.exports = {
  AuthError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
};
