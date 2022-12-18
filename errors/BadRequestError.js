class BadRequestError extends Error {
  constructor(message = 'Переданы некорректные данные в метод') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
