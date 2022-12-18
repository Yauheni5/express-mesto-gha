class NotFoundError extends Error {
  constructor(message = 'Данные по переданному Id не найдены') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
