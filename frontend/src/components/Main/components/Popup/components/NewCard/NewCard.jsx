import { useContext, useRef, useEffect } from 'react';

import CurrentUserContext from '@contexts/CurrentUserContext';

import useFormValidator from '@hooks/useFormValidator.js';

import { configAdd } from '@utils/constants';

import useFormSubmit from '@hooks/useFormSubmit.js';

function NewCard({ handleClosePopup, popup }) {
  // Refs para inputs: não é necessário gerenciamento de estado e re-renderização
  const placeRef = useRef(null);
  const linkRef = useRef(null);

  // Contexto: obtém o usuário atual: assina o contexto CurrentUserContext
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  // Validação do formulário
  const { formRef, validatorRef } = useFormValidator(configAdd);

  // Efeito colateral para reset de validação
  useEffect(() => {
    if (popup && validatorRef.current) {
      validatorRef.current.resetValidation();
    }
  }, [popup, validatorRef]);

  // Envio do formulário: inclui preventDefault, loading, onSubmit, onSuccess e onError
  const { handleSubmit, isLoading } = useFormSubmit(
    () =>
      handleAddPlaceSubmit({
        name: placeRef.current.value,
        link: linkRef.current.value,
      }), // onSubmit
    () => {
      formRef.current.reset();
      handleClosePopup();
    }, // onSuccess
    (error) => {
      console.error(
        `Erro ao adicionar novo cartão. \n Nome: ${error.name} \n Mensagem: ${error.message}`
      );
    } // onError
  );

  return (
    <form
      className="form form_popup form_add"
      name="add"
      id="new-card-form"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <h3 className="form__title form__title_popup form__title_add">
        Novo local
      </h3>
      <input
        className="form__input form__input_popup form__input_add"
        id="place-span"
        name="place" // o nome do input é place, mas o servidor espera name
        type="text"
        placeholder="Título"
        minLength="2"
        maxLength="30"
        required
        ref={placeRef}
        aria-label="Título do cartão"
      />
      <span
        className="form__span form__span_popup form__span_add place-span-error"
        id="card-name-error"
      />
      <input
        className="form__input form__input_popup form__input_add"
        id="link-span"
        name="link"
        type="url"
        placeholder="Link de imagem"
        required
        ref={linkRef}
        aria-label="Link da imagem do cartão"
      />
      <span
        className="form__span form__span_popup form__span_add link-span-error"
        id="card-link-error"
      />
      <button
        className="form__button form__button_popup form__button_add"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Criando...' : 'Criar'}
      </button>
    </form>
  );
}

export default NewCard;
