const { celebrate, Joi } = require('celebrate');

const celebrateForUserId = celebrate({
  params: Joi.object().keys({
    // O controlador da rota define o parâmetro como userId, por isso é assim que deve ser
    // validado > No MongoDB, a chave é _id
    // IDs do MongoDB são hexadecimais: .hex() garante que só contenham caracteres válidos
    // (0-9, a-f)
    // Um ObjectId sempre tem 24 caracteres
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports = celebrateForUserId;
