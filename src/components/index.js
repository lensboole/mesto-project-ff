import "/src/pages/index.css";
import { createCard, deleteCard, toggleLike, isCardLiked } from "./card.js";
import avatar from "../images/avatar.jpg";
import { openPopup, closePopup } from "./modal.js";
import { enableValidation, clearValidation } from './validation.js';
import { 
  loadUserData, 
  getInitialCards, 
  updateProfileData,
  updateAvatar,
  addNewCard,
  deleteCardFromServer,
  toggleLikeOnServer
} from './api.js';

// DOM элементы
const cardsContainer = document.querySelector(".places__list");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const avatarPopup = document.querySelector(".popup_type_avatar");
const imagePopup = document.querySelector(".popup_type_image");
const image = imagePopup.querySelector(".popup__image");
const caption = imagePopup.querySelector(".popup__caption");
const editForm = editPopup.querySelector(".popup__form");
const addForm = addPopup.querySelector(".popup__form");
const avatarForm = avatarPopup.querySelector(".popup__form");
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");
const cardNameInput = addForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addForm.querySelector(".popup__input_type_url");
const avatarLinkInput = avatarForm.querySelector(".popup__input_type_url");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const avatarEditButton = document.querySelector(".profile__image-edit-button");
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

let currentUserId;

// Загрузка данных при старте
Promise.all([loadUserData(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    renderUserInfo(userData);
    renderCards(cards);
  })
  .catch(console.error);

// Функции рендеринга
function renderUserInfo(user) {
  profileName.textContent = user.name;
  profileDescription.textContent = user.about;
  profileImage.style.backgroundImage = `url(${user.avatar || avatar})`;
}

function renderCards(cards) {
  cards.forEach(card => {
    const cardElement = createCard(
      card,
      () => handleDeleteCard(card._id, cardElement),
      () => handleLikeCard(card._id, cardElement),
      openImagePopup,
      currentUserId
    );
    cardsContainer.append(cardElement);
  });
}

  function handleLikeCard(cardId, cardElement) {
  const isLiked = isCardLiked(cardElement);
  
  toggleLikeOnServer(cardId, isLiked)
    .then(updatedCard => {
      toggleLike(cardElement, updatedCard.likes.length);
    })
    .catch(err => {
      console.error("Ошибка при обновлении лайка:", err);
    });
}

// Обработчики действий
function handleDeleteCard(cardId, cardElement) {
  deleteCardFromServer(cardId)
    .then(() => {
      deleteCard(cardElement);
    })
    .catch(console.error);
}

function openImagePopup(cardData) {
  image.src = cardData.link;
  image.alt = cardData.name;
  caption.textContent = cardData.name;
  
  openPopup(imagePopup);
}

// Обработчики форм
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Сохранение...";
  
  updateProfileData(nameInput.value, jobInput.value)
    .then(userData => {
      renderUserInfo(userData);
      closePopup(editPopup);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Создание...";
  
  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then(newCard => {
      const cardElement = createCard(
        newCard,
        () => handleDeleteCard(newCard._id, cardElement),
        () => handleLikeCard(newCard._id, cardElement),
        openImagePopup,
        currentUserId
      );
      cardsContainer.prepend(cardElement);
      closePopup(addPopup);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Сохранение...";
  
  updateAvatar(avatarLinkInput.value)
    .then(userData => {
      renderUserInfo(userData);
      closePopup(avatarPopup);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// Навешивание обработчиков
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openPopup(editPopup);
});

addButton.addEventListener("click", () => {
  addForm.reset();
  clearValidation(addForm, validationConfig);
  openPopup(addPopup);
});

avatarEditButton.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopup(avatarPopup);
});

editForm.addEventListener("submit", handleEditFormSubmit);
addForm.addEventListener("submit", handleAddFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Закрытие попапов
document.querySelectorAll(".popup__close").forEach(button => {
   const popup = button.closest(".popup");
  button.addEventListener("click", () => {
    closePopup(popup);
  });
});

// Включение валидации
enableValidation(validationConfig);

document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});