class FormValidator {
  constructor(config, formElement) {
    this._formElement = formElement;

    // Prefixo para montar os seletores dinamicamente
    const prefix = config.formClassPrefix ? `_${config.formClassPrefix}` : '';

    this._inputSelector = `.form__input${prefix}`;
    this._submitButtonSelector = `.form__button${prefix}`;
    this._inputErrorClass = `form__span${prefix}`;

    this._inactiveButtonClass = 'form__button_disabled'; // valor padrão

    this._inputList = Array.from(
      this._formElement.querySelectorAll(this._inputSelector)
    );

    this._buttonElement = this._formElement.querySelector(
      this._submitButtonSelector
    );
  }

  _checkInputValidity(inputElement) {
    // Limpa mensagens personalizadas anteriores
    inputElement.setCustomValidity('');

    // Se o padrão não for atendido e existir um title, use-o como mensagem
    if (inputElement.validity.patternMismatch && inputElement.title) {
      inputElement.setCustomValidity(inputElement.title);
    }

    // Atualiza o estado visual
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _showInputError(inputElement, errorMessage) {
    const errorElement = this._formElement.querySelector(
      `.${inputElement.id}-error`
    );

    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._inputErrorClass);
  }

  _hideInputError(inputElement) {
    const errorElement = this._formElement.querySelector(
      `.${inputElement.id}-error`
    );

    errorElement.classList.remove(this._inputErrorClass);
    errorElement.textContent = '';
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._buttonElement.classList.add(this._inactiveButtonClass);
      this._buttonElement.disabled = true;
    } else {
      this._buttonElement.classList.remove(this._inactiveButtonClass);
      this._buttonElement.disabled = false;
    }
  }

  _hasInvalidInput() {
    return this._inputList.some((inputElement) => !inputElement.validity.valid);
  }

  _setEventListeners() {
    this._toggleButtonState();

    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    });
  }

  enableValidation() {
    this._setEventListeners();
  }

  resetValidation() {
    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
    });
    this._toggleButtonState();
  }
}

export default FormValidator;
