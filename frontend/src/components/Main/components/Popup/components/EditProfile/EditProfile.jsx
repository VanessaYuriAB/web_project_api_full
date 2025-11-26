import { useState, useContext } from 'react';

import CurrentUserContext from '@contexts/CurrentUserContext.js';

import useFormValidator from '@hooks/useFormValidator.js';

import { configEdt } from '@utils/constants.js';

import useFormSubmit from '@hooks/useFormSubmit.js';

function EditProfile({ handleClosePopup }) {
  // Contexto: obtém o usuário atual: assina o contexto CurrentUserContext
  const userContext = useContext(CurrentUserContext); // extrai o contexto do usuário atual
  const { currentUser, handleUpdateUser } = userContext; // extrai o usuário atual e a função de atualização do usuário do contexto

  // Define o estado inicial dos campos do formulário com os valores do usuário atual,
  // garantindo que o formulário seja preenchido com as informações corretas quando aberto
  const [name, setName] = useState(currentUser?.name || '');
  const [about, setAbout] = useState(currentUser?.about || '');

  // Validação do formulário: este não utiliza o reset da validação > não precisa do validatorRef
  const { formRef } = useFormValidator(configEdt);

  // Função de submissão: inclui preventDefault, loading, onSubmit, onSuccess e onError
  const { handleSubmit, isLoading } = useFormSubmit(
    () => handleUpdateUser({ name, about }), // onSubmit
    handleClosePopup, // onSuccess
    (error) => {
      console.error(
        `Erro ao atualizar o perfil. \n Nome: ${error.name} \n Mensagem: ${error.message}`
      );
    } // onError
  );

  // Handlers
  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleAboutChange(event) {
    setAbout(event.target.value);
  }

  return (
    <form
      className="form form_popup form_edt"
      name="edt"
      id="edit-profile-form"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <h3 className="form__title form__title_popup form__title_edt">
        Editar perfil
      </h3>
      <input
        className="form__input form__input_popup form__input_edt"
        id="name-span"
        name="name"
        type="text"
        placeholder="Nome"
        minLength="2"
        maxLength="40"
        required
        value={name}
        onChange={handleNameChange}
        aria-label="Nome do perfil"
      />
      <span
        className="form__span form__span_popup form__span_edt name-span-error"
        id="profile-name-error"
      />
      <input
        className="form__input form__input_popup form__input_edt"
        id="about-span"
        name="about"
        type="text"
        placeholder="Sobre mim"
        minLength="2"
        maxLength="200"
        required
        value={about}
        onChange={handleAboutChange}
        aria-label="Descrição do perfil"
      />
      <span
        className="form__span form__span_popup form__span_edt about-span-error"
        id="profile-about-error"
      />
      <button
        className="form__button form__button_popup form__button_edt"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export default EditProfile;
