import { el, mount } from "redom";

/**
 * Класс Main отвечает за создание и отображение основного содержимого приложения.
 *
 * Этот класс создает основной элемент и монтирует его в указанный контейнер.
 *
 * @export
 * @class Main
 * @typedef {Main}
 */
export class Main {
  /**
   * Создает экземпляр класса Main.
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка для основного содержимого.
   */
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.main = el("main.main");
  }

  /**
   * Рендерит основной элемент и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться основной элемент.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    mount(container, this.main);
  }
}
