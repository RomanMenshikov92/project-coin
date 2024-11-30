import { el, mount } from "redom";
import { configSkeletonItem } from "../config/configSkeletonItem.js";
import ErrorDisplay from "../components/Error.js";

/**
 * Класс DivCurrencyYours отвечает за отображение валют пользователя.
 *
 * Этот класс создает интерфейс для отображения валют, которыми владеет пользователь,
 * и управляет логикой обновления данных о валютах.
 *
 * @export
 * @class DivCurrencyYours
 * @typedef {DivCurrencyYours}
 */
export default class DivCurrencyYours {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {string} token - Токен аутентификации пользователя.
   * @param {Object} currenciesPage - Экземпляр класса CurrencyPage, к которому относится блок валют пользователя.
   */
  constructor(token, currenciesPage) {
    this.currenciesPage = currenciesPage;
    this.token = token;
    this.yoursCurrencies = {};
    this.error = null;
    this.isLoading = true;
    this.errorDisplay = new ErrorDisplay();
    this.currencyYourWrapper = null;
    this.currencyYourTitle = null;
    this.currencyYourList = null;
  }

  /**
   * Рендер блока валют пользователя.
   *
   * Этот метод создает структуру блока валют пользователя и добавляет его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться блок валют пользователя.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.currencyYourWrapper = el(".currency__yours");
    this.currencyYourWrapper.id = "currencyYours";
    this.currencyYourWrapper.setAttribute("draggable", "true");
    this.currencyYourTitle = el("h3.title.currency__yours-title", "Ваши валюты");

    this.currencyYourList = el("ul.list-reset.currency__yours-list");

    mount(this.currencyYourWrapper, this.currencyYourTitle);
    mount(this.currencyYourWrapper, this.currencyYourList);
    mount(container, this.currencyYourWrapper);
  }

  /**
   * Обновление состояния компонента с новыми данными.
   *
   * Этот метод обновляет данные о валютах пользователя, статус загрузки и ошибки.
   *
   * @param {Object<Object>} yoursCurrencies - Валюты пользователя.
   * @param {boolean} isLoading - Статус загрузки данных.
   * @param {string|null} error - Сообщение об ошибке, если есть.
   * @returns {void} - Не возвращает значение.
   */
  update(yoursCurrencies, isLoading, error) {
    this.yoursCurrencies = yoursCurrencies;
    this.isLoading = isLoading;
    this.error = error;

    this.renderThyCurrency();
  }

  /**
   * Рендеринг валют пользователя в интерфейсе.
   *
   * Этот метод обновляет DOM в зависимости от состояния валют и ошибок.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderThyCurrency() {
    const item = this.currencyYourWrapper;
    const title = this.currencyYourTitle;
    const list = this.currencyYourList;
    list.innerHTML = "";

    const hasCurrencies =
      this.yoursCurrencies && typeof this.yoursCurrencies === "object" && Object.keys(this.yoursCurrencies).length > 0;
    if (!hasCurrencies && !this.isLoading && this.error === null) {
      item.classList.add("currency__yours--emptying");
      const emptyItem = el("div.currency__yours-empty", "В данный момент у вас нет валютных счетов");
      delete item.dataset.smConfig;
      item.innerHTML = "";
      mount(item, emptyItem);
      return;
    } else {
      item.classList.remove("currency__yours--emptying");
      item.querySelector("div.currency__yours-empty")?.remove();
    }

    if (this.isLoading && this.error === null) {
      item.classList.add("currency__yours--loading", "sm-loading");
      item.dataset.smConfig = configSkeletonItem;
      const loadingItem = el("div.currency__yours-load.sm-item-primary");
      item.innerHTML = "";
      mount(item, loadingItem);
      return;
    } else {
      item.classList.remove("currency__yours--loading", "sm-loading");
      delete item.dataset.smConfig;
      item.querySelector(`div.currency__yours-load.sm-item-primary`)?.remove();
    }

    if (this.error && !this.isLoading) {
      item.classList.add("currency__yours--error");
      const errorItem = el("div.currency__yours-failed", `Error: ${this.error}`);
      item.innerHTML = "";
      mount(item, errorItem);
      return;
    } else {
      item.classList.remove("currency__yours--error");
      item.querySelector("div.currency__yours-failed")?.remove();
    }

    for (let code in this.yoursCurrencies) {
      const currency = this.yoursCurrencies[code];
      const currencyYourItem = el("li.currency__yours-item");
      if (currency.amount > 0 && ["ETH", "BTC", "JPY", "USD", "RUB", "BYR"].includes(currency.code)) {
        const currencyYourItemType = el("span.currency__yours-item-type", currency.code);
        const currencyYourItemNumber = el("span.currency__yours-item-number", currency.amount.toFixed(2));

        mount(list, currencyYourItem);
        mount(currencyYourItem, currencyYourItemType);
        mount(currencyYourItem, currencyYourItemNumber);
      }
    }

    mount(item, title);
    mount(item, list);
  }
}
