const winston = require('winston');
const expressWinston = require('express-winston');

// Registrador de solicitações
const requestLogger = expressWinston.logger({
  // 'transposts' é um array no qual podemos escrever outros destinos para os logs,
  // que podem ser gravados no console ou em um serviço de análise de terceiros
  transports: [new winston.transports.File({ filename: 'request.log' })],
  // 'format' é responsável pelo formato do registro de log
  format: winston.format.json(),
});

// Registrados de erros
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
