import { el, mount } from "redom";
import Logo from "../../assets/images/Logo.svg";

/**
 * Класс Logotype отвечает за создание и отображение логотипа приложения.
 *
 * Этот класс создает ссылку на логотип и монтирует его в указанный контейнер.
 *
 * @export
 * @class Logotype
 * @typedef {Logotype}
 */
export default class Logotype {
  /**
   * Рендерит логотип и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться логотип.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    const linkLogo = el("a.header__link.header__link--logo", { href: "#/score" });
    const logo = el("img.header__img", { id: "img-logo", src: Logo, alt: "Логотип Coin" });
    mount(linkLogo, logo);
    mount(container, linkLogo);
  }
}
