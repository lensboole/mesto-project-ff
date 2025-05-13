// Функция для открытия модального окна
export function openPopup(popup) {
  // Добавляем класс для отображения попапа
  popup.classList.add("popup_is-opened");
  // Вешаем обработчик для закрытия по Esc
  document.addEventListener("keydown", closeEscPopup);
}

// Функция для закрытия модального окна
export function closePopup(popup) {
  // Удаляем класс, скрывающий попап
  popup.classList.remove("popup_is-opened");
  // Удаляем обработчик Esc
  document.removeEventListener("keydown", closeEscPopup);
}

// Обработчик для закрытия по Esc
export function closeEscPopup(e) {
  if (e.key === "Escape") {
    // Находим открытый попап по классу 'popup_is-opened'
    const openPopup = document.querySelector(".popup.popup_is-opened");
    if (openPopup) {
      closePopup(openPopup);
    }
  }
}