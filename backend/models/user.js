const mongoose = require('mongoose');

const isEmail = require('validator/lib/isEmail');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?\S+(\/\S+)*(\/)?#?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
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
    select: false, // o hash de senha não será retornado do banco de dados por padrão
  },
});

// Método personalizado do Mongoose, definido na propriedade statics (estáticos) do esquema: encontre o usuário pelas credenciais
userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password,
) {
  const userInDB = await this.findOne({ email })
    .select('+password')
    .orFail(() => {
      const err = new Error('E-mail ou senha incorretos');
      err.name = 'Unauthorized';
      throw err;
    });

  const matchedUser = await bcrypt.compare(password, userInDB.password);

  if (!matchedUser) {
    const err = new Error('E-mail ou senha incorretos');
    err.name = 'Unauthorized';
    throw err;
  }

  // Autenticação bem-sucedida: retorna o objeto do usuário no banco de dados
  return userInDB;
};

module.exports = mongoose.model('user', userSchema);
