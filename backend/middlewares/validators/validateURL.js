const isURL = require('validator/lib/isURL');

// Função de validação personalizada para Joi, com o método isURL de validator > Instruído pela TripleTen por ser mais estrito do que o validador URL Joi integrado
// 'string.uri' é o nome do validador padrão e o nome do código de erro que ele gera, então usaremos esse valor para retornar o mesmo tipo de validação de erro que o validador de URL padrão
const validateURL = (value, helpers) => {
  // Permite apenas URLs com http ou https, evitando URLs sem protocolo
  if (isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
    return value;
  }
  return helpers.error('string.uri');
};

module.exports = validateURL;
