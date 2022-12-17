const GeneralError = require('../errors/general-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
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
        throw new ValidationError({ message: 'Переданы некорректные данные в метод создания карточки' });
      }
      throw new GeneralError({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = async (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params._id)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndRemove(req.params._id);
        return res.status(200).send({ message: `Карточка ${card.name} удалена` });
      }
      return next(res.status(409).send({ message: 'К этой карточке у вас нет доступа на удаление' }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return new NotFoundError({ message: 'Карточка по переданному Id не найдена' });
      } if (err.name === 'CastError' || 'ValidationError') {
        return new ValidationError({ message: 'Переданы некорректные данные в метод' });
      }
      return new GeneralError({ message: 'Произошла ошибка' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return new NotFoundError({ message: 'Карточка по переданному Id не найдена' });
      }
      if (err.name === 'CastError' || 'ValidationError') {
        return new ValidationError({ message: 'Переданы некорректные данные в метод' });
      }
      return new GeneralError({ message: 'Произошла ошибка' });
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
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return new NotFoundError({ message: 'Карточка по переданному Id не найдена' });
      }
      if (err.name === 'CastError' || 'ValidationError') {
        return new ValidationError({ message: 'Переданы некорректные данные в метод' });
      }
      return new GeneralError({ message: 'Произошла ошибка' });
    });
};
