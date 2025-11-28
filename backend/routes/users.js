const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// rotas para usuários
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

// exporta o roteador de usuários
module.exports = usersRouter;
