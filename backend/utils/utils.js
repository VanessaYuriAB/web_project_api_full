// Função wrapper utilitária para o fluxo de tratamento de erros

// Para controllers da api, assíncronos > enviam o erro para o middleware de tratamento centralizado
module.exports = function handleAsync(controllerFn) {
  return async (req, res, next) => {
    try {
      await controllerFn(req, res);
    } catch (err) {
      next(err);
    }
  };
};
