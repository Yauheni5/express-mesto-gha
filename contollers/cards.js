const Card = require('../models/Card');

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(200).send({ data: card, message: 'Карточка добавлена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка: ${err.name}. Переданы некорректные данные` });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card, message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Произошла ошибка: ${err.name}. Карточка с такими данными не найдена` });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.name}` });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card, message: 'Лайк добавлен' }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card, message: 'Лайк удален' }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
};
