const rateLimit = require('express-rate-limit');

const { NODE_ENV, RATE_LIMIT_MAX } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //  em 15 minutos
  max: NODE_ENV === 'production' ? RATE_LIMIT_MAX : 1000, // permite, no máximo, a qtdd de solicitações especificadas, a partir de um IP, para ambiente de produção > em desenvolvimento, definido para 1000
});

module.exports = limiter;
