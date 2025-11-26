import { useRef, useContext, useEffect } from 'react';

import CurrentUserContext from '@contexts/CurrentUserContext.js';

import useFormValidator from '@hooks/useFormValidator.js';

import { configPhoto } from '@utils/constants.js';

import useFormSubmit from '@hooks/useFormSubmit.js';

function EditAvatar({ handleClosePopup, popup }) {
  // Ref para o input: não é necessário gerenciar o estado do input com useState e útil para evitar re-renderizações desnecessárias
  const avatarRef = useRef(null);

  // Contexto: obtém o usuário atual: assina o contexto CurrentUserContext
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  // Validação do formulário
  const { formRef, validatorRef } = useFormValidator(configPhoto);

  // Efeito colateral para reset de validação
  useEffect(() => {
    if (popup && validatorRef.current) {
      validatorRef.current.resetValidation();
    }
  }, [popup, validatorRef]);

  // Envio do formulário: inclui preventDefault, loading, onSubmit, onSuccess e onError
  const { handleSubmit, isLoading } = useFormSubmit(
    () => handleUpdateAvatar(avatarRef.current.value), // onSubmit
    () => {
      formRef.current.reset();
      handleClosePopup();
    }, // onSuccess
    (error) => {
      console.error(
        `Erro ao atualizar a foto do perfil. \n Nome: ${error.name} \n Mensagem: ${error.message}`
      );
    } // onError
  );

  return (
    <form
      className="form form_popup form_photo"
      name="photo"
      id="edit-avatar-form"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <h3 className="form__title form__title_popup form__title_photo">
        Alterar a foto do perfil
      </h3>
      <input
        className="form__input form__input_popup form__input_photo"
        id="photo-span"
        name="photo"
        type="url"
        placeholder="Link da foto"
        required
        ref={avatarRef}
        aria-label="Link da foto do perfil"
      />
      <span
        className="form__span form__span_popup form__span_photo photo-span-error"
        id="avatar-photo-error"
      />
      <button
        className="form__button form__button_popup form__button_photo"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export default EditAvatar;
