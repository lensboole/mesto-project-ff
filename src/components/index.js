import "/src/pages/index.css";
import { initialCards, addCard, deleteCard, toggleLike } from "./card.js";
import avatar from "../images/avatar.jpg";
import { openPopup, closePopup } from "./modal.js";

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list");

// @todo: Вывести карточки на страницу
initialCards.forEach((card) => {
  const cardElement = addCard(card, deleteCard);
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
const popupCaption = imagePopup.querySelector(".popup__caption");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Обработчики событий для кнопок открытия модальных окон
editButton.addEventListener("click", () => {
  const nameInput = editPopup.querySelector(".popup__input_type_name");
  const descriptionInput = editPopup.querySelector(
    ".popup__input_type_description"
  );

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

const popups = [editPopup, newCardPopup, imagePopup];

popups.forEach((popup) => {
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup(popup);
    }
  });
});

// Обработчик клика по изображениям в карточках и кнопкам лайков с использованием делегирования событий
cardsContainer.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("card__image")) {
    const imgSrc = evt.target.getAttribute("src");
    const imgAlt = evt.target.getAttribute("alt");

    popupImage.setAttribute("src", imgSrc);
    popupImage.setAttribute("alt", imgAlt);

    const captionText = evt.target
      .closest(".card")
      .querySelector(".card__title").textContent;
    popupCaption.textContent = captionText;

    openPopup(imagePopup);
  } else if (evt.target.classList.contains("card__like-button")) {
    toggleLike(evt);
  }
});

// Находим форму в DOM для редактирования профиля и добавления новой карточки
const formElementEditProfile = editPopup.querySelector(".popup__form");
const formElementNewCard = newCardPopup.querySelector(".popup__form");

// Обработчик «отправки» формы редактирования профиля и добавления новой карточки
function handleFormSubmit(evt, isProfileEdit) {
  evt.preventDefault();

  if (isProfileEdit) {
    const nameInputEditProfile = editPopup.querySelector(".popup__input_type_name");
    const jobInputEditProfile = editPopup.querySelector(".popup__input_type_description");

    profileTitle.textContent = nameInputEditProfile.value;
    profileDescription.textContent = jobInputEditProfile.value;

    closePopup(editPopup);
  } else {
    const nameInputNewCard = newCardPopup.querySelector(".popup__input_type_card-name");
    const linkInputNewCard = newCardPopup.querySelector(".popup__input_type_url");
    const newCardData = { link: linkInputNewCard.value, name: nameInputNewCard.value };
    const newCardElement = addCard(newCardData, deleteCard);

    cardsContainer.prepend(newCardElement);
    closePopup(newCardPopup);

    // Очищаем поля ввода после добавления карточки
    nameInputNewCard.value = "";
    linkInputNewCard.value = "";
  }
}

// Прикрепляем обработчики к формам:
formElementEditProfile.addEventListener("submit", (evt) =>
  handleFormSubmit(evt, true)
);
formElementNewCard.addEventListener("submit", (evt) =>
  handleFormSubmit(evt, false)
);

// добавили аватар
const profileImage = document.querySelector(".profile__image");
profileImage.style.backgroundImage = `url(${avatar})`;
