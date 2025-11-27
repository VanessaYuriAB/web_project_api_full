const Card = require('../models/card');

const { handleAsync } = require('../utils/utils');

// O manipulador de solicitação getCards
// Erros: Internal server
const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send({ data: cards });
};

// O manipulador de solicitação createCard
// Erros: Validation ou Internal server
const createCard = async (req, res) => {
  const { name, link } = req.body;
  // O campo owner do cartão será o _id do usuário que está criando o cartão
  // Temporariamente, _id é acessível aqui, pelo middleware adicionado em app.js
  const card = await Card.create({ name, link, owner: req.user._id });
  res.status(201).send({ data: card });
};

// O manipulador de solicitação deleteCardById, por _id
// Erros: Not found, Cast ou Internal server
const deleteCardById = async (req, res) => {
  const { cardId } = req.params;
  const cardToDelete = await Card.findByIdAndDelete(cardId).orFail(() => {
    const err = new Error(
      'Erro ao deletar cartão, Recurso não encontrado: não existe cartão com o id solicitado',
    );
    err.name = 'NotFoundError';
    throw err;
  });
  res.send({ data: cardToDelete });
};

// O manipulador de solicitação likeCard, por _id do cartão
// Curtida, por _id do usuário (em req.user._id)
// Erros: Not found, Cast ou Internal server
const likeCard = async (req, res) => {
  const likedCard = await Card.findByIdAndUpdate(
    req.params.cardId,
    // Adiciona o _id do usuário ao array, se ainda não existir
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).orFail(() => {
    const err = new Error(
      'Erro ao curtir cartão, Recurso não encontrado: não existe cartão com o id solicitado',
    );
    err.name = 'NotFoundError';
    throw err;
  });
  res.send({ data: likedCard });
};

// O manipulador de solicitação dislikeCard, por _id do cartão
// Descurtida, por _id do usuário (em req.user._id)
// Erros: Not found, Cast ou Internal server
const unlikeCard = async (req, res) => {
  const unlikedCard = await Card.findByIdAndUpdate(
    req.params.cardId,
    // Remove o _id do usuário do array
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    const err = new Error(
      'Erro ao descurtir cartão, Recurso não encontrado: não existe cartão com o id solicitado',
    );
    err.name = 'NotFoundError';
    throw err;
  });
  res.send({ data: unlikedCard });
};

module.exports = {
  getCards: handleAsync(getCards),
  createCard: handleAsync(createCard),
  deleteCardById: handleAsync(deleteCardById),
  likeCard: handleAsync(likeCard),
  unlikeCard: handleAsync(unlikeCard),
};
