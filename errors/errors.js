const errorHandler = (err, res) => {
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Данные по переданному Id не найдены' });
  } else if (err.name === 'CastError' || 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные в метод' });
  } else {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.errorHandler = errorHandler;
