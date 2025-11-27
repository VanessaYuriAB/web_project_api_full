const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// rotas para usuários
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

// exporta o roteador de usuários
module.exports = usersRouter;
