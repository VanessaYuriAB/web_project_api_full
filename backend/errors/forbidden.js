// Construtor de erro personalizado > Forbidden (403)

// Erros de acesso → 403

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'Forbidden';
  }
}

module.exports = ForbiddenError;
