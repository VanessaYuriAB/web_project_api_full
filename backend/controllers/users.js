const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { handleAsync } = require('../utils/utils');

// O manipulador de solicitação getUsers
// Erros: Internal Server
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.send({ data: users });
};

// O manipulador de solicitação getUserById
// Erros: Not found, Cast ou Internal server
const getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).orFail(() => {
    const err = new Error(
      'Erro ao localizar usuário, Recurso não encontrado: não existe usuário com o id solicitado',
    );
    err.name = 'NotFoundError';
    throw err;
  });
  res.send({ data: user });
};

// O manipulador de solicitação createUser
// Erros: Validation, Conflict ou Internal server
const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  // Validação básica para reforço de segurança
  if (!email || !password) {
    const err = new Error('Email e senha são obrigatórios');
    err.name = 'ValidationError';
    throw err;
  }

  // Verificação de duplicidade de e-mail
  const duplicateEmail = await User.findOne({ email });

  if (duplicateEmail) {
    const err = new Error('E-mail já cadastrado');
    err.name = 'Conflict';
    throw err;
  }

  // codificando o hash da senha
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    about,
    avatar,
    email,
    password: hash, // adicionando o hash ao banco de dados
  });

  res.status(201).send({ data: user });
};

// O manipulador de solicitação updateUser
// Erros: Not found, Validation, Cast ou Internal server
const updateUser = async (req, res) => {
  const { name, about } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => {
    const err = new Error(
      'Erro ao atualizar usuário, Recurso não encontrado: não existe usuário com o id solicitado',
    );
    err.name = 'NotFoundError';
    throw err;
  });
  res.send({ data: updatedUser });
};

// O manipulador de solicitação updateAvatar
// Erros: Not found, Validation, Cast ou Internal server
const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => {
    const err = new Error(
      'Erro ao atualizar avatar, Recurso não encontrado: não existe usuário com o id solicitado',
    );
    err.name = 'NotFoundError';
    throw err;
  });
  res.send({ data: updatedUser });
};

// Controlador de autenticação
const login = async (req, res) => {
  const { email, password } = req.body;

  const userInDB = await User.findUserByCredentials(email, password);

  // Autenticação bem-sucedida: o usuário está disponível na variável `userInDB`
  console.log(`Login realizado com sucesso, ${userInDB}`);

  // Geração do JWT para manter usuários logados após autenticação, com expiração em uma semana
  const token = jwt.sign({ _id: userInDB._id }, 'secret-key', {
    expiresIn: '7d',
  });

  // Retornando o token JWT
  res.send({ token });
};

module.exports = {
  getUsers: handleAsync(getUsers),
  getUserById: handleAsync(getUserById),
  createUser: handleAsync(createUser),
  updateUser: handleAsync(updateUser),
  updateAvatar: handleAsync(updateAvatar),
  login: handleAsync(login),
};
