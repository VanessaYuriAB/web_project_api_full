import aroundLogo from '@assets/logo.svg';
import lineHeader from '@assets/line-header.svg';

import { useLocation, Link } from 'react-router-dom';
import { useContext } from 'react';

import AuthContext from '@contexts/AuthContext.js';

function Header({ onSignOut }) {
  // Hook de localização para saber em qual rota está
  const location = useLocation();

  // Contexto de autenticação, extraindo estado de login e email do usuário
  const { loggedIn, emailLogged } = useContext(AuthContext);

  /* -------------- Registro ----------------- */
  // Se estiver na rota de cadastro, renderiza o header específico
  // para a página de registro
  if (location.pathname === '/signup') {
    return (
      <header className="header page__header header_register ">
        <div className="header__container">
          <img
            className="header__img-logo"
            src={aroundLogo}
            alt="Logotipo: 'Around The U.S.'. Around é escrito maior e The U.S. está
            posicionado como um expoente, em tamamnho bem menor."
          />

          <Link className="header__link-login" to="/signin">
            Faça o login
          </Link>
        </div>

        <img
          className="header__img-line"
          src={lineHeader}
          alt="Linha de divisão inferior do bloco header."
        />
      </header>
    );
  }

  /* ---------------- Login ------------------- */
  // Se estiver na rota de login, renderiza o header específico
  // para a página de login
  if (location.pathname === '/signin') {
    return (
      <header className="header page__header header_login ">
        <div className="header__container">
          <img
            className="header__img-logo"
            src={aroundLogo}
            alt="Logotipo: 'Around The U.S.'. Around é escrito maior e The U.S. está
          posicionado como um expoente, em tamamnho bem menor."
          />

          <Link className="header__link-login" to="/signup">
            Inscreva-se
          </Link>
        </div>

        <img
          className="header__img-line"
          src={lineHeader}
          alt="Linha de divisão inferior do bloco header."
        />
      </header>
    );
  }

  /* ----------------- Perfil ------------------- */
  // Renderiza o header padrão da página principal,
  // para usuários logados
  return (
    <header className="header page__header">
      <div className="header__container">
        <img
          className="header__img-logo"
          src={aroundLogo}
          alt="Logotipo: 'Around The U.S.'. Around é escrito maior e The U.S. está
          posicionado como um expoente, em tamamnho bem menor."
        />

        {loggedIn && (
          <div className="header__log">
            <p className="header__email">{emailLogged}</p>
            <Link
              className="header__link-logout"
              to="/signin"
              onClick={onSignOut}
            >
              Sair
            </Link>
          </div>
        )}
      </div>

      <img
        className="header__img-line"
        src={lineHeader}
        alt="Linha de divisão inferior do bloco header."
      />
    </header>
  );
}

export default Header;
