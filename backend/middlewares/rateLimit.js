const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //  em 15 minutos
  max: 100, // permite, no máximo, 100 solicitações a partir de um IP
});

module.exports = limiter;
