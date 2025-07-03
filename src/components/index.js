import "/src/pages/index.css";
import { createCard, deleteCard, toggleLike } from "./card.js";
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

// Попапы
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const avatarPopup = document.querySelector(".popup_type_avatar");
const imagePopup = document.querySelector(".popup_type_image");

// Формы
const editForm = editPopup.querySelector(".popup__form");
const addForm = addPopup.querySelector(".popup__form");
const avatarForm = avatarPopup.querySelector(".popup__form");

// Поля ввода
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");
const cardNameInput = addForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addForm.querySelector(".popup__input_type_url");
const avatarLinkInput = avatarForm.querySelector(".popup__input_type_url");

// Кнопки
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const avatarEditButton = document.querySelector(".profile__image-edit-button");

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
      () => {
        const likeButton = cardElement.querySelector(".card__like-button");
        const likeCounter = cardElement.querySelector(".card__like-counter");
        handleLikeCard(card._id, likeButton, likeCounter);
      },
      openImagePopup,
      currentUserId
    );
    cardsContainer.append(cardElement);
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

function handleLikeCard(cardId, likeButton, likeCounter) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  
  toggleLikeOnServer(cardId, isLiked)
    .then(updatedCard => {
      toggleLike(likeButton, likeCounter, updatedCard.likes.length);
    })
    .catch(err => {
      console.error("Ошибка при обновлении лайка:", err);
    });
}

function openImagePopup(cardData) {
  const image = imagePopup.querySelector(".popup__image");
  const caption = imagePopup.querySelector(".popup__caption");
  
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
        (cardId) => handleDeleteCard(cardId, cardElement),
        (cardId) => handleLikeCard(cardId, cardElement),
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
  clearValidation(editForm);
  openPopup(editPopup);
});

addButton.addEventListener("click", () => {
  addForm.reset();
  clearValidation(addForm);
  openPopup(addPopup);
});

avatarEditButton.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm);
  openPopup(avatarPopup);
});

editForm.addEventListener("submit", handleEditFormSubmit);
addForm.addEventListener("submit", handleAddFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Закрытие попапов
document.querySelectorAll(".popup__close").forEach(button => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

// Включение валидации
enableValidation();