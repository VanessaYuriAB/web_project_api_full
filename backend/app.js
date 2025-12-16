const express = require('express');

const helmet = require('helmet');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const cors = require('cors');

const { errors } = require('celebrate');

const limiter = require('./middlewares/rateLimit');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const celebrateForSignUpAndIn = require('./middlewares/validators/celebrateForSignUpAndIn');
const celebrateForAuth = require('./middlewares/validators/celebrateForAuth');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const ForbiddenError = require('./errors/ForbiddenError');
const ConfigError = require('./errors/ConfigError');

const browserVersion = require('./middlewares/browserVersion');

dotenv.config();

const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3001';
const CSP_CONNECT_SRC = process.env.CSP_CONNECT_SRC || 'http://localhost:3000';

// ------------------------
// Middlewares
// ------------------------

// -------------
// Cors
// -------------

// Precisa vir antes de qualquer middleware que possa bloquear ou modificar a resposta

// '.split(',')' para transformar a string em array
// '.map()' com 'trim()' para remover qlqr espaço em branco que possa ter
const allowedCors = CORS_ORIGIN.split(',').map((url) => url.trim());

// Configuração com opções específicas
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
    const corsError = new ForbiddenError(
      `Origem não permitida pelo CORS, ${origin}`,
    );
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

// -----------
// Helmet
// -----------

// Depois do CORS, para não sobrescrever cabeçalhos

// Configuração com opções específicas

// 'contentSecurityPolicy' espera um array de strings para cada diretiva (como connectSrc)
// No .env armazenamos como uma única string, então precisamos transformar em array
// '.map()' com 'trim()' para limpar cd item, removendo espaços extras, se houver
const connectSrcUrls = CSP_CONNECT_SRC.split(',').map((url) => url.trim());

// Baseado em diretivas definidas no frontend para CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...connectSrcUrls],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

// Para 'Referrer Policy'
app.use(helmet.referrerPolicy({ policy: 'same-origin' })); // o cabeçalho 'Referer'
// normalmente informa a URL da página anterior quando você navega para outra >
// 'same-origin' envia o referer apenas para o mesmo domínio

// -----------
// Rate limit
// -----------

// Depois do CORS, para não bloquear preflight

// Validação antes de aplicar o rate limit
if (NODE_ENV === 'production' && !process.env.RATE_LIMIT_MAX) {
  throw new ConfigError('RATE_LIMIT_MAX é obrigatório em produção!');
}

// Aplica o limitador de taxa
app.use(limiter);

// ------------------
// Winston (requests)
// ------------------

// Habilita registrador de solicitações
app.use(requestLogger);

// -----------
// Browser
// -----------

// Verificação da versão do navegador > medida de segurança
app.use(browserVersion);

// --------------
// Parsing JSON
// --------------

// Middleware para analisar o corpo das requisições como JSON
// Converte automaticamente o corpo da requisição (que chega como texto) em um objeto
// JavaScript acessível via req.body
app.use(express.json());

// -------------
// Rotas
// -------------

// --------------------
// Rotas públicas
// --------------------

// Rota para cadastro
app.post('/signup', celebrateForSignUpAndIn, createUser);

// Rota para login
app.post('/signin', celebrateForSignUpAndIn, login);

// --------------------------
// Autenticação e validação
// --------------------------

// Middleware celebrate de autenticação: para validar todas as solicitações recebidas,
// garantindo que o token cabeçalho esteja presente e corresponda à expressão regular fornecida
// Middleware de autorização com persistência do login
app.use(celebrateForAuth, auth);

// ------------------
// Rotas privadas
// ------------------

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

  // Quando variáveis de ambiente não são configuradas no ambiente de produção
  if (err.name === 'ConfigError') {
    return res
      .status(500)
      .send({ message: `Erro de configuração do servidor: ${err.message}` });
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

// Validação antes de iniciar a aplicação
if (NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  throw new ConfigError('MONGODB_URI é obrigatório em produção!');
}

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aroundbfull')
  .then(() => {
    console.log(
      `Connected to MongoDB, ${process.env.DB_NAME ? `${process.env.DB_NAME}` : 'o nome do banco de dados é aroundbfull, no local'}`,
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
