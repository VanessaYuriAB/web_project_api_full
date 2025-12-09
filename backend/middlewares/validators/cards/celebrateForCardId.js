const { celebrate, Joi } = require('celebrate');

const celebrateForCardId = celebrate({
  params: Joi.object().keys({
    // Os controladores da rotas definem o parâmetro como cardId, por isso é assim que deve ser validado > No MongoDB, a chave é _id para cada objeto de card
    // IDs do MongoDB são hexadecimais: .hex() garante que só contenham caracteres válidos (0-9, a-f)
    // Um ObjectId sempre tem 24 caracteres
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = celebrateForCardId;
