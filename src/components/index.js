import "/src/pages/index.css";
import { createCard, deleteCard, toggleLike } from "./card.js";
import { initialCards } from "./cards.js";
import avatar from "../images/avatar.jpg";
import { openPopup, closePopup } from "./modal.js";

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list");

// @todo: Вывести карточки на страницу
initialCards.forEach((card) => {
  const cardElement = createCard(card, deleteCard, toggleLike, openImagePopup);
  cardsContainer.append(cardElement);
});

// Получаем элементы
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const closeButtons = document.querySelectorAll(".popup__close");
const popupImage = imagePopup.querySelector(".popup__image");
const popupImageCaption = imagePopup.querySelector(".popup__caption");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = editPopup.querySelector(".popup__input_type_name");
const descriptionInput = editPopup.querySelector(".popup__input_type_description");
const editForm = editPopup.querySelector(".popup__form");
const newCardForm = newCardPopup.querySelector(".popup__form");
const popups = [editPopup, newCardPopup, imagePopup];
const profileImage = document.querySelector(".profile__image");
const nameInputFormProfile = editPopup.querySelector(".popup__input_type_name");
const jobInputFormProfile = editPopup.querySelector(".popup__input_type_description");
const nameInputFormAddNewCard = newCardPopup.querySelector(".popup__input_type_card-name");
const linkInputFormAddNewCard = newCardPopup.querySelector(".popup__input_type_url");

// Обработчики событий для кнопок открытия модальных окон
editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openPopup(editPopup);
});

addButton.addEventListener("click", () => openPopup(newCardPopup));

// Обработчик события для закрытия модальных окон по нажатию на крестик
closeButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const popup = event.target.closest(".popup");
    closePopup(popup);
  });
});

popups.forEach((popup) => {
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup(popup);
    }
  });
});

// Обработчик клика по изображениям в карточках и кнопкам лайков с использованием делегирования событий
function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupImageCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInputFormProfile.value;
  profileDescription.textContent = jobInputFormProfile.value;
  closePopup(editPopup);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    link: linkInputFormAddNewCard.value,
    name: nameInputFormAddNewCard.value,
  };
  const newCardElement = createCard(
    newCardData,
    deleteCard,
    toggleLike,
    openImagePopup
  );
  cardsContainer.prepend(newCardElement);
  closePopup(newCardPopup);
  evt.target.reset();
}

editForm.addEventListener("submit", handleProfileFormSubmit);
newCardForm.addEventListener("submit", handleCardFormSubmit);

// добавили аватар
profileImage.style.backgroundImage = `url(${avatar})`;