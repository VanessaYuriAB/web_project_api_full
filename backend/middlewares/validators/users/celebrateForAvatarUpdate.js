const { celebrate, Joi } = require('celebrate');
const validateURL = require('../validateURL');

const celebrateForAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

module.exports = celebrateForAvatarUpdate;
