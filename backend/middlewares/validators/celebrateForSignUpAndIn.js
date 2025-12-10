const { celebrate, Joi } = require('celebrate');

const celebrateForSignUpAndIn = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(), // email é um validador nativo da biblioteca e 'unique' não precisa estar presente aqui, apenas na validação do banco de dados, na definição do schema
      password: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/), // 'select' idem
    })
    .unknown(true), // para habilitar o envio de outros campos que não estão presentes na validação, neste caso: name, about e avatar
});

module.exports = celebrateForSignUpAndIn;
