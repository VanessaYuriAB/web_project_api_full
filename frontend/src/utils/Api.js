// ----------------------------------------------------------------
// Arquivo para interações de API relacionadas ao perfil do usuário
// ----------------------------------------------------------------

import { myCards } from './constants';

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Método (privado) para realizar requisições à API
  _makeRequest = async ({
    endpoint,
    headers = this._headers,
    method,
    requestBody,
  }) => {
    const options = {
      headers,
      method,
      body: requestBody ? JSON.stringify(requestBody) : undefined, // adiciona e stringifica o corpo da requisição apenas se existir na requisição; se não, com a definição de undefined, o fetch ignora o body e a propriedade requestBody é completamente omitida do objeto options, não existindo na requisição
    };

    const res = await fetch(endpoint, options);
    return this._checkResponse(res);
  };

  // Método (privado) para tratamento das respostas dos métodos da classe
  _checkResponse = async (res) => {
    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`); // se o servidor
      // retornar um erro, lance o erro, a ser tratado na função de chamada do método
    } else {
      return res.json();
    }
  };

  // Carrega as informações de usuário do servidor
  _getUserInfo = async () => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/users/me`,
      method: 'GET', // a solicitação GET é enviada com content-type,
      // mas não interfere no resultado
      // requestBody não é necessário para GET
    });
  };

  // Envia meus cards iniciais ao usuário do servidor
  createInitialCards = async () => {
    const promises = myCards.map(async (card) => {
      return this._makeRequest({
        endpoint: `${this._baseUrl}/cards/`,
        method: 'POST',
        requestBody: {
          name: card.place, // o nome do input em myCards é place
          link: card.link,
        },
      });
    });

    return Promise.all(promises); // retorna uma Promise que só resolve quando
    // todos os cards do map forem enviados
  };

  // Captura cards do usuário do servidor
  _getCards = async () => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/`,
      method: 'GET',
    });
  };

  // Atualiza infos do perfil
  updateProfileInfo = async (dataProfile) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/users/me`,
      method: 'PATCH',
      requestBody: {
        name: dataProfile.name,
        about: dataProfile.about,
      },
    });
  };

  // Atualiza foto do perfil
  updateProfileAvatar = async (dataPhoto) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/users/me/avatar`,
      method: 'PATCH',
      requestBody: {
        avatar: dataPhoto,
      },
    });
  };

  // Adiciona um novo cartão na conta do usuário do servidor
  createNewCard = async (dataCard) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/`,
      method: 'POST',
      requestBody: {
        name: dataCard.name, // o nome do input em NewCard.jsx é
        // place, mas o servidor espera name
        link: dataCard.link,
      },
    });
  };

  // Curte um cartão
  _likeCard = async (cardId) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/${cardId}/likes`,
      method: 'PUT',
    });
  };

  // Descurte um cartão
  _unlikeCard = async (cardId) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/${cardId}/likes`,
      method: 'DELETE',
    });
  };

  // Altera o status de curtir/descurtir um cartão
  toggleLikeCard(cardId, shouldLike) {
    // Se o cartão não foi curtido, curta-o, caso contrário, descurta
    return shouldLike ? this._likeCard(cardId) : this._unlikeCard(cardId);
  }

  // Deleta um cartão do servidor
  deleteCard = async (cardId) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/${cardId}`,
      method: 'DELETE',
    });
  };

  // Captura cartões somente após carregar as informações do usuário no servidor
  getServerUserAndCards() {
    return Promise.all([this._getUserInfo(), this._getCards()]);
  }
}

// Instância de Api: myApi (fetch)
const myApi = new Api({
  baseUrl: 'https://around-api.pt-br.tripleten-services.com/v1',
  headers: {
    authorization: '3c7ad9a7-200c-4d07-b160-7978cd40d815',
    'Content-Type': 'application/json',
  },
});

export default myApi;
