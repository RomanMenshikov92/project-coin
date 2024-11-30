import { el, mount } from "redom";

/**
 * Класс Loader отвечает за создание и отображение анимации загрузки.
 *
 * Этот класс создает элемент загрузки с анимацией, который можно монтировать в указанный контейнер.
 *
 * @class
 */
export default class Loader {
  /**
   * Создает экземпляр класса Loader.
   *
   * @constructor
   */
  constructor() {
    this.element = null;
  }

  /**
   * Рендерит элемент загрузки и монтирует его в указанный контейнер.
   *
   * Этот метод создает элемент загрузки с тремя анимированными точками и добавляет его в контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирован элемент загрузки.
   * @returns {HTMLElement} - Возвращает созданный элемент загрузки.
   */
  render(container) {
    this.element = el("div.sk-wave.loader");
    const bounceDot1 = el("div.sk-wave-rect.loader-item");
    const bounceDot2 = el("div.sk-wave-rect.loader-item");
    const bounceDot3 = el("div.sk-wave-rect.loader-item");

    mount(this.element, bounceDot1);
    mount(this.element, bounceDot2);
    mount(this.element, bounceDot3);

    mount(container, this.element);
    return this.element;
  }

  /**
   * Удаляет элемент загрузки из DOM и очищает ссылку на него.
   *
   * Этот метод удаляет элемент загрузки, если он существует, и устанавливает свойство element в null.
   *
   * @returns {void} - Не возвращает значение.
   */
  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
