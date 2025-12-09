const express = require('express');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const cors = require('cors');

const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const celebrateForSignUpAndIn = require('./middlewares/validators/celebrateForSignUpAndIn');
const celebrateForAuth = require('./middlewares/validators/celebrateForAuth');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

// ------------------------
// Middlewares
// ------------------------

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// -------------
// Cors
// -------------

// Configuração com opções específicas

// Array de domínios a partir dos quais são permitidas solicitações
const allowedCors = [
  'http://localhost:3001',
  'https://aroundtheusa.sevencomets.com',
];

const corsOptions = {
  // O callback é uma função fornecida pelo middleware cors para indicar se a origem é permitida
  // Ele espera dois parâmetros: callback(error, allow)
  // error: null se não houve erro, ou um objeto Error se você quer bloquear.
  // allow: true se a origem é permitida, ou false se não é.

  origin: (origin, callback) => {
    // Se não houver origin (Postman, curl, apps mobile), permite
    if (!origin) {
      return callback(null, true);
    }

    // Se houver origin e estiver na lista, permite
    if (allowedCors.includes(origin)) {
      return callback(null, true);
    }

    // Caso contrário, bloqueia

    // Cria um erro customizado com name
    const corsError = new Error(`Origem não permitida pelo CORS, ${origin}`);
    corsError.name = 'Forbidden';
    return callback(corsError);
  }, // origens permitidas

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // permite envio de cookies/autenticação (no caso de utilização de
  // cookies httpOnly, ao invés do armazenamento do JWT token no localStorage)
};

// Aplica CORS com opções personalizadas
app.use(cors(corsOptions));

// Trata requisições preflight (OPTIONS) para qualquer rota
app.options(/.*/, cors(corsOptions)); // regex /.*/ para qlqr caminho,
// evita erro path-to-regexp que ocorre com '*' ou '(.*)' em versões recentes do Express

// ------------------
// Winston (requests)
// ------------------

// Habilita registrador de solicitações
app.use(requestLogger);

// -------------
// Rotas
// -------------

// -------------------------------------
// Rotas que não precisam de autorização
// -------------------------------------

// Rota para cadastro
app.post('/signup', celebrateForSignUpAndIn, createUser);
// Rota para login
app.post('/signin', celebrateForSignUpAndIn, login);

// Middleware celebrate de autenticação: para validar todas as solicitações recebidas,
// garantindo que o token cabeçalho esteja presente e corresponda à expressão regular fornecida
// Middleware de autorização com persistência do login
app.use(celebrateForAuth, auth);

// ---------------------------------
// Rotas que precisam de autorização
// ---------------------------------

// Rota que define o prefixo /users
app.use('/users', usersRouter);
// Rota que define o prefixo /cards
app.use('/cards', cardsRouter);

// ------------------
// Winston (errors)
// ------------------

// Habilita registrador de erros
app.use(errorLogger);

// ------------------------
// Tratamento de erros
// ------------------------

// Tratamento de erros do celebrate (Joi)
app.use(errors());

// Middleware para erros 404 - rotas não encontradas
app.use((req, res) => {
  res.status(404).send({
    message: 'A página não foi encontrada, é um endereço inexistente',
  });
});

// Middleware para tratamento de erros centralizado
app.use((err, req, res, next) => {
  // Verifica erros específicos do Mongoose (CastError e ValidationError) e retorna 400 (Bad Request)

  // Quando o Mongoose não consegue converter um valor para o tipo esperado no schema
  if (err.name === 'CastError') {
    return res.status(400).send({ message: '_id inválido ou incompleto' });
  }

  // Quando os dados enviados não atendem às regras definidas no schema do Mongoose
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .send({ message: 'Dado(s) inválido(s) ou inexistente(s)' });
  }

  // Fallback para qualquer outro erro usando statusCode (quando definido pelas classes
  // personalizadas: unauthorized, forbidden, not found e conflict)
  // Se não tiver statusCode definido, assume 500
  // Uma exceção pode ser gerada ao tentar acessar o banco de dados ou o código pode simplesmente
  // travar, não tendo, o erro, a propriedade statusCode. Esses casos, neste projeto, são considerados
  // como um erro do servidor (500), com status e mensagem padrões definidos
  const { statusCode = 500, message = 'Ocorreu um erro no servidor' } = err;

  return res.status(statusCode).send({ message });
});

// ------------------------
// Conexão com MongoDB
// ------------------------

mongoose
  .connect(process.env.MONGODB_URI)
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
