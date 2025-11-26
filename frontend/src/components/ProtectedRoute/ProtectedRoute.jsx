// ----------------------------------------------------
// Componente para proteger a rota '/': usuários não
// autorizados não podem acessá-la
// ----------------------------------------------------

import { useContext } from 'react';

import AuthContext from '@contexts/AuthContext.js';

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { loggedIn } = useContext(AuthContext);

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  // Caso contrário, renderiza o componente filho protegido (Main)
  return children;
}

export default ProtectedRoute;
