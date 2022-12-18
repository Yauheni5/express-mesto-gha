class ForbiddenErr extends Error {
  constructor(message = 'Нет доступа') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenErr;
