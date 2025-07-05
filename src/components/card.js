const cardTemplate = document.querySelector("#card-template").content;

export const createCard = (
  cardData,
  onDeleteClick,
  onLikeClick,
  onImageClick,
  currentUserId
) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  
  if (cardData.owner._id === currentUserId) {
    deleteButton.classList.add('card__delete-button_visible');
  } else {
    deleteButton.classList.remove('card__delete-button_visible');
  }

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Обработчики событий
  cardImage.addEventListener("click", () => onImageClick(cardData));
  deleteButton.addEventListener("click", () => onDeleteClick());
  likeButton.addEventListener("click", () => onLikeClick(likeButton, likeCounter));

  return cardElement;
};

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function toggleLike(likeButton, likeCounter, likesCount) {
  likeButton.classList.toggle("card__like-button_is-active");
  likeCounter.textContent = likesCount;
}

