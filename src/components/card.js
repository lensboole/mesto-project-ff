const cardTemplate = document.querySelector("#card-template").content;

export const createCard = (
  cardData,
  onDeleteCard,
  onLikeCard,
  onOpenImagePopup
) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteCardButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;

  cardImage.addEventListener("click", () => {
    onOpenImagePopup(cardData);
  });

  deleteCardButton.addEventListener("click", () => onDeleteCard(cardElement));

  likeButton.addEventListener("click", () => onLikeCard(likeButton));

  return cardElement;
};

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function toggleLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}