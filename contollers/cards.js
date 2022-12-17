const ConflictError = require('../errors/conflict-err');
const GeneralError = require('../errors/general-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const Card = require('../models/Card');

module.exports.createCard = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(200).send({ data: card });
  } catch (err) {
    if (err.name === 'CastError' || 'ValidationError') {
      return next(new ValidationError({ message: 'Переданы некорректные данные в метод создания карточки' }));
    }
    return next(new GeneralError({ message: 'Произошла ошибка' }));
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findById(req.params._id);
    if (card.owner.toString() === userId) {
      Card.findByIdAndRemove(req.params._id);
      return res.status(200).send({ message: `Карточка ${card.name} удалена` });
    }
    return next(new ConflictError('К этой карточке у вас нет доступа на удаление'));
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Карточка по переданному Id не найдена'));
    } if (err.name === 'CastError' || 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные в метод'));
    }
    return next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    return res.status(200).send({ data: card });
  } catch (err) {
    return next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(200).send({ data: card });
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Карточка по переданному Id не найдена'));
    }
    if (err.name === 'CastError' || 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные в метод'));
    }
    return next(new GeneralError('Произошла ошибка'));
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    return res.status(200).send({ data: card });
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Карточка по переданному Id не найдена'));
    }
    if (err.name === 'CastError' || 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные в метод'));
    }
    return next(new GeneralError('Произошла ошибка'));
  }
};
