const { celebrate, Joi } = require('celebrate');

const celebrateForUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(40)
      .pattern(/^[A-Za-zÀ-ÿ\s]+$/),
    about: Joi.string()
      .required()
      .min(2)
      .max(200)
      .pattern(/^[A-Za-zÀ-ÿ0-9\s]+$/),
  }),
});

module.exports = celebrateForUserUpdate;
