const Card = require('../models/Card');

const errorHandler = (err, res) => {
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Данные по переданному Id не найдены' });
  } else if (err.name === 'CastError' || 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные в метод' });
  } else {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => errorHandler(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      errorHandler(err, res);
    });
};
