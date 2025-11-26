import ImagePopup from '../Popup/components/ImagePopup/ImagePopup';
import DeleteConfirmation from '../Popup/components/DeleteConfirmation/DeleteConfirmation.jsx';

import { useContext } from 'react';

import CurrentUserContext from '@contexts/CurrentUserContext.js';

function Card({
  card,
  handleOpenPopup,
  handleClosePopup,
  onCardLike,
  onCardDelete,
}) {
  // Desestruturação do objeto card
  const { isLiked } = card;

  // Contexto: obtém o usuário atual: assina o contexto CurrentUserContext
  const { currentUser } = useContext(CurrentUserContext);

  // Para verificar se o cartão é do usuário atual
  const isCardOwner = currentUser._id === card.owner;

  // Verificação para classe do botão like: a classe 'card__like-button_is-active'
  // será aplicada para mostrar que o botão está no status "curtir"
  const cardLikeButtonClassName = `card__like-btn ${
    isLiked ? 'card__like-btn_active' : ''
  }`;

  // Objeto para popup Image
  const imagePopup = { children: <ImagePopup card={card} />, type: 'image' };

  // Objeto para popup DeleteConfirmation
  const deleteConfirmationPopup = {
    children: (
      <DeleteConfirmation
        handleClosePopup={handleClosePopup}
        handleCardDelete={onCardDelete}
        card={card}
      />
    ),
    type: 'delete',
  };

  // Handler: para lidar com o clique no botão de curtir/descurtir cartão:
  // permite que o componente pai (App) gerencie a lógica de curtir/descurtir
  // o cartão e atualize o estado dos cartões
  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <li className="card">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={() => handleOpenPopup(imagePopup)}
      />
      {isCardOwner && (
        <button
          className="card__trash-btn"
          id="tsh-model"
          type="button"
          onClick={() => {
            handleOpenPopup(deleteConfirmationPopup);
          }}
          aria-label="Deletar cartão"
        />
      )}
      <div className="card__text">
        <h3 className="card__name">{card.name}</h3>
        <button
          className={cardLikeButtonClassName}
          type="button"
          onClick={handleLikeClick}
          aria-label="Curtir/descurtir cartão"
        />
      </div>
    </li>
  );
}

export default Card;
