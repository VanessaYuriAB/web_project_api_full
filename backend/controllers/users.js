const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const handleAsync = require('../utils/utils');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Função genérica para atualizações de perfil
const updateProfileFields = async (userId, fieldsToUpdate) => {
  const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new NotFoundError(
      'Erro ao atualizar perfil, não existe usuário com o id solicitado (Recurso não encontrado)',
    );
  });

  return updatedUser;
};

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
    throw new NotFoundError(
      'Erro ao localizar usuário, não existe usuário com o id solicitado (Recurso não encontrado)',
    );
  });
  res.send({ data: user });
};

// O manipulador de solicitação createUser
// Erros: Validation, Conflict ou Internal server
const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  // Verificação de duplicidade de e-mail
  const duplicateEmail = await User.findOne({ email });

  if (duplicateEmail) {
    throw new ConflictError('E-mail já cadastrado');
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

  const updatedUser = await updateProfileFields(req.user._id, { name, about });

  res.send({ data: updatedUser });
};

// O manipulador de solicitação updateAvatar
// Erros: Not found, Validation, Cast ou Internal server
const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  const updatedAvatar = await updateProfileFields(req.user._id, { avatar });

  res.send({ data: updatedAvatar });
};

// Controlador de autenticação
const login = async (req, res) => {
  const { email, password } = req.body;

  const userInDB = await User.findUserByCredentials(email, password);

  // Geração do JWT para manter usuários logados após autenticação, com expiração em uma semana
  const token = jwt.sign(
    { _id: userInDB._id },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    { expiresIn: '7d' },
  );

  // Retornando o token JWT
  res.send({ token });
};

// Controlador para infos do usuário logado
const getUser = async (req, res) => {
  const { _id } = req.user;

  const loggedUser = await User.findById(_id).orFail(() => {
    throw new NotFoundError(
      'Erro ao localizar usuário, não existe usuário com o id solicitado (Recurso não encontrado)',
    );
  });

  res.send({ data: loggedUser });
};

module.exports = {
  getUsers: handleAsync(getUsers),
  getUserById: handleAsync(getUserById),
  createUser: handleAsync(createUser),
  updateUser: handleAsync(updateUser),
  updateAvatar: handleAsync(updateAvatar),
  login: handleAsync(login),
  getUser: handleAsync(getUser),
};
