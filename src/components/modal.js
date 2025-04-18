
// Функция для открытия модального окна
 export function openPopup(popup) {
  popup.classList.add("popup_is-opened"); // Используем класс для отображения

  // Добавляем обработчик события для Esc
  function handleEscKey(event) {
    if (event.key === "Escape") {
      closePopup(popup);
    }
  }

  // Добавляем обработчик события на документ
  document.addEventListener("keydown", handleEscKey);

  // Удаляем обработчик события при закрытии попапа
  popup.addEventListener("close", () => {
    document.removeEventListener("keydown", handleEscKey);
  });
}

// Функция для закрытия модального окна
 export function closePopup(popup) {
  popup.classList.remove("popup_is-opened"); // Используем класс для скрытия

  // Генерируем событие 'close' для удаления обработчика
  const event = new Event("close");
  popup.dispatchEvent(event);
}