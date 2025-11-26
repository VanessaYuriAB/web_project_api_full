const cardsRouter = require('express').Router();

const {
  getCards, createCard, deleteCardById, likeCard, unlikeCard,
} = require('../controllers/cards');

// rotas para cartões
cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCardById);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', unlikeCard);

// exporta o roteador de cartões
module.exports = cardsRouter;
