const cardsRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../contollers/cards');

cardsRoutes.get('/', getCards);

cardsRoutes.post('/', createCard);

cardsRoutes.delete('/:_id', deleteCard);

cardsRoutes.put('/:_id/likes', likeCard);

cardsRoutes.delete('/:_id/likes', dislikeCard);

module.exports = cardsRoutes;
