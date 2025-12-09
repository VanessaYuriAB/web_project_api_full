const Card = require('../models/card');

const handleAsync = require('../utils/utils');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

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
  // O campo owner do cartão será o _id do usuário autenticado,
  // obtido pelo middleware de autenticação (auth), contido no payload
  const card = await Card.create({ name, link, owner: req.user._id });
  res.status(201).send({ data: card });
};

// O manipulador de solicitação deleteCardById, por _id
// Erros: Not found, Cast, Forbidden ou Internal server
const deleteCardById = async (req, res) => {
  const { cardId } = req.params;

  const cardToDelete = await Card.findById(cardId).orFail(() => {
    throw new NotFoundError(
      'Erro ao deletar cartão, não existe cartão com o id solicitado (Recurso não encontrado)',
    );
  });

  if (req.user._id !== cardToDelete.owner.toString()) {
    throw new ForbiddenError(
      'Acesso negado, você não possui permissão para deleter este cartão',
    );
  }

  const deletedCard = await Card.findByIdAndDelete(cardId);

  res.send({ data: deletedCard });
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
    throw new NotFoundError(
      'Erro ao curtir cartão, não existe cartão com o id solicitado (Recurso não encontrado)',
    );
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
    throw new NotFoundError(
      'Erro ao descurtir cartão, não existe cartão com o id solicitado (Recurso não encontrado)',
    );
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
