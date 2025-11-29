const express = require('express');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const { createUser, login } = require('./controllers/users');

const auth = require('./middleware/auth');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

// ------------------------
// Middlewares
// ------------------------

// Middleware para registrar detalhes de cada requisição
app.use((req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);

  const start = Date.now();

  // Quando a resposta terminar
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Middleware para simular um usuário autenticado
app.use((req, res, next) => {
  req.user = {
    _id: '68c4168c01d67ddcff340228', // _id do usuário teste criado via Postman
  };

  next();
});

// -------------------------------------
// Rotas que não precisam de autorização
// -------------------------------------

// Rota para cadastro
app.post('/signup', createUser);
// Rota para login
app.post('/signin', login);

// Middleware de autorização para persistência do login
app.use(auth);

// ---------------------------------
// Rotas que precisam de autorização
// ---------------------------------

// Rota que define o prefixo /users
app.use('/users', usersRouter);
// Rota que define o prefixo /cards
app.use('/cards', cardsRouter);

// Middleware para erros 404 - rotas não encontradas
app.use((req, res) => {
  res.status(404).send({
    message: 'A página não foi encontrada, é um endereço inexistente',
  });
});

// ------------------------
// Conexão com MongoDB
// ------------------------

mongoose
  .connect(
    `mongodb+srv://emaildavanessayuri_db_user:${process.env.MONGO_PWD}@clusteraroundfull.buacevu.mongodb.net/?appName=ClusterAroundFull`,
  )
  .then(() => {
    console.log(
      'Connected to MongoDB Atlas, o nome do banco do dados é "teste"',
    );
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// ------------------------
// Start do servidor
// ------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
