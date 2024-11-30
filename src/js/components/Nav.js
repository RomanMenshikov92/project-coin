import { el, mount } from "redom";
import Cookies from "js-cookie";
import { config } from "../config/configRouter.js";
import IconInButton from "./Icons.js";

/**
 * Класс Nav отвечает за создание и отображение навигационного меню приложения.
 *
 * Этот класс управляет элементами меню, включая кнопки и ссылки,
 * а также обрабатывает логику для бургер-меню.
 *
 * @export
 * @class Nav
 * @typedef {Nav}
 */
export default class Nav {
  /**
   * Создает экземпляр класса Nav.
   *
   * @constructor
   * @param {Object} router - Экземпляр маршрутизатора для управления навигацией.
   * @param {Object} appIndex - Экземпляр класса App (основного приложения), который содержит верхнюю часть сайта.
   */
  constructor(router, appIndex) {
    this.router = router;
    this.appIndex = appIndex;
    this.nav = null;
    this.listMenu = null;
    this.listMenuBurger = null;
    this.btnBurger = null;
    this.isBurgerMenuOpen = false;
  }

  /**
   * Рендерит навигационное меню и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться навигационное меню.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.nav = el("nav.header__menu");

    this.listMenu = el("ul.list-reset.header__menu-list");
    const linkATMs = el("li.header__menu-item", [
      el("a.header__menu-link.header__menu-link--authenticated", { href: "#/banks" }, "Банкоматы"),
    ]);
    const linkScore = el("li.header__menu-item", [
      el("a.header__menu-link.header__menu-link--authenticated", { href: "#/score" }, "Счета"),
    ]);
    const linkCurrency = el("li.header__menu-item", [
      el("a.header__menu-link.header__menu-link--authenticated", { href: "#/currency" }, "Валюта"),
    ]);
    const linkLogout = el("li.header__menu-item", [
      el("a.header__menu-link.header__menu-link--authenticated", { href: "#/auth" }, "Выйти"),
    ]);
    linkLogout.addEventListener("click", () => this.logout());

    this.listMenuBurger = el("ul.list-reset.header__menu-list-burger");
    const linkATMsBurger = el("li.header__menu-item-burger", [
      el("a.header__menu-link-burger.header__menu-link-burger--authenticated", { href: "#/banks" }, "Банкоматы"),
    ]);
    const linkScoreBurger = el("li.header__menu-item-burger", [
      el("a.header__menu-link-burger.header__menu-link-burger--authenticated", { href: "#/score" }, "Счета"),
    ]);
    const linkCurrencyBurger = el("li.header__menu-item-burger", [
      el("a.header__menu-link-burger.header__menu-link-burger--authenticated", { href: "#/currency" }, "Валюта"),
    ]);
    const linkLogoutBurger = el("li.header__menu-item-burger", [
      el("a.header__menu-link-burger.header__menu-link-burger--authenticated", { href: "#/auth" }, "Выйти"),
    ]);
    linkLogoutBurger.addEventListener("click", () => this.logout());

    mount(this.listMenuBurger, linkATMsBurger);
    mount(this.listMenuBurger, linkScoreBurger);
    mount(this.listMenuBurger, linkCurrencyBurger);
    mount(this.listMenuBurger, linkLogoutBurger);

    this.btnBurger = el("button.btn-reset.header__menu-btn");
    const iconBurgerBtn = new IconInButton(
      null,
      null,
      null,
      null,
      null,
      "header__menu-btn-svg header__menu-btn-svg--active",
      this.btnBurger
    );
    iconBurgerBtn.renderBurgerMenuIcon();
    this.btnBurger.addEventListener("click", () => this.toggleBurgerMenu());

    this.listMenuBurger.querySelectorAll(".header__menu-link-burger").forEach((link) => {
      link.addEventListener("click", () => {
        this.toggleBurgerMenu();
        this.router.navigate(link.getAttribute("href").replace("#", ""));
      });
    });

    mount(this.listMenu, linkATMs);
    mount(this.listMenu, linkScore);
    mount(this.listMenu, linkCurrency);
    mount(this.listMenu, linkLogout);
    mount(this.nav, this.listMenu);
    mount(this.nav, this.listMenuBurger);
    mount(this.nav, this.btnBurger);

    mount(container, this.nav);
  }

  /**
   * Обновляет навигацию в меню в зависимости от текущего маршрута.
   *
   * @param {string} route - Текущий маршрут для обновления навигации.
   * @returns {void} - Не возвращает значение.
   */
  updateNavigation(route) {
    const links = this.nav.querySelectorAll("a");
    links.forEach((link) => {
      if (!link.classList.contains("header__menu-link--logo")) {
        link.classList.remove("header__menu-link--active");
      }
    });

    const activeLink = Array.from(links).find((link) => {
      const href = link.getAttribute("href").replace("#/", "");
      return route.startsWith(href);
    });

    if (activeLink && !activeLink.classList.contains("header__menu-link--logo")) {
      activeLink.classList.add("header__menu-link--active");
    }
    this.nav.style.display = `/${route}` === config.routes.auth ? "none" : "block";
  }

  /**
   * Выполняет выход пользователя из приложения.
   *
   * Удаляет токен из cookies и перенаправляет на страницу аутентификации.
   *
   * @returns {void} - Не возвращает значение.
   */
  logout() {
    const token = Cookies.get("token");
    if (token) {
      Cookies.remove("token");
      this.router.navigate("auth");
    }
    this.appIndex.clearCache();
  }

  /**
   * Переключает состояние бургер-меню.
   *
   * Открывает или закрывает бургер-меню в зависимости от текущего состояния.
   *
   * @returns {void} - Не возвращает значение.
   */
  toggleBurgerMenu() {
    this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
    if (this.isBurgerMenuOpen) {
      this.nav.appendChild(this.listMenuBurger);
      this.listMenuBurger.classList.add("header__menu-list-burger--active");
      this.btnBurger.querySelector(".header__menu-btn-svg").classList.remove("header__menu-btn-svg--active");
      this.btnBurger.querySelector(".header__menu-btn-svg").classList.add("header__menu-btn-svg--non-active");
    } else {
      this.nav.removeChild(this.listMenuBurger);
      this.listMenuBurger.classList.remove("header__menu-list-burger--active");
      this.btnBurger.querySelector(".header__menu-btn-svg").classList.remove("header__menu-btn-svg--non-active");
      this.btnBurger.querySelector(".header__menu-btn-svg").classList.add("header__menu-btn-svg--active");
    }
  }
}
