// ---------------------------------------------
// Arquivo para funções utilitárias e variáveis
// relacionadas à API de autenticação
// ---------------------------------------------

// Função genérica para enviar requisições HTTP
export const makeAuthRequest = async ({
  token,
  endpoint,
  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
  },
  method,
  reqBody,
}) => {
  try {
    const options = {
      headers,
      method,
      body: reqBody ? JSON.stringify(reqBody) : undefined,
    };

    return await fetch(endpoint, options);
  } catch (error) {
    throw new Error(`Erro na requisição para ${endpoint}: ${error.message}`);
  }
};

// Função para obter mensagens de erro baseadas no status da resposta HTTP
export const getErrorMessageByStatus = ({
  resStatus,
  dataMessage,
  notFoundMsg,
  unauthorizedMsg = '', // valor padrão vazio, se não fornecido, no caso da requisição register
  defaultMsg,
}) => {
  let message;
  switch (resStatus) {
    case 400:
      message = dataMessage || notFoundMsg;
      break;
    case 401:
      message = dataMessage || unauthorizedMsg;
      break;
    case 500:
      message = 'Erro interno do servidor';
      break;
    default:
      message = defaultMsg;
  }
  return message;
};

// Variáveis para mensagens de erro conforme requisição (endpoint)
export const errorMessages = {
  register: {
    notFound:
      'Um dos campos foi preenchido incorretamente ou o e-mail já está cadastrado',
    default: 'Erro desconhecido durante o cadastro',
  },
  authorize: {
    notFound: 'Um ou mais campos não foram fornecidos',
    unauthorized:
      'Não autorizado: o usuário com o e-mail especificado não foi encontrado ou a senha está incorreta',
    default: 'Erro desconhecido durante o login',
  },
  getContent: {
    notFound: 'Token não fornecido ou fornecido em formato errado',
    unauthorized: 'O token fornecido é inválido',
    default: 'Erro desconhecido durante a busca de informações de login',
  },
};
