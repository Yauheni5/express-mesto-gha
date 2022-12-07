const Card = require('../models/Card');

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод создания карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail()
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(res.status(404).send({ message: 'Карточка по переданному Id не найдена' }));
      } else if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в метод' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(res.status(404).send({ message: 'Данные по переданному Id не найдены' }));
      } else if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(res.status(404).send({ message: 'Данные по переданному Id не найдены' }));
      } else if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
