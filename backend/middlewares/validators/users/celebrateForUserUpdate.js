const { celebrate, Joi } = require('celebrate');

const celebrateForUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(40)
      .pattern(/^[^<>]+$/),
    about: Joi.string()
      .required()
      .min(2)
      .max(200)
      .pattern(/^[^<>]+$/),
  }),
});

module.exports = celebrateForUserUpdate;
