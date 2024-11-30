import { el, mount } from "redom";
import IconInButton from "./Icons.js";

/**
 * Класс BtnScoreItem отвечает за создание кнопки для возврата на предыдущую страницу.
 *
 * Этот класс создает кнопку и обрабатывает событие нажатия, чтобы вернуть пользователя на предыдущую страницу.
 *
 * @export
 * @class BtnScoreItem
 * @typedef {BtnScoreItem}
 */
export default class BtnScoreItem {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {Object} router - Экземпляр класса маршрутизатора, который управляет навигацией между страницами.
   * @param {string} buttonClass - CSS класс для стилизации кнопки.
   * @param {function} onClickAction - Функция-обработчик события нажатия на кнопку.
   */
  constructor(router, buttonClass, onClickAction) {
    this.router = router;
    this.buttonClass = buttonClass;
    this.onClickAction = onClickAction;
  }

  /**
   * Рендер кнопки для возврата на предыдущую страницу.
   *
   * Этот метод создает элемент кнопки, добавляет к нему иконку и устанавливает обработчик события нажатия.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирована кнопка.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    const scoresItemBackBtn = el(`button.btn-reset.${this.buttonClass}`, { id: "btnScoreBack", type: "button" });
    const iconBackBtn = new IconInButton(null, null, null, scoresItemBackBtn, null);
    iconBackBtn.renderArrowBackIcon();

    scoresItemBackBtn.addEventListener("click", this.onClickAction);

    mount(container, scoresItemBackBtn);
  }
}
