const jwt = require('jsonwebtoken');

const ForbiddenError = require('../errors/forbidden');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  // Extrai 'authorization' do cabeçalho, onde armazenamos o token no frontend, definido em frontend/src/utils/utils.js
  const { authorization } = req.headers;

  // Validação básica do cabeçalho do token
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new ForbiddenError('Acesso negado, sem permissão para o recurso'),
    );
  }

  // Obtém apenas o token, substituindo o 'Bearer' do valor da string do cabeçalho definido no front por nenhum valor para removê-lo, deixando apenas o JWT
  const token = authorization.replace('Bearer ', '');

  // Inicia 'payload' para uso fora do bloco try/catch
  let payload;

  try {
    // Verificação do token, retornando o payload decodificado desse token, no caso de sucesso
    // Em caso de insucesso, o return do catch interrompe o fluxo (se houver erro)
    payload = jwt.verify(token, 'secret-key');
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
