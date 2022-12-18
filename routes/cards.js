const cardsRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../constants/constants');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../contollers/cards');

cardsRoutes.get('/', getCards);

cardsRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(urlRegex),
  }),
}), createCard);

cardsRoutes.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteCard);

cardsRoutes.put('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cardsRoutes.delete('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardsRoutes;
