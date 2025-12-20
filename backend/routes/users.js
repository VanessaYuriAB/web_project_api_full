const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

const celebrateForUserId = require('../middlewares/validators/users/celebrateForUserId');
const celebrateForUserUpdate = require('../middlewares/validators/users/celebrateForUserUpdate');
const celebrateForAvatarUpdate = require('../middlewares/validators/users/celebrateForAvatarUpdate');

// Rotas para usuários ('/users')

// Sem validação do celebrate pq não possuem params nem body
usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser); // declarada antes de '/:id' para 'me' não ser interpretado
// como req.params e dar erro de Cast

// Com validação do celebrate
usersRouter.get('/:userId', celebrateForUserId, getUserById);
usersRouter.patch('/me', celebrateForUserUpdate, updateUser);
usersRouter.patch('/me/avatar', celebrateForAvatarUpdate, updateAvatar);

// Exporta o roteador de usuários
module.exports = usersRouter;
