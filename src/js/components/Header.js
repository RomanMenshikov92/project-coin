import { el, mount } from "redom";
import Logotype from "./Logo.js";
import Nav from "./Nav.js";

/**
 * Класс Header отвечает за создание и отображение заголовка приложения.
 *
 * Этот класс управляет логотипом и навигационным меню, а также взаимодействует с маршрутизатором.
 *
 * @export
 * @class Header
 * @typedef {Header}
 */
export class Header {
  /**
   * Создает экземпляр класса Header.
   *
   * @constructor
   * @param {Object} router - Экземпляр маршрутизатора для управления навигацией.
   * @param {Object} appIndex - Экземпляр класса App (основного приложения), который содержит верхнюю часть сайта.
   */
  constructor(router, appIndex) {
    this.router = router;
    this.appIndex = appIndex;
    this.header = el("header.header");
    this.containerHeader = el("div.container.header__container");
    this.logotype = new Logotype(this.router);
    this.nav = new Nav(this.router, this.appIndex);
  }

  /**
   * Рендерит заголовок и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться заголовок.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.logotype.render(this.containerHeader);
    this.nav.render(this.containerHeader);
    mount(this.containerHeader, this.nav.nav);
    mount(this.header, this.containerHeader);
    mount(container, this.header);
  }

  /**
   * Обновляет навигацию в заголовке в зависимости от текущего маршрута.
   *
   * @param {string} route - Текущий маршрут для обновления навигации.
   * @returns {void} - Не возвращает значение.
   */
  updateNavigation(route) {
    this.nav.updateNavigation(route);
  }
}
