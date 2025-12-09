const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

const celebrateForNewCard = require('../middlewares/validators/cards/celebrateForNewCard');
const celebrateForCardId = require('../middlewares/validators/cards/celebrateForCardId');

// Rotas para cartões ('/cards')

// Sem validação do celebrate pq não possuem params nem body
cardsRouter.get('/', getCards);

// Com validação do celebrate
cardsRouter.post('/', celebrateForNewCard, createCard);
cardsRouter.delete('/:cardId', celebrateForCardId, deleteCardById);
cardsRouter.put('/:cardId/likes', celebrateForCardId, likeCard);
cardsRouter.delete('/:cardId/likes', celebrateForCardId, unlikeCard);

// Exporta o roteador de cartões
module.exports = cardsRouter;
