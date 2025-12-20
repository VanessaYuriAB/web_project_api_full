const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');
const ConfigError = require('../errors/ConfigError');

module.exports = (req, res, next) => {
  // Extrai 'authorization' do cabeçalho, onde armazenamos o token no frontend, definido e
  // m frontend/src/utils/utils.js
  const { authorization } = req.headers;

  // Obtém apenas o token, substituindo o 'Bearer' do valor da string do cabeçalho definido
  // no front por nenhum valor para removê-lo, deixando apenas o JWT
  const token = authorization.replace('Bearer ', '');

  // Inicia 'payload' para uso fora do bloco try/catch
  let payload;

  // Validação antes de verificar o token
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new ConfigError('JWT_SECRET é obrigatório em produção!');
  }

  try {
    // Verificação do token, retornando o payload decodificado desse token, no caso de
    // sucesso
    // Em caso de insucesso, o return do catch interrompe o fluxo (se houver erro)
    payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch (err) {
    return next(
      new UnauthorizedError('Token inválido ou expirado, não autorizado'),
    );
  }

  // Atribui o payload para o objeto de solicitação, objeto user
  req.user = payload;

  // Envia a solicitação para o próximo middleware
  return next();
};
