const express = require('express');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const cors = require('cors');

const { createUser, login } = require('./controllers/users');

const auth = require('./middleware/auth');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { handleError } = require('./utils/utils');

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

    // Cria um erro customizado com name, compatível com sistema de tratamento em utils.js
    const corsError = new Error(`Origem não permitida pelo CORS, ${origin}`);
    corsError.name = 'Forbidden'; // para mapear no handleError
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

// Middleware para capturar e tratar erros do CORS
// Quando o middleware global de erros for implementado,
// o bloco de captura de erros será movido para o final do arquivo
app.use((err, res) => {
  handleError(res, err);
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
