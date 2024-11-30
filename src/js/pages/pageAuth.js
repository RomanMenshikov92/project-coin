import { el, mount } from "redom";
import FormAuth from "../components/AuthForm.js";
import Loader from "../components/Loader.js";

/**
 * Класс AuthPage отвечает за рендеринг страницы аутентификации.
 *
 * @export
 * @class AuthPage
 * @typedef {AuthPage}

 */
export default class AuthPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница аутентификации.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   */
  constructor(wrapper, router) {
    this.wrapper = wrapper;
    this.router = router;
    this.formAuth = new FormAuth(this.router, this);
    this.loader = new Loader();
    this.modalAuth = null;
  }

  /**
   * Рендер страницы аутентификации
   *
   * Этот метод создает структуру страницы, отображает модальное окно с формой.
   *
   * @param {HTMLElement} container - контейнер, где будет располагаться форма аутентификации
   * @returns {void} - Не возвращает значение
   */
  render(container) {
    this.modalAuth = el("div.modal", { id: "modal", "aria-hidden": "true" });
    const modalAuthContent = el("div.modal__content");

    const titleAuth = el("h2.title.modal__title", "Вход в аккаунт");

    mount(this.modalAuth, modalAuthContent);
    mount(modalAuthContent, titleAuth);
    this.formAuth.render(modalAuthContent);
    mount(container, this.modalAuth);
  }
}
