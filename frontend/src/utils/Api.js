// ----------------------------------------------------------------
// Arquivo para interações de API relacionadas ao perfil do usuário
// ----------------------------------------------------------------

import { myCards } from './constants';

import { getToken } from './token';

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    // headers definido em método para utilização de token dinâmico
  }

  // Método (privado) para definição do headers em tds requisições de Api
  // Para definição dinâmica do token > sempre atualizado
  _getHeaders = () => {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    };
  };

  // Método (privado) para realizar requisições à API
  _makeRequest = async ({ endpoint, method, requestBody }) => {
    const options = {
      headers: this._getHeaders(), // usa o headers dinâmico, já definindo a propriedade
      // em tds as requisições que chamam _makeRequest
      method,
      body: requestBody ? JSON.stringify(requestBody) : undefined, // adiciona e stringifica
      // o corpo da requisição apenas se existir na requisição; se não, com a definição de
      // undefined, o fetch ignora o body e a propriedade requestBody é completamente omitida
      // do objeto options, não existindo na requisição
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
      const { data } = await res.json(); // // aguarda o parsing e desestrutura o objeto
      // completo do backend
      return data; // retorna apenas o objeto interno, com o conteúdo de cada requisição
    }
  };

  // Carrega as informações de usuário do servidor
  _getUserInfo = () => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/users/me`,
      method: 'GET', // a solicitação GET é enviada com content-type,
      // mas não interfere no resultado
      // requestBody não é necessário para GET
    });
  };

  // Envia meus cards iniciais ao usuário do servidor
  createInitialCards = async () => {
    const promises = myCards.map((card) => {
      return this._makeRequest({
        endpoint: `${this._baseUrl}/cards/`,
        method: 'POST',
        requestBody: {
          name: card.place, // o nome do input em myCards é place
          link: card.link,
        },
      });
    });

    const result = await Promise.all(promises); // await aguarda tds as promisses para já
    // devolver o resultado, quem chamar o método não precisa aguardar > Promise.all devolve,
    // tbm, uma promisse que só resolve quando tds os cards do map forem enviados

    return result; // retorna o array da Promisse já com as respostas
  };

  // Captura cards do usuário do servidor
  _getCards = () => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/`,
      method: 'GET',
    });
  };

  // Atualiza infos do perfil
  updateProfileInfo = (dataProfile) => {
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
  updateProfileAvatar = (dataPhoto) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/users/me/avatar`,
      method: 'PATCH',
      requestBody: {
        avatar: dataPhoto,
      },
    });
  };

  // Adiciona um novo cartão na conta do usuário do servidor
  createNewCard = (dataCard) => {
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
  _likeCard = (cardId) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/${cardId}/likes`,
      method: 'PUT',
    });
  };

  // Descurte um cartão
  _unlikeCard = (cardId) => {
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
  deleteCard = (cardId) => {
    return this._makeRequest({
      endpoint: `${this._baseUrl}/cards/${cardId}`,
      method: 'DELETE',
    });
  };

  // Captura cartões somente após carregar as informações do usuário no servidor
  getServerUserAndCards() {
    return Promise.all([this._getUserInfo(), this._getCards()]); // quem chama o método,
    // aguarda o resultado das promisses com await
  }
}

// Instância de Api: myApi (fetch)
const apiBaseUrl = import.meta.env.VITE_API_URL;

const myApi = new Api({ baseUrl: apiBaseUrl });

export default myApi;
