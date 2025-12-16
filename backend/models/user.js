const mongoose = require('mongoose');

const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 40,
    match: /^[^<>]+$/,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    match: /^[^<>]+$/,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) =>
        // Apenas URLs com http ou https, evitando URLs sem protocolo
        isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
      message: (props) => `${props.value} is not a valid link!`,
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // conforme está na msg de erro do input, no frontend
    // sem definição de regex aqui, pq verificaria o hash da senha > regex definida no input, frontend, e na validação com celebrate
    select: false, // o hash de senha não será retornado do banco de dados por padrão
  },
});

// Método personalizado do Mongoose, definido na propriedade statics (estáticos) do esquema: encontre o usuário pelas credenciais
// Para uso no controlador de login
userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password,
) {
  const userInDB = await this.findOne({ email })
    .select('+password')
    .orFail(() => {
      // Retorna erro 401 pq o método é para verificação de permissão para login > intuito de não revelar se o e-mail existe ou não, por segurança
      // Evita enumeration attacks (ataques que descobrem quais e-mails estão cadastrados)
      throw new UnauthorizedError('E-mail ou senha incorretos');
    });

  const matchedUser = await bcrypt.compare(password, userInDB.password);

  if (!matchedUser) {
    throw new UnauthorizedError('E-mail ou senha incorretos');
  }

  // Autenticação bem-sucedida: retorna o objeto do usuário no banco de dados
  return userInDB;
};

module.exports = mongoose.model('user', userSchema);
