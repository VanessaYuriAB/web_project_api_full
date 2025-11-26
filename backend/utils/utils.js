// Constantes para os códigos de tipos de erros
const ERROR_CODES = {
  BAD_REQUEST_VALIDATION: 400,
  BAD_REQUEST_CAST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

// Função para mapeamento de erros (Mongoose e do servidor)
function mapError(err) {
  // Erros de validação → 400
  if (err.name === 'ValidationError') {
    return {
      statusCode: ERROR_CODES.BAD_REQUEST_VALIDATION,
      name: 'ValidationError',
      message: 'Ocorreu um erro: dado(s) inválido(s) ou inexistente(s) passado(s) ao método',
    };
  }

  // Erros de cast → 400
  if (err.name === 'CastError') {
    return {
      statusCode: ERROR_CODES.BAD_REQUEST_CAST,
      name: 'CastError',
      message: 'Ocorreu um erro: _id inválido ou incompleto passado ao método',
    };
  }

  // Não encontrado (lançado pelo orFail) → 404
  if (err.name === 'NotFoundError') {
    return {
      statusCode: ERROR_CODES.NOT_FOUND,
      name: 'NotFoundError',
      message: err.message || 'Recurso não encontrado',
    };
  }

  // Qualquer outro erro → 500
  return {
    statusCode: ERROR_CODES.INTERNAL_SERVER,
    name: 'InternalServerError',
    message: 'Ocorreu um erro no servidor',
  };
}

// Função para manipulação do envio da resposta de erro em rotas Express
function handleError(res, err) {
  const { statusCode, name, message } = mapError(err);
  res.status(statusCode).send({ message: `${message}, ${name}` });
}

// Função wrapper para controllers assíncronos
function handleAsync(controllerFn) {
  return async (req, res) => {
    try {
      await controllerFn(req, res);
    } catch (err) {
      handleError(res, err);
    }
  };
}

module.exports = { handleAsync };
