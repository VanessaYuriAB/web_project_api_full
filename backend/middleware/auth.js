const jwt = require('jsonwebtoken');

const { handleError } = require('../utils/utils');

module.exports = (req, res, next) => {
  // Extrai 'authorization' do cabeçalho, onde armazenamos o token no frontend, definido em frontend/src/utils/utils.js
  const { authorization } = req.headers;

  // Validação básica do cabeçalho do token
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Acesso negado, sem permissão para o recurso');
    err.name = 'Forbidden';
    return handleError(res, err);
  }

  // Obtém apenas o token, substituindo o 'Bearer' do valor da string do cabeçalho definido no front por nenhum valor para removê-lo, deixando apenas o JWT
  const token = authorization.replace('Bearer ', '');

  // Inicia 'payload' para uso fora do bloco try/catch
  let payload;

  try {
    // Verificação do token, retornando o payload decodificado desse token
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    const error = new Error('Token inválido ou expirado, não autorizado');
    error.name = 'Unauthorized';
    return handleError(res, error);
  }

  // Atribui o payload para o objeto de solicitação, objeto user
  req.user = payload;

  // Envia a solicitação para o próximo middleware
  return next();
};
