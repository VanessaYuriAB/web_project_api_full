const { celebrate, Joi } = require('celebrate');

const celebrateForAuth = celebrate({
  headers: Joi.object()
    .keys({
      // Express normaliza os headers para minúsculas, por isso não utiliza-se
      // 'Authorization'
      authorization: Joi.string()
        .required()
        .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/), // regex para formato JWT
    })
    .unknown(true), // permite outros headers
});

module.exports = celebrateForAuth;
