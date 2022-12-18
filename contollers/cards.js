const Card = require('../models/Card');
const { statusCode } = require('../constants/constants');
const {
  InternalServerError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

module.exports.createCard = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(statusCode.OK).send({ data: card });
  } catch (err) {
    return next(new InternalServerError({ message: 'Произошла ошибка' }));
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findById(req.params._id);
    if (!card) {
      return next(new NotFoundError());
    }
    if (card.owner.toString() === userId) {
      await Card.remove(card);
      return res.status(statusCode.OK).send({ message: `Карточка ${card.name} удалена` });
    }
    return next(new ForbiddenError());
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError());
    }
    return next(new InternalServerError());
  }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    card.populate('owner', 'likes');
    return res.status(statusCode.OK).send({ data: card });
  } catch (err) {
    return next(new InternalServerError());
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError());
    }
    card.populate('owner', 'likes');
    return res.status(statusCode.OK).send({ data: card });
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError());
    }
    return next(new InternalServerError());
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError());
    }
    card.populate('owner', 'likes');
    return res.status(statusCode.OK).send({ data: card });
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError());
    }
    return next(new InternalServerError());
  }
};
