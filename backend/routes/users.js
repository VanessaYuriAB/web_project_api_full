const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

// Rotas para usuários ('/users')
usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser); // declarada antes de '/:id' para 'me' não ser interpretado como req.params e dar erro de Cast
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

// Exporta o roteador de usuários
module.exports = usersRouter;
