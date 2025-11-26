import { useContext } from 'react';

import Popup from './components/Popup/Popup';

import NewCard from './components/Popup/components/NewCard/NewCard';
import EditProfile from './components/Popup/components/EditProfile/EditProfile';
import EditAvatar from './components/Popup/components/EditAvatar/EditAvatar';

import Card from './components/Card/Card';

import CurrentUserContext from '@contexts/CurrentUserContext.js';

function Main({
  popup,
  onOpenPopup,
  onClosePopup,
  cards,
  onCardLike,
  onCardDelete,
}) {
  // Contexto: obtém o usuário atual: assina o contexto CurrentUserContext
  const { currentUser } = useContext(CurrentUserContext);

  // Obj para popup NewCard
  const newCardPopup = {
    children: <NewCard handleClosePopup={onClosePopup} popup={popup} />,
  };

  // Obj para popup EditProfile
  const editProfilePopup = {
    children: <EditProfile handleClosePopup={onClosePopup} />,
  };

  // Obj para popup EditAvatar
  const editAvatarPopup = {
    children: <EditAvatar handleClosePopup={onClosePopup} popup={popup} />,
    type: 'avatar',
  };

  return (
    <main className="content page__content">
      <section className="content__profile">
        <div className="profile__photo">
          <img
            className="profile__img"
            src={currentUser.avatar}
            alt="Foto do perfil do usuário"
            aria-label="Foto de perfil"
          />
          <button
            className="profile__overlay"
            type="button"
            onClick={() => onOpenPopup(editAvatarPopup)}
            aria-label="Alterar foto do perfil"
          />
        </div>

        <div className="profile__infos">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            className="profile__edit-btn"
            type="button"
            onClick={() => onOpenPopup(editProfilePopup)}
            aria-label="Alterar informações do perfil"
          />
          <h2 className="profile__about">{currentUser.about}</h2>
        </div>

        <button
          className="profile__add-btn"
          type="button"
          onClick={() => onOpenPopup(newCardPopup)}
          aria-label="Adicionar novo cartão"
        />
      </section>

      <section className="content__elements">
        <ul className="elements__cards">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              handleOpenPopup={onOpenPopup}
              handleClosePopup={onClosePopup}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>

      {/* se o popup não for nulo, o componente será renderizado na tela */}

      {popup && (
        <Popup onClose={onClosePopup} popup={popup} type={popup.type}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
