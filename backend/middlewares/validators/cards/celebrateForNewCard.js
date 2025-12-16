const { celebrate, Joi } = require('celebrate');
const validateURL = require('../validateURL');

const celebrateForNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .pattern(/^[^<>]+$/)
      .min(2)
      .max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

module.exports = celebrateForNewCard;
