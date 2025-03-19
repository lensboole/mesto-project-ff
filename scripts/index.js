// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list");

// @todo: Функция создания карточки
function addCard({ link, name }, deleteClick) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__image").src = link;
  cardElement.querySelector(".card__image").alt = name;
  cardElement.querySelector(".card__title").textContent = name;

  deleteButton.addEventListener("click", deleteClick);

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(event) {
  const card = event.target.closest(".card");
  card.remove();
}



// @todo: Вывести карточки на страницу
initialCards.forEach((card) => {
  const cardElement = addCard(card, deleteCard);
  cardsContainer.append(cardElement);
});
