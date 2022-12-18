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
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegex),
  }),
}), createCard);

cardsRoutes.delete('/:_id', deleteCard);

cardsRoutes.put('/:_id/likes', likeCard);

cardsRoutes.delete('/:_id/likes', dislikeCard);

module.exports = cardsRoutes;
