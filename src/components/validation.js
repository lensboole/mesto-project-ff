const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

function showError(form, input, message, config) {
  const error = form.querySelector(`.${input.name}-error`);
  input.classList.add(config.inputErrorClass);
  error.textContent = message;
  error.classList.add(config.errorClass);
}

function hideError(form, input, config) {
  const error = form.querySelector(`.${input.name}-error`);
  input.classList.remove(config.inputErrorClass);
  error.textContent = "";
  error.classList.remove(config.errorClass);
}

function checkValidity(form, input, config) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity("");
  }

  if (!input.validity.valid) {
    showError(form, input, input.validationMessage, config);
  } else {
    hideError(form, input, config);
  }
}

function toggleButton(inputs, button, config) {
  const isValid = inputs.every(input => input.validity.valid);
  button.disabled = !isValid;
  button.classList.toggle(config.inactiveButtonClass, !isValid);
}

export function enableValidation(config = validationConfig) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach(form => {
    const inputs = [...form.querySelectorAll(config.inputSelector)];
    const button = form.querySelector(config.submitButtonSelector);

    inputs.forEach(input => {
      input.addEventListener("input", () => {
        checkValidity(form, input, config);
        toggleButton(inputs, button, config);
      });
    });

    toggleButton(inputs, button, config);
  });
}

export function clearValidation(form, config = validationConfig) {
  const inputs = [...form.querySelectorAll(config.inputSelector)];
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    hideError(form, input, config);
    input.setCustomValidity("");
  });

  button.disabled = true;
  button.classList.add(config.inactiveButtonClass);
}