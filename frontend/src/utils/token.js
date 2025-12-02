const TOKEN_KEY = 'jwt';

export const setAndStorageToken = (token, setTokenState) => {
  localStorage.setItem(TOKEN_KEY, token); // armazena o token no localStorage
  if (setTokenState) {
    setTokenState(token); // atualiza a variável de estado do token
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (setTokenState) => {
  localStorage.removeItem(TOKEN_KEY);
  if (setTokenState) {
    setTokenState(''); // limpa a variável de estado do token
  }
};
