import { el, mount } from "redom";
import BtnScoreItem from "../components/ScoreItemBtn.js";

/**
 * Класс NotFoundPage отвечает за рендеринг страницы 404-ошибки.
 *
 * @export
 * @class NotFoundPage
 * @typedef {NotFoundPage}
 */
export default class NotFoundPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница 404-ошибка.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   */
  constructor(wrapper, router) {
    this.wrapper = wrapper;
    this.router = router;
    this.btnNotFoundItem = new BtnScoreItem(this.router, "not-found__btn", () => {
      this.router.navigate("/score");
    });
  }

  /**
   * Рендер страницы 404-ошибки
   *
   * Этот метод создает структуру страницы, отображает заголовок и описание 404-ошибки.
   *
   * @param {HTMLElement} container - контейнер, где будет располагаться 404-ошибка
   * @returns {void} - Не возвращает значение
   */
  render(container) {
    const sectionNotFound = el("section.not-found");
    const notFoundContainer = el("div.container.not-found__container");
    const notFoundTitle = el("h2.title.not-found__title", "404");
    const notFoundParagraph = el("p.not-found__description", "Страницы такой нет");

    mount(notFoundContainer, notFoundTitle);
    mount(notFoundContainer, notFoundParagraph);
    this.btnNotFoundItem.render(notFoundContainer);
    mount(sectionNotFound, notFoundContainer);
    mount(container, sectionNotFound);
  }
}
