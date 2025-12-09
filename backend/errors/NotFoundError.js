// Construtor de erro personalizado > Not Found (404)

// Não encontrado (lançado pelo orFail) → 404

// Documento não encontrado (DocumentNotFoundError): ocorre quando o Mongoose não localiza o recurso solicitado em operações que usam .orFail()

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
